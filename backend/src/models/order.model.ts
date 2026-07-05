import { Document, Schema, model } from "mongoose";
import {
  PaymentStatus,
  OrderStatus,
  ORDER_STATUS,
  PAYMENT_STATUS,
} from "../lib/types";

export interface IStatusHistory {
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  changedAt: Date;
  updatedBy: "Scheduler" | "User";
}

export interface IOrder extends Document {
  customerName: string;

  phone: string;

  productName: string;

  amount: number;

  paymentStatus: PaymentStatus;

  orderStatus: OrderStatus;

  statusHistory: IStatusHistory[];

  createdAt: Date;

  updatedAt: Date;
}

const statusHistorySchema = new Schema(
  {
    toStatus: {
      type: String,
      enum: ORDER_STATUS,
      required: true,
    },
    fromStatus: {
      type: String,
      enum: ORDER_STATUS,
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: String,
      enum: ["Scheduler", "User"],
      required: true,
    }
  },
  {
    _id: false,
  },
);

const orderSchema = new Schema<IOrder>(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUS,
      default: "Pending",
      required: true,
    },

    orderStatus: {
      type: String,
      enum: ORDER_STATUS,
      default: "Placed",
      required: true,
    },

    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

orderSchema.index({ customerName: 1 });
orderSchema.index({ createdAt: -1 });

export const Order = model<IOrder>("Order", orderSchema);
