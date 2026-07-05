import { Order } from "@/models/order.model";
import { CreateOrderDto, GetOrdersDto } from "@/lib/validators";

export const createOrder = async (data: CreateOrderDto) => {
  const order = await Order.create({
    ...data,
    statusHistory: [
      {
        status: data.orderStatus,
        changedAt: new Date(),
      },
    ],
  });

  return order;
};

export const getOrders = async ({
  page,
  limit = 8,
  status,
  search,
}: GetOrdersDto) => {
  const filter: Record<string, unknown> = {};

  if (status) {
    filter.orderStatus = status;
  }
  if (search) {
    filter.$or = [
      {
        customerName: {
          $regex: search,
          $options: "i",
        },
      },
      {
        phone: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const skip = (page - 1) * limit;

  const [orders, totalOrders] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),

    Order.countDocuments(filter),
  ]);

  return {
    orders,
    pagination: {
      currentPage: page,
      limit,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      hasNextPage: page * limit < totalOrders,
      hasPreviousPage: page > 1,
    },
  };
};
