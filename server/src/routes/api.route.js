import { Router } from "express";
import userRoute from "./user.route.js";
import partnerRoute from "./partner.route.js";
import foodRouter from "./food.route.js";

const api = Router();

api.use("/user", userRoute);
api.use("/partner", partnerRoute);
api.use("/food", foodRouter);

export default api;
