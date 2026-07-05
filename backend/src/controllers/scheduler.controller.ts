import { NextFunction, Request, Response } from "express";
import * as schedulerService from "@/services/scheduler.service";
import { SchedulerLog } from "@/models/scheduler-log.model";

export const runScheduler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await schedulerService.runScheduler("Manual");

    return res.status(200).json({
      success: true,
      message: "Scheduler executed successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getSchedulerLogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      SchedulerLog.find()
        .sort({ runTime: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      SchedulerLog.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      message: "Scheduler logs fetched successfully.",
      data: logs,
      pagination: {
        currentPage: page,
        limit,
        totalLogs: total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};