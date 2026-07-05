import {
  Copy,
  Phone,
  Package,
  CreditCard,
  Calendar,
  Hash,
  User,
  Printer,
  Truck,
} from "@/lib/icons";

import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { Order } from "@/lib/types";
import { paymentVariant, orderVariant } from "@/lib/utils";

interface Props {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatFull(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrderDetailsSheet({ order, open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[85vh] p-0 rounded-t-2xl border-t focus:outline-none"
      >
        {order && (
          <div className="flex h-full flex-col">
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <SheetTitle className="text-lg font-semibold tracking-tight">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </SheetTitle>
                    <StatusBadge variant={orderVariant(order.orderStatus)}>
                      {order.orderStatus}
                    </StatusBadge>
                  </div>
                  <SheetDescription className="mt-1 text-[13px]">
                    Placed on {formatFull(order.createdAt)}
                  </SheetDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1.5"
                    onClick={() => {
                      void navigator.clipboard.writeText(order._id);
                      toast.success("Order ID copied");
                    }}
                  >
                    <Copy className="h-4 w-4" /> Copy ID
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 gap-1.5">
                    <Printer className="h-4 w-4" /> Invoice
                  </Button>
                  <Button
                    size="sm"
                    className="h-9 gap-1.5 shadow-[var(--shadow-elegant)]"
                  >
                    <Truck className="h-4 w-4" /> Fulfill
                  </Button>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto max-w-5xl px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Section title="Line items">
                    <div className="rounded-lg border border-border overflow-hidden">
                      <div className="flex items-center justify-between p-4 bg-muted/30">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-10 w-10 rounded-md bg-accent grid place-items-center text-primary shrink-0">
                            <Package className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {order.productName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              SKU · {order._id.slice(-8).toUpperCase()} · Qty 1
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold tabular-nums text-foreground">
                          ₹{order.amount.toFixed(2)}
                        </p>
                      </div>
                      <Separator />
                      <div className="p-4 space-y-2 text-sm">
                        <SummaryRow
                          label="Subtotal"
                          value={`₹${order.amount.toFixed(2)}`}
                        />
                        <SummaryRow label="Shipping" value="₹0.00" muted />
                        <SummaryRow label="Tax" value="₹0.00" muted />
                        <Separator className="my-2" />
                        <SummaryRow
                          label="Total"
                          value={`₹${order.amount.toFixed(2)}`}
                          bold
                        />
                      </div>
                    </div>
                  </Section>

                  <Section title="Status history">
                    <ol className="relative border-l border-border ml-2 space-y-4">
                      {order.statusHistory.length === 0 ? (
                        <li className="ml-4 text-xs text-muted-foreground">
                          No transitions yet.
                        </li>
                      ) : (
                        order.statusHistory.map((h, i) => (
                          <li key={i} className="ml-4">
                            <span className="absolute -left-[5px] h-2.5 w-2.5 rounded-full ring-4 ring-background bg-primary" />
                            <p className="text-sm font-medium text-foreground">
                              {h.fromStatus} → {h.toStatus}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFull(h.changedAt)} · by {h.updatedBy}
                            </p>
                          </li>
                        ))
                      )}
                      {/* Always show the initial "Placed" event */}
                      <li className="ml-4">
                        <span className="absolute -left-[5px] h-2.5 w-2.5 rounded-full ring-4 ring-background bg-muted-foreground/40" />
                        <p className="text-sm font-medium text-foreground">Order placed</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFull(order.createdAt)}
                        </p>
                      </li>
                    </ol>
                  </Section>
                </div>

                <div className="space-y-6">
                  <Section title="Customer">
                    <div className="rounded-lg border border-border p-4 space-y-3">
                      <InfoRow icon={User} label="Name" value={order.customerName} />
                      <InfoRow
                        icon={Phone}
                        label="Phone"
                        value={order.phone}
                        action={() => {
                          void navigator.clipboard.writeText(order.phone);
                          toast.success("Phone copied");
                        }}
                      />
                    </div>
                  </Section>

                  <Section title="Payment">
                    <div className="rounded-lg border border-border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CreditCard className="h-3.5 w-3.5" /> Status
                        </span>
                        <StatusBadge variant={paymentVariant(order.paymentStatus)}>
                          {order.paymentStatus}
                        </StatusBadge>
                      </div>
                      <InfoRow
                        icon={Hash}
                        label="Reference"
                        value={`TXN-${order._id.slice(-8).toUpperCase()}`}
                      />
                      <InfoRow
                        icon={Calendar}
                        label="Date"
                        value={formatFull(order.createdAt)}
                      />
                    </div>
                  </Section>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  bold,
  muted,
}: {
  label: string;
  value: string;
  bold?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${muted ? "text-muted-foreground" : "text-foreground"}`}>
        {label}
      </span>
      <span
        className={`text-sm tabular-nums ${
          bold ? "font-semibold text-foreground" : muted ? "text-muted-foreground" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  action?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
        <Icon className="h-3.5 w-3.5" /> {label}
      </span>
      <div className="flex items-center gap-1 min-w-0">
        <span className="text-sm text-foreground truncate">{value}</span>
        {action && (
          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={action}>
            <Copy className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
