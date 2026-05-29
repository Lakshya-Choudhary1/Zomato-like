import transporter from "./mail/nodeMailer.js";
import {
  verificationTemplate,
  forgotPasswordTemplate,
} from "./mail/template.js";
import config from "../config/config.js";

const { NODEMAILER_EMAIL, NODEMAILER_EMAIL_PASSWORD } = config;

const sendVerificationEmail = async (email, name, token) => {
  try {
    const mailOptions = {
      from: NODEMAILER_EMAIL,
      to: email,
      subject: "Email Verification",
      html: verificationTemplate(name, token),
    };
    const res = await transporter.sendMail(mailOptions);
    console.log(res.messageId);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

const sendForgotPasswordEmail = async (email, link) => {
  try {
    const mailOptions = {
      from: NODEMAILER_EMAIL,
      to: email,
      subject: "Password Reset",
      html: forgotPasswordTemplate(link),
    };
    const res = await transporter.sendMail(mailOptions);
    console.log(res.messageId);
  } catch (error) {
    console.error("Error sending forgot password email:", error);
    throw new Error("Failed to send forgot password email");
  }
};

export { sendVerificationEmail, sendForgotPasswordEmail };
