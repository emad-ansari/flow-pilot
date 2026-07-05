import { NextFunction, Request, Response } from "express";

export const verifySchedulerSecret = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const secret = req.header("x-scheduler-secret");

  if (!secret || secret !== process.env.SCHEDULER_SECRET) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized scheduler request.",
    });
  }

  next();
};