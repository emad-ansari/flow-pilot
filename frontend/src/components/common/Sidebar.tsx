import {useLocation, Link} from "react-router-dom";
import { Package, Timer, Sparkles, Settings, LifeBuoy } from "@/lib/icons";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Orders", icon: Package },
  { to: "/scheduler-logs", label: "Scheduler Logs", icon: Timer },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
      const location = useLocation();

  return (
    <aside className="flex h-full w-52 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-(--shadow-elegant)">
          <Sparkles className="h-4.5 w-4.5" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">FlowPilot</span>
          <span className="text-[11px] text-muted-foreground">Order Operations</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        <ul className="space-y-1">
          {nav.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-(--shadow-soft)"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      active ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground",
                    )}
                    strokeWidth={2.25}
                  />
                  {item.label}
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3 space-y-1">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors">
          <LifeBuoy className="h-4 w-4" /> Help & support
        </button>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors">
          <Settings className="h-4 w-4" /> Settings
        </button>
      </div>
    </aside>
  );
}

