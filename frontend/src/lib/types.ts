export const PAYMENT_STATUS = ["Paid", "Pending", "Failed", "Refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export const ORDER_STATUS = [
  "Placed",
  "Processing",
  "Ready To Ship",
  "Shipped",
  "Cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUS)[number];

export const SCHEDULER_STATUS = ["Success", "Partial", "Failed"] as const;
export type SchedulerStatus = (typeof SCHEDULER_STATUS)[number];

export const SCHEDULER_TRIGGER = ["Cron", "Manual"] as const;
export type SchedulerTrigger = (typeof SCHEDULER_TRIGGER)[number];

export type Variant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "primary"
  | "purple";



export interface StatusHistory {
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  changedAt: string;
  updatedBy: "Scheduler" | "User";
}



export interface Order {
  _id: string;
  customerName: string;
  phone: string;
  productName: string;
  amount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  statusHistory: StatusHistory[];
  createdAt: string;
  updatedAt: string;
}



export interface SchedulerLog {
  _id: string;
  runTime: string;
  checked: number;
  updated: number;
  duration: number;
  status: SchedulerStatus;
  trigger: SchedulerTrigger;
  createdAt: string;
  updatedAt: string;
}



export interface Pagination {
  currentPage: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface OrdersPagination extends Pagination {
  totalOrders: number;
}

export interface LogsPagination extends Pagination {
  totalLogs: number;
}



export interface OrdersResponse {
  success: boolean;
  message: string;
  data: {
    orders: Order[];
    pagination: OrdersPagination;
  };
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export interface SchedulerLogsResponse {
  success: boolean;
  message: string;
  data: SchedulerLog[];
  pagination: LogsPagination;
}

export interface RunSchedulerResponse {
  success: boolean;
  message: string;
  data: {
    checked: number;
    updated: number;
    duration: number;
    status: SchedulerStatus;
  };
}



export interface CreateOrderDto {
  customerName: string;
  phone: string;
  productName: string;
  amount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
}
