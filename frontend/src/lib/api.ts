import type {
  CreateOrderDto,
  CreateOrderResponse,
  OrdersResponse,
  SchedulerLogsResponse,
  RunSchedulerResponse,
  OrderStatus,
} from "./types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
const SCHEDULER_SECRET = import.meta.env.VITE_SCHEDULER_SECRET ?? "";



async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { message?: string }).message ?? `HTTP ${res.status}`
    );
  }

  return res.json() as Promise<T>;
}



export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
}

export async function fetchOrders(
  params: GetOrdersParams = {}
): Promise<OrdersResponse> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.status) qs.set("status", params.status);
  if (params.search?.trim()) qs.set("search", params.search.trim());

  const query = qs.toString() ? `?${qs.toString()}` : "";
  return request<OrdersResponse>(`/api/orders${query}`);
}

export async function createOrder(
  data: CreateOrderDto
): Promise<CreateOrderResponse> {
  return request<CreateOrderResponse>("/api/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}



export interface GetSchedulerLogsParams {
  page?: number;
  limit?: number;
}

export async function fetchSchedulerLogs(
  params: GetSchedulerLogsParams = {}
): Promise<SchedulerLogsResponse> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));

  const query = qs.toString() ? `?${qs.toString()}` : "";
  return request<SchedulerLogsResponse>(`/api/scheduler/logs${query}`);
}

export async function runScheduler(): Promise<RunSchedulerResponse> {
  return request<RunSchedulerResponse>("/api/scheduler/run", {
    method: "POST",
    headers: {
      "x-scheduler-secret": SCHEDULER_SECRET,
    },
  });
}
