import jwt from "jsonwebtoken";
import config from "../config/config.js";

const { JWT_PARTNER_TOKEN_NAME, JWT_PARTNER_SECRET, NODE_ENV } = config;

const UserCreateTokenAndSetCookie = (partnerId, res) => {
  const token = jwt.sign({ partnerId }, JWT_PARTNER_SECRET, {
    expiresIn: "7d",
  });

  res.cookie(JWT_PARTNER_TOKEN_NAME, token, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: NODE_ENV === "production",
    httpOnly: true,
  });

  return token;
};

export default UserCreateTokenAndSetCookie;
