import bcrypt from "bcrypt";
import crypto from "crypto";
import validator from "validator";

import partnerModel from "../models/partner.model.js";
import config from "../config/config.js";

import partnerCreateTokenAndSetCookie from "../utils/partnerCreateTokenAndSetCookie.js";
import createVerificationToken from "../utils/createVerificationToken.js";
import createResetPasswordToken from "../utils/createResetPasswordToken.js";
import { uploadImageToCloudinary } from "../lib/uploadToCloudinary.js";
import { sendVerificationEmail, sendForgotPasswordEmail } from "../lib/mail.js";

const { BCRYPT_SALT_ROUND, JWT_PARTNER_TOKEN_NAME, NODE_ENV } = config;

// =====================================
// HELPER
// =====================================
const sanitizePartner = (partner) => {
  const safePartner = partner.toObject();

  delete safePartner.password;
  delete safePartner.verificationToken;
  delete safePartner.verificationTokenExpiresAt;
  delete safePartner.verificationTokenRequestedAt;
  delete safePartner.resetPasswordToken;
  delete safePartner.resetPasswordTokenExpiresAt;
  delete safePartner.resetPasswordRequestedAt;

  return safePartner;
};

// =====================================
// LOGIN
// =====================================
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

    const partner = await partnerModel
      .findOne({
        email: normalizedEmail,
      })
      .select("+password");

    if (!partner) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const validPassword = await bcrypt.compare(password, partner.password);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    partnerCreateTokenAndSetCookie(partner._id, res);

    return res.status(200).json({
      success: true,
      partner: sanitizePartner(partner),
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =====================================
// SIGNUP
// =====================================
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

    let partner = await partnerModel.findOne({
      email: normalizedEmail,
    });

    if (partner) {
      return res.status(409).json({
        success: false,
        message: "Partner already exists",
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

    partner = await partnerModel.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      verificationToken: hashedVerificationToken,
      verificationTokenExpiresAt: Date.now() + 3600000,
      verificationTokenRequestedAt: Date.now(),
    });

    // TODO:
    // Send rawVerificationToken in email
    await sendVerificationEmail(
      partner.email,
      partner.fullName,
      rawVerificationToken,
    );

    partnerCreateTokenAndSetCookie(partner._id, res);

    return res.status(201).json({
      success: true,
      partner: sanitizePartner(partner),
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =====================================
// LOGOUT
// =====================================
const logout = async (req, res) => {
  try {
    res.clearCookie(JWT_PARTNER_TOKEN_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    if (req.user && req.logout) {
      req.logout();
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

// =====================================
// RESEND VERIFICATION TOKEN
// =====================================
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

    const partner = await partnerModel
      .findOne({
        email: normalizedEmail,
      })
      .select("+verificationTokenRequestedAt");

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    if (partner.verified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    if (
      partner.verificationTokenRequestedAt &&
      Date.now() - partner.verificationTokenRequestedAt < 1000000
    ) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting again",
      });
    }

    const rawVerificationToken = await createVerificationToken();

    console.log(rawVerificationToken);

    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(rawVerificationToken)
      .digest("hex");

    partner.verificationToken = hashedVerificationToken;

    partner.verificationTokenExpiresAt = Date.now() + 3600000;

    partner.verificationTokenRequestedAt = Date.now();

    await partner.save();

    // TODO:
    // Send rawVerificationToken in email
    await sendVerificationEmail(
      partner.email,
      partner.fullName,
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

// =====================================
// VERIFY EMAIL
// =====================================
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

    const partner = await partnerModel.findOne({
      verificationToken: hashedVerificationToken,
      verificationTokenExpiresAt: {
        $gt: Date.now(),
      },
    });

    if (!partner) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    if (partner.verified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    partner.verified = true;

    partner.verificationToken = null;
    partner.verificationTokenExpiresAt = null;
    partner.verificationTokenRequestedAt = null;

    await partner.save();

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

// =====================================
// FORGOT PASSWORD
// =====================================
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

    const partner = await partnerModel.findOne({
      email: normalizedEmail,
    });

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    if (
      partner.resetPasswordRequestedAt &&
      Date.now() - partner.resetPasswordRequestedAt < 60000
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

    partner.resetPasswordToken = hashedResetPasswordToken;

    partner.resetPasswordTokenExpiresAt = Date.now() + 3600000;

    partner.resetPasswordRequestedAt = Date.now();

    await partner.save();

    // TODO:
    // Send rawResetPasswordToken in email
    const BASE_URL =
      NODE_ENV === "development"
        ? "http://localhost:5173"
        : "<-- TODO SETUP WHEN DEPLOY";

    const resetPasswordLink = `${BASE_URL}/reset-password/${rawResetPasswordToken}`;

    await sendForgotPasswordEmail(partner.email, resetPasswordLink);

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

// =====================================
// RESET PASSWORD
// =====================================
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

    const partner = await partnerModel.findOne({
      resetPasswordToken: hashedResetPasswordToken,
      resetPasswordTokenExpiresAt: {
        $gt: Date.now(),
      },
    });

    if (!partner) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(BCRYPT_SALT_ROUND),
    );

    partner.password = hashedPassword;

    partner.resetPasswordToken = null;
    partner.resetPasswordTokenExpiresAt = null;
    partner.resetPasswordRequestedAt = null;

    await partner.save();

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

// =====================================
// UPDATE AVATAR
// =====================================
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

    if (avatar.length > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "Image too large",
      });
    }

    const partner = await partnerModel.findById(req.partnerId);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    const cloudinaryUrl = await uploadImageToCloudinary(avatar);

    partner.avatar = cloudinaryUrl;

    await partner.save();

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

const checkAuth = async (req, res) => {
  try {
    const partnerId = req.partnerId;

    const partner = await partnerModel.findById(partnerId);

    if (!partner) {
      return res
        .status(400)
        .json({ success: false, message: "NO User Exists!" });
    }

    return res
      .status(200)
      .json({ success: true, partner: sanitizePartner(partner) });
  } catch (err) {
    console.log(err);

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
