import { useState } from "react";
import {
  Package,
  ShoppingBag,
  Loader2,
  Truck,
  RefreshCw,
  Search,
  MoreHorizontal,
  Eye,
  Copy,
  Phone,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  PackageSearch,
} from "@/lib/icons";

import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmtpyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  paymentVariant,
  orderVariant,
  formatDate,
} from "@/lib/utils";
import type { Order, OrderStatus, CreateOrderDto } from "@/lib/types";
import { CreateOrderDialog } from "@/components/common/CreateOrderDialog";
import { OrderDetailsSheet } from "@/components/common/OrderDetailsSheet";
import { useOrders } from "@/lib/useOrders";
import { toast } from "sonner";

const PAGE_SIZE = 8;

// Skeleton row for loading state
function SkeletonRow() {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} className="py-3 px-2.5">
          <div className="h-4 rounded bg-muted animate-pulse" style={{ width: `${60 + (i * 17) % 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

export default function OrdersPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { orders, pagination, isLoading, isMutating, refetch, createOrder } =
    useOrders({ page, search: query, status, limit: PAGE_SIZE });

  const totalPages = pagination?.totalPages ?? 1;
  const totalOrders = pagination?.totalOrders ?? 0;

  // Compute stat counts from current page + server totals
  // For accurate stats, backend would need to expose them. We derive from current page as a best-effort.
  const placed = orders.filter((o) => o.orderStatus === "Placed").length;
  const processing = orders.filter((o) => o.orderStatus === "Processing").length;
  const ready = orders.filter((o) => o.orderStatus === "Ready To Ship").length;

  const toggle = (id: string) => {
    setSelected((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  };

  const openDetails = (o: Order) => {
    setDetailsOrder(o);
    setDetailsOpen(true);
  };

  const handleCreateOrder = async (data: CreateOrderDto): Promise<boolean> => {
    const result = await createOrder(data);
    return result !== null;
  };

  const handleRefresh = () => {
    setSelected(new Set());
    refetch();
    toast.info("Orders refreshed");
  };

  return (
    <>
      <PageHeader
        title="Orders"
        description="Track, manage and fulfill every order across your storefront in one clean workspace."
        actions={
          <>
            <CreateOrderDialog onSubmit={handleCreateOrder} isMutating={isMutating} />
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        <StatCard
          label="Total orders"
          value={isLoading ? "—" : totalOrders}
          icon={Package}
          hint="All channels"
          trend={{ value: "12.4%", direction: "up" }}
        />
        <StatCard
          label="Placed"
          value={isLoading ? "—" : placed}
          icon={ShoppingBag}
          hint="Awaiting"
          tone="info"
          trend={{ value: "3.1%", direction: "up" }}
        />
        <StatCard
          label="Processing"
          value={isLoading ? "—" : processing}
          icon={Loader2}
          hint="In progress"
          tone="warning"
          trend={{ value: "1.8%", direction: "down" }}
        />
        <StatCard
          label="Ready to ship"
          value={isLoading ? "—" : ready}
          icon={Truck}
          hint="Queued"
          tone="success"
          trend={{ value: "8.2%", direction: "up" }}
        />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-(--shadow-card) overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-55 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name or phone..."
                className="pl-9 h-9 bg-secondary/60 border-transparent focus-visible:bg-background focus-visible:border-border"
              />
            </div>
            <Select
              value={status || "All"}
              onValueChange={(v) => {
                setStatus(v === "All" ? "" : (v as OrderStatus));
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-42.5">
                <ListFilter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All statuses</SelectItem>
                <SelectItem value="Placed">Placed</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Ready To Ship">Ready to ship</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            {selected.size > 0 && (
              <span className="text-xs text-muted-foreground">
                {selected.size} selected
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-2.5 pl-4 pr-2 w-8" />
                  <th className="py-2.5 px-2.5">Order ID</th>
                  <th className="py-2.5 px-2.5">Customer</th>
                  <th className="py-2.5 px-2.5">Phone</th>
                  <th className="py-2.5 px-2.5">Product</th>
                  <th className="py-2.5 px-2.5 text-right">Amount</th>
                  <th className="py-2.5 px-2.5">Payment</th>
                  <th className="py-2.5 px-2.5">Status</th>
                  <th className="py-2.5 px-2.5">Created</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </tbody>
            </table>
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No orders match your filters"
            description="Try clearing the search or switching to a different status to find what you're looking for."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setStatus("");
                  setPage(1);
                }}
              >
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
                      checked={orders.every((o) => selected.has(o._id))}
                      onCheckedChange={(v) => {
                        setSelected((prev) => {
                          const s = new Set(prev);
                          if (v) orders.forEach((o) => s.add(o._id));
                          else orders.forEach((o) => s.delete(o._id));
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
                {orders.map((o) => (
                  <tr
                    key={o._id}
                    className="group border-b border-border last:border-0 transition-colors hover:bg-muted/40"
                  >
                    <td className="py-2 pl-4 pr-2">
                      <Checkbox
                        checked={selected.has(o._id)}
                        onCheckedChange={() => toggle(o._id)}
                      />
                    </td>
                    <td className="py-2 px-2.5 font-medium text-foreground tabular-nums text-xs">
                      #{o._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-2 px-2.5 font-medium text-foreground">
                      {o.customerName}
                    </td>
                    <td className="py-2 px-2.5 text-muted-foreground tabular-nums whitespace-nowrap">
                      {o.phone}
                    </td>
                    <td className="py-2 px-2.5 text-foreground max-w-55 truncate">
                      {o.productName}
                    </td>
                    <td className="py-2 px-2.5 text-right font-semibold text-foreground tabular-nums">
                      ₹{o.amount.toFixed(2)}
                    </td>
                    <td className="py-2 px-2.5">
                      <StatusBadge variant={paymentVariant(o.paymentStatus)}>
                        {o.paymentStatus}
                      </StatusBadge>
                    </td>
                    <td className="py-2 px-2.5">
                      <StatusBadge variant={orderVariant(o.orderStatus)}>
                        {o.orderStatus}
                      </StatusBadge>
                    </td>
                    <td className="py-2 px-2.5 text-muted-foreground whitespace-nowrap">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="py-2 px-2.5 pr-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 focus:opacity-100 data-[state=open]:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuItem
                            onClick={() => {
                              void navigator.clipboard.writeText(o._id);
                              toast.success("Order ID copied");
                            }}
                          >
                            <Copy className="h-4 w-4 mr-2" /> Copy Order ID
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              void navigator.clipboard.writeText(o.phone);
                              toast.success("Phone number copied");
                            }}
                          >
                            <Phone className="h-4 w-4 mr-2" /> Copy Phone Number
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openDetails(o)}>
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
            Showing{" "}
            <span className="font-medium text-foreground">{orders.length}</span>{" "}
            of{" "}
            <span className="font-medium text-foreground">{totalOrders}</span>{" "}
            orders
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={page === 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0 tabular-nums"
                onClick={() => setPage(p)}
                disabled={isLoading}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={page === totalPages || isLoading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <OrderDetailsSheet
        order={detailsOrder}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
}
