import express from "express";
import passport from "passport";

import verifyRoute from "../middleware/user.protected.middleware.js";
import config from "../config/config.js";

import userCreateTokenAndSetCookie from "../utils/userCreateTokenAndSetCookie.js"

import {
  signup,
  login,
  logout,
  resendVerificationToken,
  verify,
  forgotPassword,
  resetPassword,
  updateAvatar,
  checkAuth,
} from "../controllers/user.controller.js";

const router = express.Router();
const { NODE_ENV } = config;
const CLIENT_URI = NODE_ENV === "production" ? "" : "http://localhost:5173";

/* =========================================
   TEST ROUTE
========================================= */

router.get("/test", (req, res) => {
  res.status(200).send("User route test success");
});

/* =========================================
   NORMAL AUTH ROUTES
========================================= */
router.get("/check-auth", verifyRoute, checkAuth);

router.post("/signup", signup);

router.post("/login", login);

router.get("/logout", logout);

/* =========================================
   GOOGLE OAUTH ROUTES
========================================= */

// Start Google Login
router.get(
  "/google",

  passport.authenticate("google-user", {
    scope: ["profile", "email"],
  }),
);

// Google Callback
router.get(
  "/google/callback",

  passport.authenticate("google-user", {
    failureRedirect: `${CLIENT_URI}/login`,
    session: false,
  }),

  async (req, res) => {
    try {
      await userCreateTokenAndSetCookie(req.user._id,res);
      // Redirect frontend after login
      return res.redirect(`${CLIENT_URI}/user/dashboard`);
    } catch (error) {
      console.log(error);

      return res.redirect(`${CLIENT_URI}/login`);
    }
  },
);

/* =========================================
   VERIFICATION ROUTES
========================================= */

router.post("/verify", verify);

router.post("/resend-verification-token", resendVerificationToken);

/* =========================================
   PASSWORD ROUTES
========================================= */

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:resetPasswordToken", resetPassword);

/* =========================================
   PROFILE ROUTES
========================================= */

router.patch("/update-avatar", verifyRoute, updateAvatar);

export default router;
