import { createServer } from "http";

import app from "./src/app.js";
import config from "./src/config/config.js";
import db_init from "./src/database/db.js";

const server = createServer(app);

const startApplication = async () => {
  try {
    // Database connection
    await db_init();

    // Start server
    server.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}...`);
    });
  } catch (error) {
    console.error("Application startup failed:", error);

    process.exit(1);
  }
};

startApplication();
