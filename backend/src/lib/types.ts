export const PAYMENT_STATUS = [
  "Paid",
  "Pending",
  "Failed",
  "Refunded",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export const ORDER_STATUS = [
  "Placed",
  "Processing",
  "Ready To Ship",
  "Shipped",
  "Cancelled",
] as const;


export type OrderStatus = (typeof ORDER_STATUS)[number];

export const SCHEDULER_STATUS = [
  "Success",
  "Failed",
] as const;

export type SchedulerStatus =
  (typeof SCHEDULER_STATUS)[number];
