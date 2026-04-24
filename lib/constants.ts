export const menuCategories = ["starters", "mains", "drinks", "desserts"] as const;

export const paymentMethods = ["upi", "card", "cod"] as const;

export const orderStatuses = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "dispatched",
  "delivered",
  "cancelled",
] as const;

export const roles = ["customer", "staff", "admin"] as const;

export const trackingStages = [
  { key: "pending", label: "Order Placed" },
  { key: "confirmed", label: "Order Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "dispatched", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
] as const;

export const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-sky-100 text-sky-800",
  preparing: "bg-violet-100 text-violet-800",
  ready: "bg-emerald-100 text-emerald-800",
  dispatched: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-rose-100 text-rose-800",
};

export const defaultDeliveryFee = 45;
