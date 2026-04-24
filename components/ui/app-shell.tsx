"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/components/providers/cart-provider";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getCartTotals, formatCurrency } from "@/lib/utils";
import { envDefaults } from "@/lib/env";
import { cn } from "@/lib/utils";
import { Utensils, ClipboardList, ChefHat, ShieldAlert, LogOut, ShoppingCart, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CUSTOMER_NAV = [
  { label: "Menu", href: "/", icon: <Utensils className="h-4 w-4" /> },
  { label: "Orders", href: "/orders", icon: <ClipboardList className="h-4 w-4" /> },
];

const KITCHEN_NAV = { label: "Kitchen", href: "/kitchen", icon: <ChefHat className="h-4 w-4" /> };
const ADMIN_NAV = { label: "Admin", href: "/admin", icon: <ShieldAlert className="h-4 w-4" /> };

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  fullHeight?: boolean;
}

export function AppShell({ children, title, subtitle, fullHeight }: AppShellProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;
  const { lines } = useCart();
  const settings = useQuery(api.settings.getPublic, {});
  const totals = getCartTotals(lines, settings?.deliveryFee ?? envDefaults.deliveryFee);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    ...CUSTOMER_NAV,
    ...(role === "staff" || role === "admin" ? [KITCHEN_NAV] : []),
    ...(role === "admin" ? [ADMIN_NAV] : []),
  ];

  return (
    <div className={cn("flex flex-col bg-[#F9F9F7]", fullHeight ? "h-screen overflow-hidden" : "min-h-screen")}>
      {/* ── Top Navigation ── */}
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b border-[#E8E8E4] bg-white px-4 sm:px-8">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#1A1A1A]">
            <span className="text-[#FF5F40]">Urban</span>Eats
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                    active
                      ? "bg-[#FF5F40]/10 text-[#FF5F40]"
                      : "text-[#6B6B6B] hover:bg-gray-100 hover:text-[#1A1A1A]"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side: Cart & Profile */}
        <div className="flex items-center gap-3">
          {session?.user ? (
            <div className="hidden items-center gap-3 md:flex">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0EDE8] text-sm font-bold text-[#1A1A1A]"
                title={session.user.name ?? "User"}
              >
                {session.user.name?.charAt(0).toUpperCase() ?? "U"}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/landing" })}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B6B6B] transition hover:bg-gray-100 hover:text-[#1A1A1A]"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/signin"
              className="hidden rounded-full bg-[#FF5F40] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#E04A2A] md:block"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#1A1A1A] md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 z-40 border-b border-[#E8E8E4] bg-white px-4 py-4 md:hidden shadow-lg">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition",
                    active
                      ? "bg-[#FF5F40]/10 text-[#FF5F40]"
                      : "text-[#6B6B6B] hover:bg-gray-100 hover:text-[#1A1A1A]"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
            {session?.user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: "/landing" });
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-[#6B6B6B] hover:bg-gray-100 hover:text-[#1A1A1A]"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            ) : (
              <Link
                href="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 flex w-full justify-center rounded-full bg-[#FF5F40] px-4 py-3 text-sm font-bold text-white"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}

      {/* ── Main Area ── */}
      <div className={cn("flex w-full flex-1 flex-col", fullHeight && "overflow-hidden")}>
        {/* Page Header (if provided) */}
        {(title || subtitle) && (
          <div className="shrink-0 bg-white px-4 py-6 sm:px-8">
            {title && (
              <h1 className="text-2xl font-bold text-[#1A1A1A] sm:text-3xl" style={{ fontFamily: "var(--font-poppins), sans-serif" }}>
                {title}
              </h1>
            )}
            {subtitle && <p className="mt-1 text-sm text-[#6B6B6B]">{subtitle}</p>}
          </div>
        )}

        {/* Page Content */}
        <main className={cn(fullHeight ? "flex-1 overflow-hidden" : "flex-1 pb-24")}>
          {children}
        </main>

        {/* Floating Round Cart Button (shows when cart has items on non-cart pages) */}
        <AnimatePresence>
          {totals.count > 0 && pathname !== "/cart" && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="fixed bottom-8 right-8 z-50 group flex flex-col items-end"
            >
              {/* Hover Dropdown/Tooltip */}
              <div className="absolute bottom-full right-0 mb-4 hidden w-64 flex-col rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-black/5 group-hover:flex">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">Your Cart</p>
                <ul className="space-y-3 max-h-[30vh] overflow-y-auto pr-2 scrollbar-hide">
                  {lines.map((line) => (
                    <li key={line.itemId} className="flex justify-between text-sm">
                      <span className="font-semibold text-[#1A1A1A] line-clamp-1 flex-1 mr-2">{line.quantity}x {line.name}</span>
                      <span className="text-[#FF5F40] font-bold shrink-0">{formatCurrency(line.price * line.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center justify-between border-t border-[#E8E8E4] pt-3 text-sm font-bold">
                  <span className="text-[#1A1A1A]">Total</span>
                  <span className="text-[#FF5F40]">{formatCurrency(totals.total)}</span>
                </div>
              </div>

              {/* The Button */}
              <Link
                href="/cart"
                className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#FF5F40] text-white shadow-2xl transition hover:bg-[#E04A2A] hover:scale-105 active:scale-95"
              >
                <motion.div key={totals.count} initial={{ scale: 1.5, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <ShoppingCart className="h-7 w-7" />
                </motion.div>
                <motion.span
                  key={`badge-${totals.count}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#1A1A1A] text-[11px] font-bold text-white shadow-sm ring-2 ring-white"
                >
                  {totals.count}
                </motion.span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
