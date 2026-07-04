import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type Variant } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function paymentVariant(s: string): Variant {
  return s === "PAID" ? "success" : s === "PENDING" ? "warning" : s === "FAILED" ? "danger" : "neutral";
}

export function orderVariant(s: string): Variant {
  switch (s) {
    case "PLACED": return "info";
    case "PROCESSING": return "warning";
    case "READY_TO_SHIP": return "primary";
    case "SHIPPED": return "success";
    case "CANCELLED": return "danger";
    default: return "neutral";
  }
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  return date;
}

export function prettyStatus(s: string) {
  return s
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function prettyPayment(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase();
}

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export function statusVariant(s: string) {
  return s === "SUCCESS" ? "success" as const : s === "FAILED" ? "danger" as const : "warning" as const;
}
export function triggerVariant(s: string) {
  return s === "CRON" ? "primary" as const : s === "MANUAL" ? "neutral" as const : "purple" as const;
}