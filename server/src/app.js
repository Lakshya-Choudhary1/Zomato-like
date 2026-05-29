import express from "express";

import path, { join, resolve } from "path";

import url from "url";

import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import passport from "passport";

import config from "./config/config.js";

import api from "./routes/api.route.js";

// ================= LOAD PASSPORT STRATEGIES =================
import "./lib/passport.js";

const app = express();

const __filename = url.fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

/* =========================================
   SECURITY MIDDLEWARE
========================================= */

app.use(helmet());

/* =========================================
   CORS
========================================= */

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.WHITELIST_URI.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS ERROR: INVALID ORIGIN"), false);
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

/* =========================================
   BODY PARSER
========================================= */

app.use(cookieParser());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

/* =========================================
   PASSPORT
========================================= */

app.use(passport.initialize());

/* =========================================
   STATIC FILES
========================================= */

app.use(express.static(resolve(__dirname, "../public")));

/* =========================================
   API ROUTES
========================================= */

app.use("/api", api);

/* =========================================
   FRONTEND
========================================= */

if (config.NODE_ENV === "production") {
  app.get(/.*/, (req, res) => {
    return res.sendFile(join(__dirname, "../public/index.html"));
  });
}

export default app;
