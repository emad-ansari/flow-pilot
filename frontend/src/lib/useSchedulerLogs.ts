import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  fetchSchedulerLogs,
  runScheduler as apiRunScheduler,
} from "./api";
import type { SchedulerLog, LogsPagination } from "./types";

interface UseSchedulerLogsReturn {
  logs: SchedulerLog[];
  pagination: LogsPagination | null;
  isLoading: boolean;
  isRunning: boolean;
  error: string | null;
  refetch: () => void;
  runScheduler: () => Promise<void>;
}

export function useSchedulerLogs(
  page = 1,
  limit = 20
): UseSchedulerLogsReturn {
  const [logs, setLogs] = useState<SchedulerLog[]>([]);
  const [pagination, setPagination] = useState<LogsPagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchTick, setRefetchTick] = useState(0);

  const refetch = useCallback(() => setRefetchTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetchSchedulerLogs({ page, limit });
        if (!cancelled) {
          setLogs(res.data);
          setPagination(res.pagination);
        }
      } catch (err) {
        if (!cancelled) {
          const msg =
            err instanceof Error ? err.message : "Failed to load scheduler logs";
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
  }, [page, limit, refetchTick]);

  const runScheduler = useCallback(async () => {
    setIsRunning(true);
    try {
      const res = await apiRunScheduler();
      toast.success(
        `Scheduler ran: ${res.data.updated} order(s) updated in ${res.data.duration}ms`
      );
      // Refresh logs to show the new run entry
      setRefetchTick((t) => t + 1);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Scheduler run failed";
      toast.error(msg);
    } finally {
      setIsRunning(false);
    }
  }, []);

  return { logs, pagination, isLoading, isRunning, error, refetch, runScheduler };
}
