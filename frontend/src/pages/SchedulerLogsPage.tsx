import { Activity, CheckCircle2, XCircle, Clock, Play, RefreshCw } from "@/lib/icons";

import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { schedulerLogs } from "@/lib/types";
import { formatDateTime, statusVariant, triggerVariant } from "@/lib/utils";



export default function SchedulerLogsPage() {
  const total = schedulerLogs.length;
  const success = schedulerLogs.filter((l) => l.status === "SUCCESS").length;
  const failed = schedulerLogs.filter((l) => l.status === "FAILED").length;
  const last = schedulerLogs[0];

  return (
    <>
      <PageHeader
        title="Scheduler Logs"
        description="Every run of the FlowPilot sync engine, with execution details and trigger source."
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
            <Button size="sm" className="h-9 gap-1.5 shadow-(--shadow-elegant)">
              <Play className="h-4 w-4" /> Run now
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        <StatCard label="Total executions" value={total} icon={Activity} hint="Last 24 hours" trend={{ value: "5.2%", direction: "up" }} />
        <StatCard label="Successful runs" value={success} icon={CheckCircle2} hint={`${Math.round((success / total) * 100)}% success rate`} tone="success" trend={{ value: "2.1%", direction: "up" }} />
        <StatCard label="Failed runs" value={failed} icon={XCircle} hint="Requires investigation" tone="warning" trend={{ value: "0.4%", direction: "down" }} />
        <StatCard label="Last execution" value={formatDateTime(last.runTime).split(",")[1]?.trim() ?? "—"} icon={Clock} hint={formatDateTime(last.runTime).split(",")[0]} tone="info" />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-(--shadow-card) overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Recent runs</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Chronological history of the sync scheduler.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 pl-5 pr-3">Run</th>
                <th className="py-3 px-3">Run time</th>
                <th className="py-3 px-3 text-right">Checked</th>
                <th className="py-3 px-3 text-right">Updated</th>
                <th className="py-3 px-3 text-right">Duration</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 pr-5">Trigger</th>
              </tr>
            </thead>
            <tbody>
              {schedulerLogs.map((l) => (
                <tr key={l.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/40">
                  <td className="py-3.5 pl-5 pr-3 font-medium text-foreground tabular-nums">{l.id}</td>
                  <td className="py-3.5 px-3 text-muted-foreground">{formatDateTime(l.runTime)}</td>
                  <td className="py-3.5 px-3 text-right tabular-nums text-foreground">{l.ordersChecked}</td>
                  <td className="py-3.5 px-3 text-right tabular-nums text-foreground">{l.ordersUpdated}</td>
                  <td className="py-3.5 px-3 text-right tabular-nums text-muted-foreground">{l.executionMs} ms</td>
                  <td className="py-3.5 px-3">
                    <StatusBadge variant={statusVariant(l.status)}>{l.status}</StatusBadge>
                  </td>
                  <td className="py-3.5 px-3 pr-5">
                    <StatusBadge variant={triggerVariant(l.trigger)} dot={false}>{l.trigger}</StatusBadge>
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
