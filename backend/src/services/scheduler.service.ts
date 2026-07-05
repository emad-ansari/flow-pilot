import { IOrder, Order } from "../models/order.model";
import { SchedulerLog } from "../models/scheduler-log.model";
import { OrderStatus } from "../lib/types";
import { AnyBulkWriteOperation } from "mongoose";

type SchedulerTrigger = "Cron" | "Manual";

export const runScheduler = async (trigger: SchedulerTrigger) => {
  const startedAt = Date.now();

  let checked = 0;
  let updated = 0;

  try {
    const orders = await Order.find({
      orderStatus: {
        $in: ["Placed", "Processing"],
      },
    });

    checked = orders.length;

    const bulkOperations: AnyBulkWriteOperation<IOrder>[] = [];
    const now = new Date();

    for (const order of orders) {
      const lastStatusChange =
        order.statusHistory.length > 0
          ? order.statusHistory[order.statusHistory.length - 1].changedAt
          : order.createdAt;

      const elapsedMinutes =
        (now.getTime() - lastStatusChange.getTime()) / (1000 * 60);

      let nextStatus: OrderStatus | null = null;

      if (order.orderStatus === "Placed" && elapsedMinutes >= 10) {
        nextStatus = "Processing";
      }

      if (order.orderStatus === "Processing" && elapsedMinutes >= 20) {
        nextStatus = "Ready To Ship";
      }

      if (!nextStatus) continue;

      bulkOperations.push({
        updateOne: {
          filter: {
            _id: order._id,
            orderStatus: order.orderStatus,
          },
          update: {
            $set: {
              orderStatus: nextStatus,
            },
            $push: {
              statusHistory: {
                fromStatus: order.orderStatus,
                toStatus: nextStatus,
                changedAt: now,
                updatedBy: "Scheduler",
              },
            },
          },
        },
      });
    }

    if (bulkOperations.length > 0) {
      const result = await Order.bulkWrite(bulkOperations);
      updated = result.modifiedCount ?? 0;
    }

    const duration = Date.now() - startedAt;

    await SchedulerLog.create({
      runTime: new Date(startedAt),
      checked,
      updated,
      duration,
      status: "Success",
      trigger,
    });

    return {
      checked,
      updated,
      duration,
      status: "Success",
    };
  } catch (error) {
    const duration = Date.now() - startedAt;

    await SchedulerLog.create({
      runTime: new Date(startedAt),
      checked,
      updated,
      duration,
      status: "Failed",
      trigger,
    });

    throw error;
  }
};
