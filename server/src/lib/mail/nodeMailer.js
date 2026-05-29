import nodemailer from "nodemailer";
import config from "../../config/config.js";

const { NODEMAILER_EMAIL, NODEMAILER_EMAIL_PASSWORD } = config;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: NODEMAILER_EMAIL,
    pass: NODEMAILER_EMAIL_PASSWORD,
  },
});

export default transporter;
