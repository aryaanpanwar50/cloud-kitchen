"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { AppShell } from "@/components/ui/app-shell";
import { MenuEditor } from "@/components/admin/menu-editor";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, getStatusClasses } from "@/lib/utils";
import type { Doc } from "@/convex/_generated/dataModel";

type MenuItemRecord = Doc<"menuItems"> & { imageUrl?: string };
type OrderRecord = Doc<"orders">;
type AdminTab = "add-item" | "menu" | "orders" | "settings";

const inputCls = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#FF5F40] focus:bg-white transition";

const TABS: Array<{ key: AdminTab; label: string; icon: React.ReactNode }> = [
  {
    key: "add-item",
    label: "Add Item",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    key: "menu",
    label: "Menu",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    key: "orders",
    label: "Orders",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    key: "settings",
    label: "Settings",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export function AdminDashboardPage() {
  const menuItems = useQuery(api.menu.listAll, {});
  const settings = useQuery(api.settings.getAdmin, {});
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const todaysOrders = useQuery(api.orders.listToday, { status: selectedStatus || undefined });
  const toggleAvailability = useMutation(api.menu.toggleAvailability);
  const removeItem = useMutation(api.menu.remove);
  const updateSettings = useMutation(api.settings.update);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("menu");
  const [kitchenOpen, setKitchenOpen] = useState<boolean>(settings?.kitchenOpen ?? true);

  const editingItem = (menuItems as MenuItemRecord[] | undefined)?.find(item => item._id === editingId);
  const renderedMenuItems = (menuItems as MenuItemRecord[] | undefined) ?? [];
  const renderedOrders = (todaysOrders as OrderRecord[] | undefined) ?? [];

  return (
    <AppShell title="Admin Dashboard" subtitle="Manage menu, orders, and kitchen settings">
      <div className="flex h-full flex-col overflow-hidden">

        {/* Tab bar */}
        <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-gray-200 bg-white px-8 py-3">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
                activeTab === tab.key
                  ? "bg-[#FF5F40] text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-[#FF5F40] hover:text-[#FF5F40]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">

          {/* ── Add Item ── */}
          {activeTab === "add-item" && (
            <div className="mx-auto max-w-xl">
              <div className="mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">
                  {editingItem ? `Editing "${editingItem.name}"` : "Fill in the details below to add a new dish to the menu."}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <MenuEditor
                  existing={editingItem}
                  onDone={() => {
                    setEditingId(null);
                    setActiveTab("menu");
                  }}
                />
              </div>
            </div>
          )}

          {/* ── Menu ── */}
          {activeTab === "menu" && (
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Menu Management</h2>
                  <p className="mt-0.5 text-xs text-gray-400">Toggle availability, edit, or remove dishes.</p>
                </div>
                <button
                  onClick={() => { setEditingId(null); setActiveTab("add-item"); }}
                  className="flex items-center gap-1.5 rounded-xl bg-[#FF5F40] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E04A2A]"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Item
                </button>
              </div>

              {!menuItems ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
                  ))}
                </div>
              ) : renderedMenuItems.length === 0 ? (
                <div className="flex h-64 items-center justify-center">
                  <EmptyState title="No menu items yet" description="Create a dish to publish it to the storefront in real time." />
                </div>
              ) : (
                <div className="space-y-3">
                  {renderedMenuItems.map(item => (
                    <div key={item._id} className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${item.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {item.isAvailable ? "Available" : "Sold out"}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-400 capitalize">{item.category} · {formatCurrency(item.price)}</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => { setEditingId(item._id); setActiveTab("add-item"); }}
                          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-[#FF5F40] hover:text-[#FF5F40]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => { await toggleAvailability({ id: item._id }); toast.success("Availability updated"); }}
                          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-[#FF5F40] hover:text-[#FF5F40]"
                        >
                          {item.isAvailable ? "Mark sold out" : "Make available"}
                        </button>
                        <button
                          onClick={async () => { await removeItem({ id: item._id }); toast.success("Menu item deleted"); }}
                          className="rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Orders ── */}
          {activeTab === "orders" && (
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Today&apos;s Orders</h2>
                  <p className="mt-0.5 text-xs text-gray-400">Live view of all orders placed today.</p>
                </div>
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#FF5F40] transition"
                >
                  <option value="">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {renderedOrders.length === 0 ? (
                <div className="flex h-64 items-center justify-center">
                  <EmptyState title="No orders today" description="New orders will appear here as they come in." />
                </div>
              ) : (
                <div className="space-y-3">
                  {renderedOrders.map(order => (
                    <div key={order._id} className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#FF5F40]">{order.orderNumber}</p>
                        <p className="mt-0.5 font-semibold text-gray-900">{order.customerName}</p>
                        <p className="text-xs text-gray-400">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`status-pill ${getStatusClasses(order.status)}`}>{order.status}</span>
                        <span className="font-bold text-[#FF5F40]">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Settings ── */}
          {activeTab === "settings" && (
            <div className="mx-auto max-w-xl">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-gray-900">Kitchen Settings</h2>
                <p className="mt-0.5 text-xs text-gray-400 mb-5">Control delivery fee, kitchen details, and open status.</p>

                <form
                  className="space-y-4"
                  onSubmit={async e => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    try {
                      await updateSettings({
                        deliveryFee: Number(fd.get("deliveryFee")),
                        kitchenOpen,
                        kitchenName: String(fd.get("kitchenName") ?? ""),
                        kitchenAddress: String(fd.get("kitchenAddress") ?? ""),
                        kitchenLat: Number(fd.get("kitchenLat")),
                        kitchenLng: Number(fd.get("kitchenLng")),
                        serviceAreaPolygon: JSON.parse(String(fd.get("serviceAreaPolygon") ?? "[]")),
                      });
                      toast.success("Settings updated");
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : "Unable to update settings");
                    }
                  }}
                >
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-500">Kitchen Name</label>
                    <input className={inputCls} name="kitchenName" placeholder="Mumbai Cloud Kitchen" defaultValue={settings?.kitchenName ?? ""} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-500">Kitchen Address</label>
                    <input className={inputCls} name="kitchenAddress" placeholder="123 Street, Mumbai" defaultValue={settings?.kitchenAddress ?? ""} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-gray-500">Delivery Fee (₹)</label>
                      <input className={inputCls} name="deliveryFee" placeholder="45" defaultValue={settings ? String(settings.deliveryFee) : "45"} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-gray-500">Latitude</label>
                      <input className={inputCls} name="kitchenLat" placeholder="19.0760" defaultValue={settings?.kitchenLat ?? ""} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-gray-500">Longitude</label>
                      <input className={inputCls} name="kitchenLng" placeholder="72.8777" defaultValue={settings?.kitchenLng ?? ""} />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-500">Service Area Polygon (JSON)</label>
                    <textarea
                      className={`${inputCls} resize-none font-mono`}
                      name="serviceAreaPolygon"
                      rows={4}
                      placeholder="[]"
                      defaultValue={settings ? JSON.stringify(settings.serviceAreaPolygon) : "[]"}
                    />
                  </div>

                  {/* Kitchen open toggle */}
                  <label className="flex cursor-pointer items-center gap-3">
                    <div
                      onClick={() => setKitchenOpen(v => !v)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${kitchenOpen ? "bg-[#FF5F40]" : "bg-gray-200"}`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${kitchenOpen ? "left-5" : "left-0.5"}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{kitchenOpen ? "Kitchen is open for orders" : "Kitchen is closed"}</span>
                  </label>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#FF5F40] py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#E04A2A]"
                  >
                    Save Settings
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </AppShell>
  );
}
