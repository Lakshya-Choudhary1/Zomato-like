import bcrypt from "bcrypt";
import crypto from "crypto";
import validator from "validator";

import userModel from "../models/user.model.js";
import config,{BASE_URL} from "../config/config.js";

import userCreateTokenAndSetCookie from "../utils/userCreateTokenAndSetCookie.js";
import createVerificationToken from "../utils/createVerificationToken.js";
import createResetPasswordToken from "../utils/createResetPasswordToken.js";

import { uploadImageToCloudinary } from "../lib/uploadToCloudinary.js";

import { sendVerificationEmail, sendForgotPasswordEmail } from "../lib/mail.js";

const { BCRYPT_SALT_ROUND, JWT_USER_TOKEN_NAME, NODE_ENV } = config;


/* =====================================
   HELPER
===================================== */

const sanitizeUser = (user) => {
  const safeUser = user.toObject();

  delete safeUser.password;

  delete safeUser.verificationToken;
  delete safeUser.verificationTokenExpiresAt;
  delete safeUser.verificationTokenRequestedAt;

  delete safeUser.resetPasswordToken;
  delete safeUser.resetPasswordTokenExpiresAt;
  delete safeUser.resetPasswordRequestedAt;

  return safeUser;
};

/* =====================================
   LOGIN
===================================== */

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing credentials",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    const user = await userModel
      .findOne({
        email: normalizedEmail,
      })
      .select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account has been blocked",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    user.lastLoginAt = new Date();

    await user.save();

    userCreateTokenAndSetCookie(user._id, res);

    return res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =====================================
   SIGNUP
===================================== */

const signup = async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        message: "Missing credentials",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!validator.isEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!strongPassword.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain uppercase, lowercase, number and minimum 8 characters",
      });
    }

    let user = await userModel.findOne({
      email: normalizedEmail,
    });

    if (user) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(BCRYPT_SALT_ROUND),
    );

    const rawVerificationToken = await createVerificationToken();

    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(rawVerificationToken)
      .digest("hex");

    user = await userModel.create({
      fullName: fullName.trim(),

      email: normalizedEmail,

      password: hashedPassword,

      verificationToken: hashedVerificationToken,

      verificationTokenExpiresAt: Date.now() + 3600000,

      verificationTokenRequestedAt: Date.now(),
    });

    await sendVerificationEmail(
      user.email,
      user.fullName,
      rawVerificationToken,
    );

    userCreateTokenAndSetCookie(user._id, res);

    return res.status(201).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =====================================
   LOGOUT
===================================== */

const logout = async (req, res) => {
  try {
    res.clearCookie(JWT_USER_TOKEN_NAME, {
      httpOnly: true,

      secure: NODE_ENV === "production",

      sameSite: NODE_ENV === "production" ? "none" : "lax",
    });

    if (req.user && req.logout) {
      req.logout(() => {});
    }

    if (req.session) {
      req.session.destroy(() => {});
    }

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =====================================
   RESEND VERIFICATION TOKEN
===================================== */

const resendVerificationToken = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Missing email",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await userModel
      .findOne({
        email: normalizedEmail,
      })
      .select("+verificationTokenRequestedAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.verified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    if (
      user.verificationTokenRequestedAt &&
      Date.now() - user.verificationTokenRequestedAt < 60000
    ) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting again",
      });
    }

    const rawVerificationToken = await createVerificationToken();

    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(rawVerificationToken)
      .digest("hex");

    user.verificationToken = hashedVerificationToken;

    user.verificationTokenExpiresAt = Date.now() + 3600000;

    user.verificationTokenRequestedAt = Date.now();

    await user.save();

    await sendVerificationEmail(
      user.email,
      user.fullName,
      rawVerificationToken,
    );

    return res.status(200).json({
      success: true,
      message: "Verification token resent successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =====================================
   VERIFY EMAIL
===================================== */

const verify = async (req, res) => {
  const { verificationToken } = req.body;

  try {
    if (!verificationToken) {
      return res.status(400).json({
        success: false,
        message: "Missing verification token",
      });
    }

    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const user = await userModel.findOne({
      verificationToken: hashedVerificationToken,

      verificationTokenExpiresAt: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    if (user.verified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    user.verified = true;

    user.verificationToken = null;
    user.verificationTokenExpiresAt = null;
    user.verificationTokenRequestedAt = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =====================================
   FORGOT PASSWORD
===================================== */

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Missing email",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await userModel
      .findOne({
        email: normalizedEmail,
      })
      .select("+resetPasswordRequestedAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      user.resetPasswordRequestedAt &&
      Date.now() - user.resetPasswordRequestedAt < 60000
    ) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting again",
      });
    }

    const rawResetPasswordToken = createResetPasswordToken();

    const hashedResetPasswordToken = crypto
      .createHash("sha256")
      .update(rawResetPasswordToken)
      .digest("hex");

    user.resetPasswordToken = hashedResetPasswordToken;

    user.resetPasswordTokenExpiresAt = Date.now() + 3600000;

    user.resetPasswordRequestedAt = Date.now();

    await user.save();



    const resetPasswordLink = `${BASE_URL}/user/reset-password/${rawResetPasswordToken}`;

    await sendForgotPasswordEmail(user.email, resetPasswordLink);

    return res.status(200).json({
      success: true,
      message: "Reset link sent successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =====================================
   RESET PASSWORD
===================================== */

const resetPassword = async (req, res) => {
  const { resetPasswordToken } = req.params;

  const { password } = req.body;

  try {
    if (!resetPasswordToken || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing credentials",
      });
    }

    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!strongPassword.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Weak password",
      });
    }

    const hashedResetPasswordToken = crypto
      .createHash("sha256")
      .update(resetPasswordToken)
      .digest("hex");

    const user = await userModel.findOne({
      resetPasswordToken: hashedResetPasswordToken,

      resetPasswordTokenExpiresAt: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(BCRYPT_SALT_ROUND),
    );

    user.password = hashedPassword;

    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiresAt = null;
    user.resetPasswordRequestedAt = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =====================================
   UPDATE AVATAR
===================================== */

const updateAvatar = async (req, res) => {
  const { avatar } = req.body;

  try {
    if (!avatar) {
      return res.status(400).json({
        success: false,
        message: "Missing avatar",
      });
    }

    if (typeof avatar !== "string" || !avatar.startsWith("data:image")) {
      return res.status(400).json({
        success: false,
        message: "Invalid image format",
      });
    }

    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cloudinaryUrl = await uploadImageToCloudinary(avatar);

    user.avatar = cloudinaryUrl;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully",

      avatar: cloudinaryUrl,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating avatar",
    });
  }
};

/* =====================================
   CHECK AUTH
===================================== */

const checkAuth = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user exists",
      });
    }

    return res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error while checking authentication",
    });
  }
};

export {
  login,
  signup,
  logout,
  resendVerificationToken,
  verify,
  forgotPassword,
  resetPassword,
  updateAvatar,
  checkAuth,
};
