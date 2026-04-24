"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useCart } from "@/components/providers/cart-provider";
import { AppShell } from "@/components/ui/app-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { envDefaults } from "@/lib/env";
import { getCartTotals, formatCurrency } from "@/lib/utils";
import type { AddressFormValues } from "@/lib/types";
import { Trash2, Plus, Minus, UtensilsCrossed } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

async function ensureRazorpayScript() {
  if (window.Razorpay) return true;
  return await new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

type CheckoutValues = {
  firstName: string;
  lastName: string;
  deliveryAddress: string;
  customerPhone: string;
};

const checkoutStorageKey = "cloud-kitchen-checkout";

export function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { lines, updateQuantity, removeItem, clearCart } = useCart();
  const settings = useQuery(api.settings.getPublic, {});
  const createOrder = useMutation(api.orders.createOrder);
  const totals = useMemo(
    () => getCartTotals(lines, settings?.deliveryFee ?? envDefaults.deliveryFee),
    [lines, settings?.deliveryFee],
  );

  const [checkout] = useState<CheckoutValues>(() => {
    if (typeof window === "undefined") {
      return { firstName: "", lastName: "", deliveryAddress: "", customerPhone: "" };
    }
    const stored = window.localStorage.getItem(checkoutStorageKey);
    if (!stored) {
      return { firstName: "", lastName: "", deliveryAddress: "", customerPhone: "" };
    }
    try {
      const parsed = JSON.parse(stored) as Partial<CheckoutValues>;
      return {
        firstName: parsed.firstName ?? "",
        lastName: parsed.lastName ?? "",
        deliveryAddress: parsed.deliveryAddress ?? "",
        customerPhone: parsed.customerPhone ?? "",
      };
    } catch {
      window.localStorage.removeItem(checkoutStorageKey);
      return { firstName: "", lastName: "", deliveryAddress: "", customerPhone: "" };
    }
  });
  const [form, setForm] = useState<AddressFormValues>({ deliveryAddress: checkout.deliveryAddress });
  const [firstName, setFirstName] = useState(checkout.firstName);
  const [lastName, setLastName] = useState(checkout.lastName);
  const [customerPhone, setCustomerPhone] = useState(checkout.customerPhone);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(
      checkoutStorageKey,
      JSON.stringify({ firstName, lastName, deliveryAddress: form.deliveryAddress, customerPhone }),
    );
  }, [firstName, lastName, form.deliveryAddress, customerPhone]);

  async function createKitchenOrder(paymentId?: string) {
    if (!session?.user?.email) { router.push("/landing"); return; }
    const orderNumber = await createOrder({
      customerId: session.user.appUserId,
      customerEmail: session.user.email,
      customerName: (`${firstName} ${lastName}`.trim() || session.user.name) ?? session.user.email,
      customerPhone,
      deliveryAddress: form.deliveryAddress,
      deliveryLat: Number(settings?.kitchenLat ?? envDefaults.kitchenLat),
      deliveryLng: Number(settings?.kitchenLng ?? envDefaults.kitchenLng),
      items: lines.map(l => ({ itemId: l.itemId, name: l.name, price: l.price, quantity: l.quantity })),
      subtotal: totals.subtotal,
      deliveryFee: totals.deliveryFee,
      total: totals.total,
      paymentMethod: "upi",
      paymentId,
    });
    clearCart();
    toast.success("Order placed successfully!");
    router.push(`/order/${orderNumber}`);
  }

  async function handlePlaceOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session?.user) { router.push("/landing"); return; }
    if (!lines.length) { toast.error("Your cart is empty"); return; }
    if (!form.deliveryAddress) { toast.error("Enter your delivery address"); return; }
    if (settings?.kitchenOpen === false) { toast.error("We are currently closed"); return; }
    const contact = customerPhone.replace(/[^\d+]/g, "").trim();
    setSubmitting(true);
    try {
      const loaded = await ensureRazorpayScript();
      if (!loaded || !window.Razorpay) throw new Error("Unable to load Razorpay checkout");
      const orderResponse = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totals.total }),
      });
      const orderPayload = (await orderResponse.json()) as { id?: string; error?: string };
      if (!orderResponse.ok || !orderPayload.id) throw new Error(orderPayload.error ?? "Unable to create payment order");
      const razorpay = new window.Razorpay({
        key: envDefaults.razorpayKeyId,
        amount: totals.total,
        currency: "INR",
        name: settings?.kitchenName ?? envDefaults.kitchenName,
        description: "Cloud kitchen order",
        order_id: orderPayload.id,
        method: {
          upi: true,
        },
        handler: async (response: Record<string, string>) => {
          const verifyResponse = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyPayload = (await verifyResponse.json()) as { verified?: boolean; error?: string };
          if (!verifyResponse.ok || !verifyPayload.verified) { toast.error(verifyPayload.error ?? "Payment verification failed"); return; }
          await createKitchenOrder(response.razorpay_payment_id);
        },
        modal: { ondismiss: () => toast.error("Payment window dismissed") },
        prefill: { name: session.user.name ?? "", email: session.user.email ?? "", contact },
      });
      razorpay.open();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (!lines.length) {
    return (
      <AppShell title="Your Cart" subtitle="Review items before checkout">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex h-full items-center justify-center px-8 py-16">
          <EmptyState title="Your cart is empty" description="Add dishes from the menu to start checkout." />
        </motion.div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Checkout" subtitle="Review items, add delivery details and pay">
      <form onSubmit={handlePlaceOrder} className="mx-auto max-w-6xl p-4 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">

          {/* ── Left: Delivery details ───────────────────────── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 rounded-[2rem] border border-[#E8E8E4] bg-white p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>Delivery Details</h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">First Name</label>
                <input
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full rounded-2xl bg-[#F9F9F7] px-5 py-4 text-sm text-[#1A1A1A] outline-none transition focus:bg-[#F0EDE8]"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">Last Name</label>
                <input
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full rounded-2xl bg-[#F9F9F7] px-5 py-4 text-sm text-[#1A1A1A] outline-none transition focus:bg-[#F0EDE8]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">Street Address</label>
              <textarea
                rows={2}
                placeholder="6391 Elgin St, your area, Mumbai"
                value={form.deliveryAddress}
                onChange={e => setForm(f => ({ ...f, deliveryAddress: e.target.value }))}
                required
                className="w-full resize-none rounded-2xl bg-[#F9F9F7] px-5 py-4 text-sm text-[#1A1A1A] outline-none transition focus:bg-[#F0EDE8]"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">Phone Number</label>
              <input
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="+91 98765 43210"
                inputMode="tel"
                autoComplete="tel"
                required
                className="w-full rounded-2xl bg-[#F9F9F7] px-5 py-4 text-sm text-[#1A1A1A] outline-none transition focus:bg-[#F0EDE8]"
              />
            </div>
          </motion.div>

          {/* ── Right: Order summary panel ───────────────────── */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col space-y-6 rounded-[2rem] border border-[#E8E8E4] bg-white p-6 sm:p-8 h-fit sticky top-24">
            <h2 className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>Order Summary</h2>

            <ul className="space-y-5">
              <AnimatePresence>
                {lines.map(line => (
                  <motion.li layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} key={line.itemId} className="flex items-start gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[1rem] bg-[#F0EDE8]">
                      {line.imageUrl ? (
                        <Image src={line.imageUrl} alt={line.name} fill className="object-cover"/>
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                          <UtensilsCrossed className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <p className="truncate text-sm font-bold text-[#1A1A1A]">{line.name}</p>
                      <p className="text-xs text-[#6B6B6B] mt-0.5">{formatCurrency(line.price)} each</p>
                      <div className="mt-2 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.itemId, line.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F9F9F7] text-[#6B6B6B] transition hover:bg-[#F0EDE8] hover:text-[#1A1A1A]"
                        ><Minus className="h-3 w-3" /></button>
                        <span className="min-w-[1.25rem] text-center text-xs font-bold text-[#1A1A1A]">{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.itemId, line.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F9F9F7] text-[#6B6B6B] transition hover:bg-[#F0EDE8] hover:text-[#1A1A1A]"
                        ><Plus className="h-3 w-3" /></button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 py-1">
                      <span className="text-sm font-bold text-[#FF5F40]">{formatCurrency(line.price * line.quantity)}</span>
                      <button
                        type="button"
                        onClick={() => removeItem(line.itemId)}
                        className="text-[#6B6B6B] transition hover:text-red-500 rounded-full p-1.5 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            {/* Totals + CTA pinned at bottom */}
            <div className="border-t border-[#E8E8E4] pt-5 space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#6B6B6B]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1A1A1A]">{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#6B6B6B]">
                  <span>Delivery fee</span>
                  <span className="font-medium text-[#1A1A1A]">{formatCurrency(totals.deliveryFee)}</span>
                </div>
                <div className="flex justify-between border-t border-[#E8E8E4] pt-3 text-base font-bold text-[#1A1A1A]">
                  <span>Total</span>
                  <span className="text-[#FF5F40] text-xl">{formatCurrency(totals.total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || settings?.kitchenOpen === false}
                className="w-full rounded-full bg-[#FF5F40] py-4 text-sm font-bold text-white shadow-lg transition hover:bg-[#E04A2A] hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:transform-none"
              >
                {submitting ? "Processing…" : "Pay & Order"}
              </button>

              {settings?.kitchenOpen === false && (
                <p className="text-center text-xs font-semibold text-red-500 bg-red-50 py-2 rounded-lg">Kitchen is currently closed.</p>
              )}
            </div>
          </motion.div>

        </div>
      </form>
    </AppShell>
  );
}
