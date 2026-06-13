// ================= routes/food.route.js =================

import { Router } from "express";

import verifyPartnerRoute from "../middleware/partner.protected.middleware.js";

import {
     createFood,
     getPartnersVideo,
     getFoodFeed,
     getHomeFeed,
     getSingleFood,
     updateFood,
     deleteFood,
} from "../controllers/food.controller.js";

import upload from "../lib/multer.js";

const foodRouter = Router();

/* =========================================
   TEST ROUTE
========================================= */
foodRouter.get("/test", (req, res) => {
     return res
          .status(200)
          .send("Food route working");
});

/* =========================================
   CREATE FOOD
========================================= */
foodRouter.post(
     "/",
     verifyPartnerRoute,
     createFood
);

/* =========================================
   GET PARTNER VIDEOS
========================================= */
foodRouter.get(
     "/partner/videos",
     verifyPartnerRoute,
     getPartnersVideo
);

/* =========================================
   HOME FEED
========================================= */
foodRouter.get(
     "/home/feed",
     getHomeFeed
);

/* =========================================
   GET FEED BY TAG + PAGINATION
========================================= */
foodRouter.get(
     "/feed",
     getFoodFeed
);

/* =========================================
   GET SINGLE FOOD
========================================= */
foodRouter.get(
     "/:foodId",
     getSingleFood
);

/* =========================================
   UPDATE FOOD
========================================= */
foodRouter.put(
     "/:foodId",
     verifyPartnerRoute,
     updateFood
);

/* =========================================
   DELETE FOOD
========================================= */
foodRouter.delete(
     "/:foodId",
     verifyPartnerRoute,
     deleteFood
);

export default foodRouter;