import { Bell, Search, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TopNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-4 md:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="relative hidden md:block max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search orders, customers, SKUs…"
          className="pl-9 h-9.5 bg-secondary/60 border-transparent focus-visible:bg-background focus-visible:border-border"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
        </Button>
        <div className="h-6 w-px bg-border mx-1" />
        <div className="flex items-center gap-2.5 pr-1">
          <Avatar className="h-8 w-8 ring-2 ring-background">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              AK
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:flex flex-col leading-tight">
            <span className="text-sm font-medium text-foreground">Ava Kim</span>
            <span className="text-[11px] text-muted-foreground">Operations lead</span>
          </div>
        </div>
      </div>
    </header>
  );
}
