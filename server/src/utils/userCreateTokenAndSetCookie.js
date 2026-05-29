import jwt from "jsonwebtoken";
import config from "../config/config.js";

const { JWT_USER_TOKEN_NAME, JWT_USER_SECRET, NODE_ENV } = config;

const UserCreateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, JWT_USER_SECRET, {
    expiresIn: "7d",
  });

  res.cookie(JWT_USER_TOKEN_NAME, token, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: NODE_ENV === "production",
    httpOnly: true,
  });

  return token;
};

export default UserCreateTokenAndSetCookie;
