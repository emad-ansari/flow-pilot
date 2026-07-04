import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  trend?: { value: string; direction: "up" | "down" };
  tone?: "default" | "success" | "warning" | "info";
}

const toneMap = {
  default: "bg-accent text-primary",
  success: "bg-[color-mix(in_oklab,var(--success)_18%,white)] text-[color-mix(in_oklab,var(--success)_60%,black)]",
  warning: "bg-[color-mix(in_oklab,var(--warning)_22%,white)] text-[color-mix(in_oklab,var(--warning)_55%,black)]",
  info: "bg-[color-mix(in_oklab,var(--info)_18%,white)] text-[color-mix(in_oklab,var(--info)_55%,black)]",
};

export function StatCard({ label, value, hint, icon: Icon, trend, tone = "default" }: Props) {
  return (
    <div className="group relative rounded-xl border border-border bg-card px-4 py-3 shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-elegant)] hover:-translate-y-0.5 hover:border-primary/20">
      <div className="flex items-center gap-3">
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", toneMap[tone])}>
          <Icon className="h-4.5 w-4.5" strokeWidth={2.25} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-muted-foreground truncate">{label}</p>
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                  trend.direction === "up"
                    ? "bg-[color-mix(in_oklab,var(--success)_15%,white)] text-[color-mix(in_oklab,var(--success)_50%,black)]"
                    : "bg-[color-mix(in_oklab,var(--destructive)_12%,white)] text-[color-mix(in_oklab,var(--destructive)_55%,black)]",
                )}
              >
                {trend.direction === "up" ? (
                  <ArrowUpRight className="h-2.5 w-2.5" />
                ) : (
                  <ArrowDownRight className="h-2.5 w-2.5" />
                )}
                {trend.value}
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-baseline gap-2">
            <p className="text-xl font-semibold tracking-tight text-foreground tabular-nums leading-tight">
              {value}
            </p>
            {hint && <p className="text-[11px] text-muted-foreground truncate">{hint}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
