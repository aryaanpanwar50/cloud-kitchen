"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppShell } from "@/components/ui/app-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { OrderStatusSteps } from "@/components/tracking/order-status-steps";
import { formatCurrency, getStatusClasses } from "@/lib/utils";
import { CheckCircle2, UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";

export function OrderTrackingPage({ orderNumber }: { orderNumber: string }) {
  const order = useQuery(api.orders.getByOrderNumber, { orderNumber });

  if (order === undefined) {
    return (
      <AppShell title="Order Tracking" subtitle="Loading your order…">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 animate-pulse rounded-[2rem] bg-[#F0EDE8]" />
          ))}
        </div>
      </AppShell>
    );
  }

  if (!order) {
    return (
      <AppShell title="Order Not Found" subtitle="We couldn't find that order">
        <div className="flex h-full items-center justify-center px-4 py-16 sm:px-8">
          <EmptyState title="Order not found" description="Check the order link or place a fresh order from the menu." />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={`Order #${order.orderNumber}`}
      subtitle={`${order.customerName} · ${order.deliveryAddress}`}
    >
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 space-y-8">

        {/* Status tracker card */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-[#E8E8E4] bg-white p-6 sm:p-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>Order Status</h2>
            <span className={`status-pill ${getStatusClasses(order.status)}`}>
              {order.status}
            </span>
          </div>

          <OrderStatusSteps status={order.status} />

          {(order.status === "dispatched" || order.status === "delivered") && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-8 flex items-center gap-3 rounded-2xl bg-emerald-50 px-6 py-4 text-sm font-medium text-emerald-800">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              {order.status === "dispatched"
                ? "Your order is on the way! Estimated arrival in 15–20 minutes."
                : "Your order has been delivered. Enjoy your meal!"}
            </motion.div>
          )}
        </motion.section>

        {/* Items + Delivery side by side */}
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* Items ordered */}
          <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="rounded-[2rem] border border-[#E8E8E4] bg-white p-6 sm:p-8">
            <h2 className="mb-6 text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>Items Ordered</h2>
            <ul className="space-y-4">
              {order.items.map((item: { itemId: string; name: string; price: number; quantity: number }) => (
                <li key={item.itemId} className="flex items-center justify-between gap-4 rounded-2xl bg-[#F9F9F7] px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[#F0EDE8] text-[#6B6B6B]">
                      <UtensilsCrossed className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-[#1A1A1A]">{item.name}</p>
                      <p className="text-sm font-semibold text-[#6B6B6B]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-base font-bold text-[#FF5F40]">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Delivery + totals */}
          <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            <div className="rounded-[2rem] border border-[#E8E8E4] bg-white p-6 sm:p-8">
              <h2 className="mb-6 text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>Delivery Details</h2>

              <div className="space-y-5 text-sm">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">Address</p>
                  <p className="mt-2 text-[#1A1A1A] bg-[#F9F9F7] p-4 rounded-2xl">{order.deliveryAddress}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B] mb-2">Payment</p>
                  <span className="inline-flex rounded-full bg-[#FF5F40]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#FF5F40]">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#E8E8E4] bg-[#F9F9F7] p-6 sm:p-8 space-y-4 text-sm">
              <div className="flex justify-between text-[#6B6B6B]">
                <span className="font-semibold">Subtotal</span>
                <span className="font-bold text-[#1A1A1A]">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#6B6B6B]">
                <span className="font-semibold">Delivery fee</span>
                <span className="font-bold text-[#1A1A1A]">{formatCurrency(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between border-t border-[#E8E8E4] pt-4 font-bold text-[#1A1A1A]">
                <span className="text-base">Total</span>
                <span className="text-xl text-[#FF5F40]">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </motion.section>

        </div>
      </div>
    </AppShell>
  );
}
