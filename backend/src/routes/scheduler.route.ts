import { Router } from "express";
import {
  getSchedulerLogs,
  runScheduler,
} from "@/controllers/scheduler.controller";
import { verifySchedulerSecret } from "@/middlewares/scheduler-auth.middleware";

const router = Router();

router.post("/run", verifySchedulerSecret, runScheduler);

router.get("/logs", getSchedulerLogs);

export default router;