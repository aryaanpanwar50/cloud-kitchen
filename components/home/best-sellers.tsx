"use client";

import { useRef } from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCart } from "@/components/providers/cart-provider";
import { formatCurrency } from "@/lib/utils";
import type { MenuItemView } from "@/lib/types";

function StarRating({ rating = 4.3 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(s => (
        <svg key={s} className={`h-3.5 w-3.5 ${s <= Math.round(rating) ? "fill-[#FF5F40]" : "fill-gray-200"}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
      <span className="ml-1 text-xs text-[#6B6B6B]">{rating.toFixed(1)}</span>
    </div>
  );
}

// Static ratings per item index for display
const STATIC_RATINGS = [3.9, 4.6, 4.4, 4.3, 4.8, 4.1, 4.5, 4.7];

export function BestSellers() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const menuItems = useQuery(api.menu.listAvailable, {});
  const { addItem } = useCart();

  const items = ((menuItems ?? []) as MenuItemView[]).slice(0, 8);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

  return (
    <section className="section-card mx-5 my-6 sm:mx-8">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF5F40]">Top Picks</span>
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Best Sellers</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E8E4] bg-white text-[#6B6B6B] transition hover:border-[#FF5F40] hover:text-[#FF5F40]"
            aria-label="Scroll left"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF5F40] text-white transition hover:bg-[#E04A2A]"
            aria-label="Scroll right"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      {!menuItems ? (
        <div className="flex gap-4 overflow-hidden">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-64 w-56 shrink-0 animate-pulse rounded-2xl bg-gray-100"/>
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="py-8 text-center text-sm text-[#6B6B6B]">No items available yet.</p>
      ) : (
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-none" style={{scrollbarWidth:"none"}}>
          {items.map((item, idx) => (
            <article key={item._id} className="card-food w-52 shrink-0">
              <div className="relative h-36 bg-[#FFF4E6]">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover"/>
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl">🍽️</div>
                )}
              </div>
              <div className="p-3.5">
                <h3 className="text-sm font-bold text-[#1A1A1A] line-clamp-1">{item.name}</h3>
                <p className="mt-0.5 text-xs text-[#6B6B6B] line-clamp-2">{item.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <StarRating rating={STATIC_RATINGS[idx % STATIC_RATINGS.length]}/>
                  <span className="text-sm font-bold text-[#FF5F40]">{formatCurrency(item.price)}</span>
                </div>
                <button
                  disabled={!item.isAvailable}
                  onClick={() => addItem({ itemId: item._id, name: item.name, price: item.price, quantity: 1, imageUrl: item.imageUrl })}
                  className="mt-3 w-full rounded-xl bg-[#FF5F40] py-1.5 text-xs font-semibold text-white transition hover:bg-[#E04A2A] disabled:opacity-50"
                >
                  {item.isAvailable ? "Order Now" : "Unavailable"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
