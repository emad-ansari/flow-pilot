import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { fetchOrders, createOrder as apiCreateOrder, type GetOrdersParams } from "./api";
import type { Order, OrdersPagination, OrderStatus, CreateOrderDto } from "./types";

interface UseOrdersReturn {
  orders: Order[];
  pagination: OrdersPagination | null;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  refetch: () => void;
  createOrder: (data: CreateOrderDto) => Promise<Order | null>;
}

interface UseOrdersParams {
  page: number;
  search: string;
  status: OrderStatus | "";
  limit?: number;
}

export function useOrders({
  page,
  search,
  status,
  limit = 8,
}: UseOrdersParams): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<OrdersPagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use a counter to trigger manual refetches
  const [refetchTick, setRefetchTick] = useState(0);
  const refetch = useCallback(() => setRefetchTick((t) => t + 1), []);

  // Debounce search to avoid hammering the API on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedSearch(search), 350);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params: GetOrdersParams = { page, limit };
        if (debouncedSearch.trim()) params.search = debouncedSearch;
        if (status) params.status = status as OrderStatus;

        const res = await fetchOrders(params);
        if (!cancelled) {
          setOrders(res.data.orders);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        if (!cancelled) {
          const msg =
            err instanceof Error ? err.message : "Failed to load orders";
          setError(msg);
          toast.error(msg);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [page, limit, debouncedSearch, status, refetchTick]);

  const createOrder = useCallback(
    async (data: CreateOrderDto): Promise<Order | null> => {
      setIsMutating(true);
      try {
        const res = await apiCreateOrder(data);
        toast.success("Order created successfully");
        // Refresh the list so the new order appears
        setRefetchTick((t) => t + 1);
        return res.data;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to create order";
        toast.error(msg);
        return null;
      } finally {
        setIsMutating(false);
      }
    },
    []
  );

  return { orders, pagination, isLoading, isMutating, error, refetch, createOrder };
}
