import { Request, Response, NextFunction } from "express";
import * as orderService from "../services/order.service";
import { createOrderSchema , getOrdersSchema } from "@/lib/validators";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createOrderSchema.parse(req.body);

    const order = await orderService.createOrder(validatedData);

    res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};




export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = getOrdersSchema.parse(req.query);

    const result = await orderService.getOrders(query);

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};