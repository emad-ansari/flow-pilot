import { Document, Schema, model } from "mongoose";

export interface ISchedulerLog extends Document {
  runTime: Date;

  checked: number;

  updated: number;

  duration: number;

  status: "Success" | "Partial" | "Failed";

  trigger: "Cron" | "Manual";

  createdAt: Date;

  updatedAt: Date;
}

const schedulerLogSchema = new Schema<ISchedulerLog>(
  {
    runTime: {
      type: Date,
      default: Date.now,
    },

    checked: {
      type: Number,
      default: 0,
    },

    updated: {
      type: Number,
      default: 0,
    },

    duration: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Success", "Partial", "Failed"],
    },

    trigger: {
      type: String,
      enum: ["Cron", "Manual"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

schedulerLogSchema.index({ runTime: -1 });

export const SchedulerLog = model<ISchedulerLog>(
  "SchedulerLog",
  schedulerLogSchema,
);
