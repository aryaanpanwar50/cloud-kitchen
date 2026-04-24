"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppShell } from "@/components/ui/app-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, getStatusClasses } from "@/lib/utils";
import type { Doc } from "@/convex/_generated/dataModel";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

type CustomerOrder = Doc<"orders">;

export function OrdersHistoryPage({ customerEmail }: { customerEmail: string }) {
  const orders = useQuery(api.orders.listByCustomer, { customerEmail });

  return (
    <AppShell title="Your Orders" subtitle="Track and review past orders">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">

        {!orders ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-[2rem] bg-[#F0EDE8]" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex h-64 items-center justify-center">
            <EmptyState
              title="No orders yet"
              description="Place your first order from the menu and it will appear here."
            />
          </motion.div>
        ) : (
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-4"
          >
            {((orders as CustomerOrder[] | undefined) ?? []).map(order => (
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} key={order._id}>
                <Link
                  href={`/order/${order.orderNumber}`}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-[2rem] border border-[#E8E8E4] bg-white p-6 transition hover:border-[#FF5F40]/30 hover:bg-[#F9F9F7]"
                >
                  {/* Left: order info */}
                  <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1rem] bg-[#F0EDE8] text-[#1A1A1A] transition group-hover:bg-[#FF5F40] group-hover:text-white">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-[#1A1A1A]">Order #{order.orderNumber}</p>
                      <p className="mt-1 text-sm text-[#6B6B6B]">
                        {new Date(order.createdAt).toLocaleString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                      <p className="mt-1 text-sm text-[#6B6B6B] line-clamp-1">{order.deliveryAddress}</p>
                    </div>
                  </div>

                  {/* Right: status + total */}
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 border-t border-[#E8E8E4] pt-4 sm:border-none sm:pt-0">
                    <span className={`status-pill ${getStatusClasses(order.status)}`}>
                      {order.status}
                    </span>
                    <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
                      <div className="text-right">
                        <span className="text-base font-bold text-[#FF5F40]">
                          {formatCurrency(order.total)}
                        </span>
                        <p className="text-xs font-semibold text-[#6B6B6B]">
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-[#A0A0A0] transition group-hover:text-[#FF5F40] sm:hidden" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
