import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Plus } from "@/lib/icons";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { Order, OrderStatus, PaymentStatus } from "@/lib/types";

interface Props {
  trigger?: ReactNode;
  onCreate?: (order: Order) => void;
}

const emptyForm = {
  customer: "",
  email: "",
  phone: "",
  product: "",
  amount: "",
  payment: "PENDING" as PaymentStatus,
  status: "PLACED" as OrderStatus,
  notes: "",
};

export function CreateOrderDialog({ trigger, onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer.trim() || !form.product.trim() || !form.amount) {
      toast.error("Please fill in customer, product and amount");
      return;
    }
    const amount = Number(form.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Amount must be a positive number");
      return;
    }
    setSubmitting(true);
    const order: Order = {
      id: `FP-${Math.floor(10300 + Math.random() * 700)}`,
      customer: form.customer.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      product: form.product.trim(),
      amount: Math.round(amount * 100) / 100,
      payment: form.payment,
      status: form.status,
      createdAt: new Date().toISOString(),
    };
    onCreate?.(order);
    toast.success(`Order ${order.id} created`);
    setSubmitting(false);
    setForm(emptyForm);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger >
        {trigger ?? (
          <Button size="sm" className="h-9 gap-1.5 shadow-(--shadow-elegant)">
            <Plus className="h-4 w-4" /> Create order
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-140 p-0 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>Create order</DialogTitle>
            <DialogDescription>
              Add a new order manually. It will appear at the top of your orders list.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 space-y-4 max-h-[65vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Customer name" required>
                <Input value={form.customer} onChange={(e) => set("customer", e.target.value)} placeholder="Jane Cooper" />
              </Field>
              <Field label="Email">
                <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@acme.co" />
              </Field>
              <Field label="Phone">
                <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 415 555 0142" />
              </Field>
              <Field label="Amount (USD)" required>
                <Input type="number" step="0.01" min="0" value={form.amount} onChange={(e) => set("amount", e.target.value)} placeholder="249.00" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Product" required>
                  <Input value={form.product} onChange={(e) => set("product", e.target.value)} placeholder="Aurora Wireless Headphones" />
                </Field>
              </div>
              <Field label="Payment status">
                <Select value={form.payment} onValueChange={(v) => set("payment", v as PaymentStatus)}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                    <SelectItem value="REFUNDED">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Order status">
                <Select value={form.status} onValueChange={(v) => set("status", v as OrderStatus)}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLACED">Placed</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="READY_TO_SHIP">Ready to ship</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Internal notes">
                  <Textarea rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Optional — visible to your team only." />
                </Field>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting}>
              {submitting ? "Creating..." : "Create order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}
