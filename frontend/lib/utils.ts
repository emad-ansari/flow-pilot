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