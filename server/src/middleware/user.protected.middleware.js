import config from "../config/config.js";
import jwt from "jsonwebtoken";

const verifyRoute = async (req, res, next) => {
  const { JWT_USER_SECRET, JWT_USER_TOKEN_NAME } = config;

  try {
    /* =========================================
       PASSPORT AUTHENTICATION
    ========================================= */

    if (req.isAuthenticated?.() && req.user && req.user.role === "user") {
      req.userId = req.user._id;

      return next();
    }

    /* =========================================
       JWT AUTHENTICATION
    ========================================= */

    const jwtToken = req.cookies?.[JWT_USER_TOKEN_NAME];

    if (!jwtToken) {
      return res.status(401).json({
        message: "Unauthenticated User",
      });
    }

    const decoded = jwt.verify(jwtToken, JWT_USER_SECRET);

    const userId = decoded?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }

    req.userId = userId;

    next();
  } catch (err) {
    console.log(err);

    return res.status(401).json({
      message: "Authentication Failed",
      error: err.message,
    });
  }
};

export default verifyRoute;
