import { Activity, CheckCircle2, XCircle, Clock, Play, RefreshCw } from "@/lib/icons";

import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatDateTime, statusVariant, triggerVariant } from "@/lib/utils";
import { useSchedulerLogs } from "@/lib/useSchedulerLogs";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="py-3.5 px-3">
          <div
            className="h-4 rounded bg-muted animate-pulse"
            style={{ width: `${50 + (i * 19) % 40}%` }}
          />
        </td>
      ))}
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SchedulerLogsPage() {
  const { logs, isLoading, isRunning, refetch, runScheduler } =
    useSchedulerLogs(1, 20);

  const total = logs.length;
  const success = logs.filter((l) => l.status === "Success").length;
  const failed = logs.filter((l) => l.status === "Failed").length;
  const last = logs[0];

  return (
    <>
      <PageHeader
        title="Scheduler Logs"
        description="Every run of the FlowPilot sync engine, with execution details and trigger source."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5"
              onClick={refetch}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              className="h-9 gap-1.5 shadow-(--shadow-elegant)"
              onClick={() => void runScheduler()}
              disabled={isRunning || isLoading}
            >
              <Play className={`h-4 w-4 ${isRunning ? "animate-pulse" : ""}`} />
              {isRunning ? "Running..." : "Run now"}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        <StatCard
          label="Total executions"
          value={isLoading ? "—" : total}
          icon={Activity}
          hint="Last 20 runs"
          trend={{ value: "5.2%", direction: "up" }}
        />
        <StatCard
          label="Successful runs"
          value={isLoading ? "—" : success}
          icon={CheckCircle2}
          hint={total > 0 ? `${Math.round((success / total) * 100)}% success rate` : "—"}
          tone="success"
          trend={{ value: "2.1%", direction: "up" }}
        />
        <StatCard
          label="Failed runs"
          value={isLoading ? "—" : failed}
          icon={XCircle}
          hint="Requires investigation"
          tone="warning"
          trend={{ value: "0.4%", direction: "down" }}
        />
        <StatCard
          label="Last execution"
          value={
            isLoading || !last
              ? "—"
              : formatDateTime(last.runTime).split(",")[1]?.trim() ?? "—"
          }
          icon={Clock}
          hint={
            isLoading || !last
              ? "—"
              : formatDateTime(last.runTime).split(",")[0]
          }
          tone="info"
        />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-(--shadow-card) overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Recent runs</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Chronological history of the sync scheduler.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 pl-5 pr-3">Run ID</th>
                <th className="py-3 px-3">Run time</th>
                <th className="py-3 px-3 text-right">Checked</th>
                <th className="py-3 px-3 text-right">Updated</th>
                <th className="py-3 px-3 text-right">Duration</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 pr-5">Trigger</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : logs.length === 0
                ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                      No scheduler runs yet. Click <strong>Run now</strong> to trigger the first one.
                    </td>
                  </tr>
                )
                : logs.map((l) => (
                  <tr
                    key={l._id}
                    className="border-b border-border last:border-0 transition-colors hover:bg-muted/40"
                  >
                    <td className="py-3.5 pl-5 pr-3 font-medium text-foreground tabular-nums text-xs">
                      #{l._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-3.5 px-3 text-muted-foreground">
                      {formatDateTime(l.runTime)}
                    </td>
                    <td className="py-3.5 px-3 text-right tabular-nums text-foreground">
                      {l.checked}
                    </td>
                    <td className="py-3.5 px-3 text-right tabular-nums text-foreground">
                      {l.updated}
                    </td>
                    <td className="py-3.5 px-3 text-right tabular-nums text-muted-foreground">
                      {l.duration} ms
                    </td>
                    <td className="py-3.5 px-3">
                      <StatusBadge variant={statusVariant(l.status)}>
                        {l.status}
                      </StatusBadge>
                    </td>
                    <td className="py-3.5 px-3 pr-5">
                      <StatusBadge variant={triggerVariant(l.trigger)} dot={false}>
                        {l.trigger}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
