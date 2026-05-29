import mongoose from "mongoose";
import config from "../config/config.js";

const { MONGO_URI } = config;

// ======================================
// MONGOOSE CONNECTION EVENTS
// ======================================

mongoose.connection.once("open", () => {
  console.log("MongoDB connection established successfully");
});

mongoose.connection.on("error", (error) => {
  console.log("MongoDB connection error:", error.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// ======================================
// DATABASE INITIALIZER
// ======================================

const db_init = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      autoIndex: true,
    });
  } catch (error) {
    console.log("Failed to connect MongoDB:", error.message);

    process.exit(1);
  }
};

export default db_init;
