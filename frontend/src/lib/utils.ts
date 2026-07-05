import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Variant } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Payment helpers ───────────────────────────────────────────────────────────

/** Maps backend PaymentStatus ("Paid" | "Pending" | "Failed" | "Refunded") to a UI variant */
export function paymentVariant(s: string): Variant {
  switch (s) {
    case "Paid":
      return "success";
    case "Pending":
      return "warning";
    case "Failed":
      return "danger";
    case "Refunded":
      return "neutral";
    default:
      return "neutral";
  }
}

/** Human-readable payment status label */
export function prettyPayment(s: string): string {
  return s; // Already human-readable from backend ("Paid", "Pending", …)
}

// ─── Order status helpers ──────────────────────────────────────────────────────

/** Maps backend OrderStatus ("Placed" | "Processing" | "Ready To Ship" | "Shipped" | "Cancelled") to a UI variant */
export function orderVariant(s: string): Variant {
  switch (s) {
    case "Placed":
      return "info";
    case "Processing":
      return "warning";
    case "Ready To Ship":
      return "primary";
    case "Shipped":
      return "success";
    case "Cancelled":
      return "danger";
    default:
      return "neutral";
  }
}

/** Human-readable order status label */
export function prettyStatus(s: string): string {
  return s; // Already human-readable from backend ("Ready To Ship", etc.)
}

// ─── Scheduler helpers ─────────────────────────────────────────────────────────

/** Maps scheduler log status ("Success" | "Partial" | "Failed") to a UI variant */
export function statusVariant(s: string): Variant {
  switch (s) {
    case "Success":
      return "success";
    case "Failed":
      return "danger";
    case "Partial":
      return "warning";
    default:
      return "neutral";
  }
}

/** Maps scheduler trigger ("Cron" | "Manual") to a UI variant */
export function triggerVariant(s: string): Variant {
  switch (s) {
    case "Cron":
      return "primary";
    case "Manual":
      return "neutral";
    default:
      return "purple";
  }
}

// ─── Date formatting ───────────────────────────────────────────────────────────

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}