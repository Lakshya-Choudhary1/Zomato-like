import config from "../config/config.js";

import jwt from "jsonwebtoken";

const verifyPartnerRoute = async (req, res, next) => {
  const { JWT_PARTNER_SECRET, JWT_PARTNER_TOKEN_NAME } = config;

  try {
    const jwtToken = req.cookies?.[JWT_PARTNER_TOKEN_NAME];

    if (!jwtToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthenticated Partner",
      });
    }

    const decoded = jwt.verify(jwtToken, JWT_PARTNER_SECRET);

    const partnerId = decoded?.partnerId;

    if (!partnerId) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }

    req.partnerId = partnerId;

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      success: false,
      message: "Authentication Failed",
    });
  }
};

export default verifyPartnerRoute;
