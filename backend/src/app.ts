import "express-async-errors";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import orderRoutes from "./routes/order.route";
import schedulerRoutes from "./routes/scheduler.route";

const app = express();

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "OrderPilot API Running 🚀",
  });
});

app.use("/api/orders", orderRoutes);
app.use("/api/scheduler", schedulerRoutes);

export default app;