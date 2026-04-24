"use client";

import Link from "next/link";
import { useCart } from "@/components/providers/cart-provider";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { envDefaults } from "@/lib/env";
import { getCartTotals, formatCurrency } from "@/lib/utils";

export function StickyCartButton() {
  const { lines } = useCart();
  const settings = useQuery(api.settings.getPublic, {});

  const totals = getCartTotals(lines, settings?.deliveryFee ?? envDefaults.deliveryFee);

  if (!totals.count) {
    return null;
  }

  return (
    <Link
      href="/cart"
      className="fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-full bg-[#FF5F40]/100 px-5 py-4 text-white shadow-2xl transition hover:bg-orange-600"
    >
      <span className="text-sm font-medium text-white/90">{totals.count} items in cart</span>
      <span className="text-sm font-semibold text-white">View cart · {formatCurrency(totals.total)}</span>
    </Link>
  );
}
