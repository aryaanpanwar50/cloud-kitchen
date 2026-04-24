"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { AppShell } from "@/components/ui/app-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { KitchenOrderCard } from "@/components/kitchen/order-card";
import type { Doc } from "@/convex/_generated/dataModel";

type ActiveOrder = Doc<"orders">;

const STATUS_FILTERS = [
  { key: "", label: "All Active" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "dispatched", label: "Dispatched" },
] as const;

export function KitchenDashboardPage() {
  const orders = useQuery(api.orders.listActive, {});
  const updateStatus = useMutation(api.orders.updateStatus);
  const [filterStatus, setFilterStatus] = useState("");

  const allOrders = (orders as ActiveOrder[] | undefined) ?? [];
  const pendingCount = allOrders.filter(o => o.status === "pending").length;

  const displayed = filterStatus
    ? allOrders.filter(o => o.status === filterStatus)
    : allOrders;

  useEffect(() => {
    document.title = pendingCount ? `(${pendingCount}) Kitchen Dashboard` : "Kitchen Dashboard";
    return () => { document.title = "Mumbai Cloud Kitchen"; };
  }, [pendingCount]);

  async function onStatus(orderNumber: string, status: string) {
    try {
      await updateStatus({ orderNumber, status: status as never });
      toast.success(`Order moved to ${status}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update order status");
    }
  }

  return (
    <AppShell
      title={pendingCount ? `Kitchen — ${pendingCount} new order${pendingCount !== 1 ? "s" : ""}` : "Kitchen Dashboard"}
      subtitle="Live order queue — updates in real time"
    >
      <div className="flex h-full flex-col overflow-hidden">

        {/* Filter bar */}
        <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-gray-200 bg-white px-8 py-3">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilterStatus(f.key)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filterStatus === f.key
                  ? "bg-[#FF5F40] text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-[#FF5F40] hover:text-[#FF5F40]"
              }`}
            >
              {f.label}
              {f.key === "pending" && pendingCount > 0 && (
                <span className="ml-1.5 rounded-full bg-white/30 px-1.5 py-0.5 text-[10px] font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}

          <span className="ml-auto shrink-0 text-sm text-gray-400">
            {displayed.length} order{displayed.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Order grid */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {!orders ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-56 animate-pulse rounded-2xl bg-gray-100" />
              ))}
            </div>
          ) : displayed.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <EmptyState
                title={filterStatus ? `No ${filterStatus} orders` : "No active orders"}
                description="New incoming orders will appear here automatically in real time."
              />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {displayed.map(order => (
                <KitchenOrderCard key={order._id} order={order} onStatus={onStatus} />
              ))}
            </div>
          )}
        </div>

      </div>
    </AppShell>
  );
}
