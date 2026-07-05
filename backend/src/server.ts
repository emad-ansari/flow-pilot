import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import { connectDatabase } from "./config/database";
import { startScheduler } from "@/cron/scheduler.cron";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();
  startScheduler();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
