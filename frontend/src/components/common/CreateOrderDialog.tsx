import { useState, type ReactNode } from "react";
import { Plus } from "@/lib/icons";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { CreateOrderDto, OrderStatus, PaymentStatus } from "@/lib/types";

interface Props {
  trigger?: ReactNode;
  /** Called with the raw DTO after the user submits; the parent hook handles the API call */
  onSubmit: (data: CreateOrderDto) => Promise<boolean>;
  isMutating?: boolean;
}

const emptyForm = {
  customerName: "",
  phone: "",
  productName: "",
  amount: "",
  paymentStatus: "Pending" as PaymentStatus,
  orderStatus: "Placed" as OrderStatus,
};

export function CreateOrderDialog({ trigger, onSubmit, isMutating = false }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof emptyForm, string>>>({});

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = (): boolean => {
    const errs: typeof errors = {};

    if (form.customerName.trim().length < 2)
      errs.customerName = "Name must be at least 2 characters";

    // Indian phone: starts 6-9, total 10 digits
    if (!/^[6-9]\d{9}$/.test(form.phone.trim()))
      errs.phone = "Enter a valid 10-digit Indian mobile number";

    if (form.productName.trim().length < 2)
      errs.productName = "Product name must be at least 2 characters";

    const amt = Number(form.amount);
    if (Number.isNaN(amt) || amt <= 0)
      errs.amount = "Amount must be a positive number";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const dto: CreateOrderDto = {
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      productName: form.productName.trim(),
      amount: Math.round(Number(form.amount) * 100) / 100,
      paymentStatus: form.paymentStatus,
      orderStatus: form.orderStatus,
    };

    const success = await onSubmit(dto);
    if (success) {
      setForm(emptyForm);
      setErrors({});
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger ?? (
          <Button size="sm" className="h-9 gap-1.5 shadow-(--shadow-elegant)">
            <Plus className="h-4 w-4" /> Create order
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-140 p-0 overflow-hidden">
        <form onSubmit={(e) => void handleSubmit(e)}>
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>Create order</DialogTitle>
            <DialogDescription>
              Add a new order manually. It will appear at the top of your orders list.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 space-y-4 max-h-[65vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Customer name" required error={errors.customerName}>
                <Input
                  value={form.customerName}
                  onChange={(e) => set("customerName", e.target.value)}
                  placeholder="Jane Cooper"
                />
              </Field>
              <Field label="Phone" required error={errors.phone}>
                <Input
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="9876543210"
                />
              </Field>
              <Field label="Amount (₹)" required error={errors.amount}>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.amount}
                  onChange={(e) => set("amount", e.target.value)}
                  placeholder="249.00"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Product" required error={errors.productName}>
                  <Input
                    value={form.productName}
                    onChange={(e) => set("productName", e.target.value)}
                    placeholder="Aurora Wireless Headphones"
                  />
                </Field>
              </div>
              <Field label="Payment status">
                <Select
                  value={form.paymentStatus}
                  onValueChange={(v) => set("paymentStatus", v as PaymentStatus)}
                >
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                    <SelectItem value="Refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Order status">
                <Select
                  value={form.orderStatus}
                  onValueChange={(v) => set("orderStatus", v as OrderStatus)}
                >
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Placed">Placed</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Ready To Ship">Ready to ship</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isMutating}>
              {isMutating ? "Creating..." : "Create order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
