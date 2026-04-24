"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/providers/cart-provider";
import type { MenuItemView } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Star } from "lucide-react";

const STATIC_RATINGS = [3.9, 4.6, 4.4, 4.3, 4.8, 4.1, 4.5, 4.7, 4.2, 4.9];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(s => (
        <Star
          key={s}
          className={`h-3.5 w-3.5 ${s <= Math.round(rating) ? "fill-[#FF5F40] text-[#FF5F40]" : "fill-gray-200 text-gray-200"}`}
        />
      ))}
      <span className="ml-0.5 text-xs text-[#6B6B6B]">{rating.toFixed(1)}</span>
    </div>
  );
}

export function MenuItemCard({ item }: { item: MenuItemView }) {
  const { addItem } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const ratingIdx = item._id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % STATIC_RATINGS.length;
  const rating = STATIC_RATINGS[ratingIdx];

  return (
    <article className="group overflow-hidden rounded-3xl border border-[#E8E8E4] bg-white transition hover:border-[#FF5F40]/30">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-[#F0EDE8]">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">🍽️</div>
        )}
        {!item.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#1A1A1A]">Sold Out</span>
          </div>
        )}
        {/* Price badge */}
        <div className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#1A1A1A]">
          {formatCurrency(item.price)}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-[#1A1A1A]">{item.name}</h3>
        <p className="mt-1 text-xs leading-5 text-[#6B6B6B] line-clamp-2">{item.description}</p>

        <div className="mt-4">
          <StarRating rating={rating}/>
        </div>

        <button
          disabled={!item.isAvailable}
          onClick={() => {
            if (!session?.user) {
              router.push("/landing");
              return;
            }
            addItem({ itemId: item._id, name: item.name, price: item.price, quantity: 1, imageUrl: item.imageUrl });
          }}
          className="mt-5 w-full rounded-2xl bg-[#F0EDE8] py-3 text-sm font-bold text-[#1A1A1A] transition hover:bg-[#FF5F40] hover:text-white disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
        >
          {item.isAvailable ? "Add to Cart" : "Unavailable"}
        </button>
      </div>
    </article>
  );
}
