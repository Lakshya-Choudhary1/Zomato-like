import mongoose from "mongoose";
import config from "../config/config.js";

const { MONGO_URI } = config;

// Connection events
mongoose.connection.once("open", () => {
  console.log("MongoDB connection established successfully");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// Database initializer
const db_init = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log(
      `MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`
    );
  } catch (error) {
    console.error("Failed to connect MongoDB:", error.message);
    process.exit(1);
  }
};

export default db_init;