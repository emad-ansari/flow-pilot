import { z } from "zod";
import { ORDER_STATUS, PAYMENT_STATUS } from "../lib/types";

export const createOrderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Customer name must be at least 2 characters"),

  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number"),

  productName: z.string().trim().min(2, "Product name is required"),

  amount: z.number().positive("Amount must be greater than 0"),

  paymentStatus: z.enum(PAYMENT_STATUS).default("Pending"),

  orderStatus: z.enum(ORDER_STATUS).default("Placed"),
});

export const getOrdersSchema = z.object({
  page: z.coerce.number().min(1).default(1),

  limit: z.coerce.number().min(1).max(100).default(10),

  status: z.enum(ORDER_STATUS).optional(),
  search: z.string().trim().optional(),
});

export type GetOrdersDto = z.infer<typeof getOrdersSchema>;
export type CreateOrderDto = z.infer<typeof createOrderSchema>;
