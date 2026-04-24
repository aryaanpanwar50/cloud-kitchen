"use client";

import { formatCurrency, formatRelativeTime, getStatusClasses } from "@/lib/utils";
import type { Doc } from "@/convex/_generated/dataModel";

type KitchenOrder = Doc<"orders">;

const STATUS_NEXT: Record<string, { label: string; next: string; color: string } | null> = {
  pending:   { label: "Accept Order",    next: "confirmed",  color: "bg-green-500 hover:bg-green-600 text-white" },
  confirmed: { label: "Start Preparing", next: "preparing",  color: "bg-blue-500 hover:bg-blue-600 text-white" },
  preparing: { label: "Mark Ready",      next: "ready",      color: "bg-purple-500 hover:bg-purple-600 text-white" },
  ready:     { label: "Dispatch",        next: "dispatched", color: "bg-[#FF5F40] hover:bg-[#E04A2A] text-white" },
  dispatched:{ label: "Mark Delivered",  next: "delivered",  color: "bg-emerald-500 hover:bg-emerald-600 text-white" },
  delivered: null,
  cancelled: null,
};

const CARD_BORDER: Record<string, string> = {
  pending:    "border-amber-200",
  confirmed:  "border-sky-200",
  preparing:  "border-violet-200",
  ready:      "border-emerald-200",
  dispatched: "border-orange-200",
  delivered:  "border-gray-200",
  cancelled:  "border-rose-200",
};

export function KitchenOrderCard({
  order,
  onStatus,
}: {
  order: KitchenOrder;
  onStatus: (orderNumber: string, status: string) => void;
}) {
  const next = STATUS_NEXT[order.status];

  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition hover:shadow-md ${CARD_BORDER[order.status] ?? "border-gray-200"}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 py-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-[#FF5F40]">{order.orderNumber}</p>
          <h3 className="mt-1 text-base font-bold text-gray-900">{order.customerName}</h3>
          <p className="mt-0.5 truncate text-xs text-gray-500">{order.deliveryAddress}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className={`status-pill ${getStatusClasses(order.status as never)}`}>{order.status}</span>
          <span className="text-xs text-gray-400">{formatRelativeTime(order.createdAt)}</span>
        </div>
      </div>

      {/* Items */}
      <ul className="mx-5 flex-1 divide-y divide-gray-100 rounded-xl border border-gray-100 bg-gray-50 px-4">
        {order.items.map((item: { name: string; quantity: number; price: number }) => (
          <li key={item.name} className="flex items-center justify-between py-2.5 text-sm">
            <span className="font-medium text-gray-800">{item.name}</span>
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-gray-600 shadow-sm">×{item.quantity}</span>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <span className="text-base font-bold text-[#FF5F40]">{formatCurrency(order.total)}</span>
        <div className="flex gap-2">
          {order.status === "pending" && (
            <button
              onClick={() => onStatus(order.orderNumber, "cancelled")}
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
            >
              Reject
            </button>
          )}
          {next && (
            <button
              onClick={() => onStatus(order.orderNumber, next.next)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition ${next.color}`}
            >
              {next.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
