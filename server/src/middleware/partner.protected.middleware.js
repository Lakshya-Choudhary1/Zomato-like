import config from "../config/config.js";

import jwt from "jsonwebtoken";

import PartnerModel from "../models/partner.model.js";

const verifyPartnerRoute = async (req, res, next) => {
  const { JWT_PARTNER_SECRET, JWT_PARTNER_TOKEN_NAME } = config;

  if(req.query?.id) {

    const partner = await PartnerModel.findById(req.query?.id);

    if(!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    req.partnerId = req.query?.id;
    return next();
  }

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
