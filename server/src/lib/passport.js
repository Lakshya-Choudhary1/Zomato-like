import passport from "passport";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import bcrypt from "bcrypt";
import validator from "validator";

import userModel from "../models/user.model.js";
import partnerModel from "../models/partner.model.js";

import config from "../config/config.js";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BCRYPT_SALT_ROUND, NODE_ENV } =
  config;

/* =========================================
   CALLBACK URLS
========================================= */

const BASE_URL =
  NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://api.yourdomain.com";

const userCallbackURL = `${BASE_URL}/api/user/google/callback`;

const partnerCallbackURL = `${BASE_URL}/api/partner/google/callback`;

/* =========================================
   HELPER
========================================= */

const sanitizeUser = (data) => {
  const safeData = data.toObject();

  delete safeData.password;
  delete safeData.verificationToken;
  delete safeData.resetPasswordToken;

  return safeData;
};

/* =========================================
   USER GOOGLE STRATEGY
========================================= */

passport.use(
  "google-user",

  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,

      clientSecret: GOOGLE_CLIENT_SECRET,

      callbackURL: userCallbackURL,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase()?.trim();

        if (!email || !validator.isEmail(email)) {
          return done(new Error("Invalid Google email"), false);
        }

        let user = await userModel.findOne({
          email,
        });

        // ================= CREATE USER =================
        if (!user) {
          const hashedPassword = await bcrypt.hash(
            `google_${profile.id}`,
            Number(BCRYPT_SALT_ROUND),
          );

          user = await userModel.create({
            fullName: profile.displayName || "Google User",

            email,

            avatar: profile.photos?.[0]?.value || "",

            verified: true,

            googleId: profile.id,

            password: hashedPassword,
          });
        }
       
        return done(null, {
          ...sanitizeUser(user),
          role: "user",
        });
        
      } catch (error) {
        console.log(error);

        return done(error, false);
      }
    },
  ),
);

/* =========================================
   PARTNER GOOGLE STRATEGY
========================================= */

passport.use(
  "google-partner",

  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,

      clientSecret: GOOGLE_CLIENT_SECRET,

      callbackURL: partnerCallbackURL,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase()?.trim();

        if (!email || !validator.isEmail(email)) {
          return done(new Error("Invalid Google email"), false);
        }

        let partner = await partnerModel.findOne({
          email,
        });

        // ================= CREATE PARTNER =================
        if (!partner) {
          const hashedPassword = await bcrypt.hash(
            `google_${profile.id}`,
            Number(BCRYPT_SALT_ROUND),
          );

          partner = await partnerModel.create({
            fullName: profile.displayName || "Google Partner",

            email,

            avatar: profile.photos?.[0]?.value || "",

            verified: true,

            googleId: profile.id,

            password: hashedPassword,
          });
        }

        return done(null, {
          ...sanitizeUser(partner),
          role: "partner",
        });
      } catch (error) {
        console.log(error);

        return done(error, false);
      }
    },
  ),
);

export default passport;
