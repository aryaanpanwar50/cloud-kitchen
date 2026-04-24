"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/components/providers/cart-provider";
import { SonnerToaster } from "@/components/ui/sonner-toaster";
import { envDefaults } from "@/lib/env";

const convex = envDefaults.convexUrl
  ? new ConvexReactClient(envDefaults.convexUrl)
  : null;

export function AppProviders({ children }: { children: React.ReactNode }) {
  const content = (
    <SessionProvider>
      <CartProvider>
        {children}
        <SonnerToaster />
      </CartProvider>
    </SessionProvider>
  );

  if (!convex) {
    return content;
  }

  return <ConvexProvider client={convex}>{content}</ConvexProvider>;
}
