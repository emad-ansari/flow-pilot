import { cn } from "@/lib/utils";
import { type Variant } from "@/lib/types";



const styles: Record<Variant, string> = {
  success: "bg-[color-mix(in_oklab,var(--success)_15%,white)] text-[color-mix(in_oklab,var(--success)_50%,black)] ring-[color-mix(in_oklab,var(--success)_30%,transparent)]",
  warning: "bg-[color-mix(in_oklab,var(--warning)_20%,white)] text-[color-mix(in_oklab,var(--warning)_50%,black)] ring-[color-mix(in_oklab,var(--warning)_35%,transparent)]",
  danger: "bg-[color-mix(in_oklab,var(--destructive)_12%,white)] text-[color-mix(in_oklab,var(--destructive)_55%,black)] ring-[color-mix(in_oklab,var(--destructive)_25%,transparent)]",
  info: "bg-[color-mix(in_oklab,var(--info)_15%,white)] text-[color-mix(in_oklab,var(--info)_50%,black)] ring-[color-mix(in_oklab,var(--info)_25%,transparent)]",
  neutral: "bg-muted text-muted-foreground ring-border",
  primary: "bg-accent text-accent-foreground ring-[color-mix(in_oklab,var(--primary)_20%,transparent)]",
  purple: "bg-[oklch(0.95_0.05_305)] text-[oklch(0.4_0.2_305)] ring-[oklch(0.85_0.08_305)]",
};

const dotStyles: Record<Variant, string> = {
  success: "bg-[var(--success)]",
  warning: "bg-[var(--warning)]",
  danger: "bg-[var(--destructive)]",
  info: "bg-[var(--info)]",
  neutral: "bg-muted-foreground",
  primary: "bg-primary",
  purple: "bg-[oklch(0.6_0.2_305)]",
};

export function StatusBadge({
  variant = "neutral",
  children,
  dot = true,
}: {
  variant?: Variant;
  children: React.ReactNode;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        styles[variant],
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotStyles[variant])} />}
      {children}
    </span>
  );
}



