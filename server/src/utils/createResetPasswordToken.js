import crypto from "crypto";

const createResetPasswordToken = () => {
  const token = crypto.randomBytes(8).toString("hex");
  return token;
};

export default createResetPasswordToken;
