"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { CartLine } from "@/lib/types";

type CartContextValue = {
  lines: CartLine[];
  addItem: (line: CartLine) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
};

const storageKey = "cloud-kitchen-cart-v2";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored) as CartLine[];
    } catch {
      window.localStorage.removeItem(storageKey);
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(lines));
  }, [lines]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      addItem: (line) => {
        setLines((current) => {
          const existing = current.find((item) => item.itemId === line.itemId);
          if (existing) {
            return current.map((item) =>
              item.itemId === line.itemId
                ? { ...item, quantity: item.quantity + line.quantity }
                : item,
            );
          }

          return [...current, line];
        });
        toast.success(`${line.name} added to cart`);
      },
      removeItem: (itemId) => {
        setLines((current) => current.filter((line) => line.itemId !== itemId));
      },
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          setLines((current) => current.filter((line) => line.itemId !== itemId));
          return;
        }

        setLines((current) =>
          current.map((line) => (line.itemId === itemId ? { ...line, quantity } : line)),
        );
      },
      clearCart: () => setLines([]),
    }),
    [lines],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
