"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { CartLine } from "@/lib/types";

type CartContextValue = {
  lines: CartLine[];
  addItem: (line: CartLine) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function getStorageKey(customerId: string) {
  return `cloud-kitchen-cart-${customerId}`;
}

function readStoredLines(customerId: string) {
  const stored = window.localStorage.getItem(getStorageKey(customerId));
  if (!stored) {
    return [] as CartLine[];
  }

  try {
    return JSON.parse(stored) as CartLine[];
  } catch {
    window.localStorage.removeItem(getStorageKey(customerId));
    return [] as CartLine[];
  }
}

function writeStoredLines(customerId: string, lines: CartLine[]) {
  const storageKey = getStorageKey(customerId);

  if (!lines.length) {
    window.localStorage.removeItem(storageKey);
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(lines));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const customerId = session?.user?.appUserId;
  const storedCustomerId = useRef<string | null>(null);
  const hydratedCustomerId = useRef<string | null>(null);
  const [lines, setLines] = useState<CartLine[]>([]);
  const remoteCart = useQuery(api.carts.getByCustomerId, customerId ? { customerId } : "skip");
  const setCart = useMutation(api.carts.setCart);
  const clearRemoteCart = useMutation(api.carts.clearCart);
  const remoteItems = remoteCart?.items ?? [];
  const remoteSnapshot = JSON.stringify(remoteItems);
  const localSnapshot = JSON.stringify(lines);

  useEffect(() => {
    if (!customerId) {
      storedCustomerId.current = null;
      hydratedCustomerId.current = null;
      setLines([]);
      return;
    }

    if (storedCustomerId.current === customerId) {
      return;
    }

    storedCustomerId.current = customerId;
    hydratedCustomerId.current = null;
    setLines(readStoredLines(customerId));
  }, [customerId]);

  useEffect(() => {
    if (!customerId || remoteCart === undefined) {
      return;
    }

    const storedLines = readStoredLines(customerId);
    const nextLines = remoteItems.length ? remoteItems : storedLines;
    writeStoredLines(customerId, nextLines);
    hydratedCustomerId.current = customerId;
    setLines((current) => (JSON.stringify(current) === JSON.stringify(nextLines) ? current : nextLines));
  }, [customerId, remoteCart, remoteItems]);

  useEffect(() => {
    if (!customerId || hydratedCustomerId.current !== customerId || remoteCart === undefined) {
      return;
    }

    writeStoredLines(customerId, lines);

    if (localSnapshot === remoteSnapshot) {
      return;
    }

    const syncCart = async () => {
      if (!lines.length) {
        await clearRemoteCart({ customerId });
        return;
      }

      await setCart({ customerId, items: lines });
    };

    void syncCart();
  }, [clearRemoteCart, customerId, lines, localSnapshot, remoteCart, remoteSnapshot, setCart]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      addItem: (line) => {
        if (status !== "authenticated" || !customerId) {
          toast.error("Please sign in to add items to cart");
          router.push("/landing");
          return;
        }

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
    [customerId, lines, router, status],
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
