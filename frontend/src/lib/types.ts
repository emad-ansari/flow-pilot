export type PaymentStatus = "PAID" | "PENDING" | "FAILED" | "REFUNDED";
export type OrderStatus =
  "PLACED" | "PROCESSING" | "READY_TO_SHIP" | "SHIPPED" | "CANCELLED";
export type Variant =
  "success" | "warning" | "danger" | "info" | "neutral" | "primary" | "purple";

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  product: string;
  amount: number;
  payment: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
}

const customers = [
  ["Wade Warren", "wade@acme.co", "+12025550134"],
  ["Esther Howard", "esther@northwind.io", "+14155550198"],
  ["Jenny Wilson", "jenny.w@loop.dev", "+16465550177"],
  ["Guy Hawkins", "guy@planetary.com", "+13125550142"],
  ["Jacob Jones", "jacob.j@relay.app", "+19175550155"],
  ["Kristin Watson", "kristin@vista.co", "+12135550121"],
  ["Albert Flores", "albert@harbor.dev", "+13055550189"],
  ["Eleanor Pena", "eleanor@fern.app", "+16175550167"],
  ["Theresa Webb", "theresa@arc.io", "+17205550111"],
  ["Cameron Wills", "cam@parallel.co", "+15035550102"],
  ["Devon Lane", "devon@meridian.io", "+14155550119"],
  ["Brooklyn Simmons", "brooklyn@stripe.dev", "+16465550133"],
];

const products = [
  "Aurora Wireless Headphones",
  "Meridian Smart Lamp",
  "Nova Coffee Grinder Pro",
  "Zenith Ergonomic Chair",
  "Cascade Standing Desk",
  "Harmony Portable Speaker",
  "Flexy Modular Sofa",
  "Haven Linen Duvet Set",
];

const paymentStatuses: PaymentStatus[] = [
  "PAID",
  "PENDING",
  "PAID",
  "PAID",
  "FAILED",
  "PAID",
  "PENDING",
  "REFUNDED",
];
const orderStatuses: OrderStatus[] = [
  "PLACED",
  "PROCESSING",
  "READY_TO_SHIP",
  "SHIPPED",
  "PLACED",
  "PROCESSING",
  "READY_TO_SHIP",
  "CANCELLED",
];

export const orders: Order[] = Array.from({ length: 24 }, (_, i) => {
  const [name, email, phone] = customers[i % customers.length];
  const d = new Date(2026, 5, 28 - (i % 28));
  return {
    id: `FP-${10247 - i}`,
    customer: name,
    email,
    phone,
    product: products[i % products.length],
    amount: Math.round((80 + ((i * 37.5) % 1200)) * 100) / 100,
    payment: paymentStatuses[i % paymentStatuses.length],
    status: orderStatuses[i % orderStatuses.length],
    createdAt: d.toISOString(),
  };
});

export interface SchedulerLog {
  id: string;
  runTime: string;
  ordersChecked: number;
  ordersUpdated: number;
  executionMs: number;
  status: "SUCCESS" | "FAILED" | "PARTIAL";
  trigger: "CRON" | "MANUAL" | "WEBHOOK";
}

export const schedulerLogs: SchedulerLog[] = Array.from(
  { length: 18 },
  (_, i) => {
    const d = new Date(Date.now() - i * 1000 * 60 * 37);
    const statuses: SchedulerLog["status"][] = [
      "SUCCESS",
      "SUCCESS",
      "SUCCESS",
      "PARTIAL",
      "SUCCESS",
      "FAILED",
      "SUCCESS",
    ];
    const triggers: SchedulerLog["trigger"][] = [
      "CRON",
      "CRON",
      "MANUAL",
      "CRON",
      "WEBHOOK",
      "CRON",
      "CRON",
    ];
    return {
      id: `RUN-${8420 - i}`,
      runTime: d.toISOString(),
      ordersChecked: 40 + ((i * 13) % 180),
      ordersUpdated: 2 + ((i * 5) % 24),
      executionMs: 240 + ((i * 91) % 1400),
      status: statuses[i % statuses.length],
      trigger: triggers[i % triggers.length],
    };
  },
);
