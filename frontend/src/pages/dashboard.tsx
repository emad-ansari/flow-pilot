
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Package, ShoppingBag, Loader2, Truck, Plus, Download, RefreshCw, Search,
  MoreHorizontal, Eye, Copy, Phone, ChevronLeft, ChevronRight, ListFilter,
  PackageSearch,
} from "lucide-react";

import { AppShell } from "@/src/components/layouts/AppShell";
import { PageHeader } from "@/src/components/common/PageHeader";
import { StatCard } from "@/src/components/common/StatCard";
import { StatusBadge} from "@/src/components/common/StatusBadge";
import { EmptyState } from "@/src/components/common/EmtpyState";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/src/components/ui/select";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { orders as allOrders } from "@/lib/types";
import { paymentVariant, orderVariant } from "@/lib/utils";

// export const Route = createFileRoute("/")({
//   head: () => ({
//     meta: [
//       { title: "Orders — FlowPilot" },
//       { name: "description", content: "Manage, track and fulfill orders across every sales channel with FlowPilot's operations dashboard." },
//       { property: "og:title", content: "Orders — FlowPilot" },
//       { property: "og:description", content: "Manage, track and fulfill orders with FlowPilot." },
//       { property: "og:type", content: "website" },
//       { name: "twitter:card", content: "summary_large_image" },
//     ],
//   }),
//   component: OrdersPage,
// });

function formatDate(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  return date;
}

function prettyStatus(s: string) {
  return s
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function prettyPayment(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase();
}

function OrdersPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    return allOrders.filter((o) => {
      const q = query.trim().toLowerCase();
      const matchQ = !q ||
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q);
      const matchS = status === "all" || o.status === status;
      return matchQ && matchS;
    });
  }, [query, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id); else s.add(id);
      return s;
    });
  };

  const totalOrders = allOrders.length;
  const placed = allOrders.filter((o) => o.status === "PLACED").length;
  const processing = allOrders.filter((o) => o.status === "PROCESSING").length;
  const ready = allOrders.filter((o) => o.status === "READY_TO_SHIP").length;

  return (
    <AppShell>
      <PageHeader
        title="Orders"
        description="Track, manage and fulfill every order across your storefront in one clean workspace."
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button size="sm" className="h-9 gap-1.5 shadow-[var(--shadow-elegant)]">
              <Plus className="h-4 w-4" /> Create order
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        <StatCard label="Total orders" value={totalOrders} icon={Package} hint="All channels" trend={{ value: "12.4%", direction: "up" }} />
        <StatCard label="Placed" value={placed} icon={ShoppingBag} hint="Awaiting" tone="info" trend={{ value: "3.1%", direction: "up" }} />
        <StatCard label="Processing" value={processing} icon={Loader2} hint="In progress" tone="warning" trend={{ value: "1.8%", direction: "down" }} />
        <StatCard label="Ready to ship" value={ready} icon={Truck} hint="Queued" tone="success" trend={{ value: "8.2%", direction: "up" }} />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-card)] overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search by Order ID or Customer..."
                className="pl-9 h-9 bg-secondary/60 border-transparent focus-visible:bg-background focus-visible:border-border"
              />
            </div>
            <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
              <SelectTrigger className="h-9 w-[170px]">
                <ListFilter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="PLACED">Placed</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="READY_TO_SHIP">Ready to ship</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            {selected.size > 0 && (
              <span className="text-xs text-muted-foreground">{selected.size} selected</span>
            )}
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5"
              onClick={() => { setQuery(""); setStatus("all"); setSelected(new Set()); }}
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
          </div>
        </div>

        {paged.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No orders match your filters"
            description="Try clearing the search or switching to a different status to find what you're looking for."
            action={
              <Button variant="outline" size="sm" onClick={() => { setQuery(""); setStatus("all"); }}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-2.5 pl-4 pr-2 w-8">
                    <Checkbox
                      checked={paged.every((o) => selected.has(o.id))}
                      onCheckedChange={(v) => {
                        setSelected((prev) => {
                          const s = new Set(prev);
                          if (v) paged.forEach((o) => s.add(o.id));
                          else paged.forEach((o) => s.delete(o.id));
                          return s;
                        });
                      }}
                    />
                  </th>
                  <th className="py-2.5 px-2.5">Order ID</th>
                  <th className="py-2.5 px-2.5">Customer</th>
                  <th className="py-2.5 px-2.5">Phone</th>
                  <th className="py-2.5 px-2.5">Product</th>
                  <th className="py-2.5 px-2.5 text-right">Amount</th>
                  <th className="py-2.5 px-2.5">Payment</th>
                  <th className="py-2.5 px-2.5">Status</th>
                  <th className="py-2.5 px-2.5">Created</th>
                  <th className="py-2.5 px-2.5 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((o) => (
                  <tr
                    key={o.id}
                    className="group border-b border-border last:border-0 transition-colors hover:bg-muted/40"
                  >
                    <td className="py-2 pl-4 pr-2">
                      <Checkbox checked={selected.has(o.id)} onCheckedChange={() => toggle(o.id)} />
                    </td>
                    <td className="py-2 px-2.5 font-medium text-foreground tabular-nums">{o.id}</td>
                    <td className="py-2 px-2.5 font-medium text-foreground">{o.customer}</td>
                    <td className="py-2 px-2.5 text-muted-foreground tabular-nums whitespace-nowrap">{o.phone}</td>
                    <td className="py-2 px-2.5 text-foreground max-w-[220px] truncate">{o.product}</td>
                    <td className="py-2 px-2.5 text-right font-semibold text-foreground tabular-nums">
                      ${o.amount.toFixed(2)}
                    </td>
                    <td className="py-2 px-2.5">
                      <StatusBadge variant={paymentVariant(o.payment)}>{prettyPayment(o.payment)}</StatusBadge>
                    </td>
                    <td className="py-2 px-2.5">
                      <StatusBadge variant={orderVariant(o.status)}>{prettyStatus(o.status)}</StatusBadge>
                    </td>
                    <td className="py-2 px-2.5 text-muted-foreground whitespace-nowrap">{formatDate(o.createdAt)}</td>
                    <td className="py-2 px-2.5 pr-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 focus:opacity-100 data-[state=open]:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuItem onClick={() => { void navigator.clipboard.writeText(o.id); toast.success("Order ID copied"); }}>
                            <Copy className="h-4 w-4 mr-2" /> Copy Order ID
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { void navigator.clipboard.writeText(o.phone); toast.success("Phone number copied"); }}>
                            <Phone className="h-4 w-4 mr-2" /> Copy Phone Number
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" /> View Order Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-medium text-foreground">{paged.length}</span> of{" "}
            <span className="font-medium text-foreground">{filtered.length}</span> orders
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0 tabular-nums"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page === pageCount} onClick={() => setPage((p) => Math.min(pageCount, p + 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
