import dotenv from "dotenv";

dotenv.config();


const config = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: Number(process.env.PORT) || 3000,

  SESSION_SECRET: process.env.SESSION_SECRET,

  WHITELIST_URI: process.env.WHITELIST_URI
    ? process.env.WHITELIST_URI.split(",")
    : [],

  MONGO_URI: process.env.MONGO_URI,

  JWT_USER_TOKEN_NAME: process.env.JWT_USER_TOKEN_NAME,
  JWT_USER_SECRET: process.env.JWT_USER_SECRET,

  JWT_PARTNER_TOKEN_NAME: process.env.JWT_PARTNER_TOKEN_NAME,
  JWT_PARTNER_SECRET: process.env.JWT_PARTNER_SECRET,

  BCRYPT_SALT_ROUND: Number(process.env.BCRYPT_SALT_ROUND) || 14,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,

  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,

  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,

  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL,
  NODEMAILER_EMAIL_PASSWORD: process.env.NODEMAILER_EMAIL_PASSWORD,
};

export const BASE_URL = config.NODE_ENV == "development"
        ? "http://localhost:5173"
        : "https://zomato-like-d4bh.onrender.com";;


export default config;
