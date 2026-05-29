import express from "express";
import passport from "passport";

import verifyRoute from "../middleware/partner.protected.middleware.js";
import config from "../config/config.js";

import partnerCreateTokenAndSetCookie from '../utils/partnerCreateTokenAndSetCookie.js'

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
} from "../controllers/partner.controller.js";

const router = express.Router();
const { NODE_ENV } = config;

/* =========================================
   TEST ROUTE
========================================= */

router.get("/test", (req, res) => {
  res.status(200).send("Partner route test success");
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
  passport.authenticate("google-partner", {
    scope: ["profile", "email"],
  }),
);

const CLIENT_URI = NODE_ENV === "production" ? "" : "http://localhost:5173";
// Google Callback
router.get(
  "/google/callback",

  passport.authenticate("google-partner", {
    failureRedirect: `${CLIENT_URI}/login`,
    session: false,
  }),

  async (req, res) => {
    try {
      // Redirect frontend after success
      await partnerCreateTokenAndSetCookie(req.user._id,res);
      return res.redirect(`${CLIENT_URI}/partner/dashboard`);
    } catch (error) {
      console.log(error);

      return res.redirect(`${CLIENT_URI}/login`);
    }
  },
);

/* =========================================
   VERIFICATION ROUTES
========================================= */

router.post("/verify-email", verify);

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
