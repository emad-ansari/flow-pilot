import cron from "node-cron";
import { runScheduler } from "@/services/scheduler.service";

export const startScheduler = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      console.log("Running scheduler...");

      await runScheduler("Cron");

      console.log("Scheduler completed successfully.");
    } catch (error) {
      console.error("Scheduler failed:", error);
    }
  });
};