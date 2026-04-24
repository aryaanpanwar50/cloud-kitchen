"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function SiteHeader() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  return (
    <header className="w-full px-5 pt-5 sm:px-8 sm:pt-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-[#E8E8E4] bg-white/90 px-5 py-3 shadow-sm backdrop-blur sm:px-7">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF5F40] text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3h18v3a9 9 0 01-18 0V3z"/>
              <path d="M12 9v12M8 21h8"/>
            </svg>
          </div>
          <div className="leading-tight">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#FF5F40]">Cloud</p>
            <p className="text-sm font-bold text-[#1A1A1A]">Kitchen</p>
          </div>
        </Link>

        {/* Center nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-[#1A1A1A] hover:text-[#FF5F40] transition-colors">
            Home
          </Link>
          <Link href="/#menu" className="text-sm font-medium text-[#6B6B6B] hover:text-[#FF5F40] transition-colors">
            Menu
          </Link>
          {session?.user && (
            <Link href="/orders" className="text-sm font-medium text-[#6B6B6B] hover:text-[#FF5F40] transition-colors">
              Orders
            </Link>
          )}
          {(role === "staff" || role === "admin") && (
            <Link href="/kitchen" className="text-sm font-medium text-[#6B6B6B] hover:text-[#FF5F40] transition-colors">
              Kitchen
            </Link>
          )}
          {role === "admin" && (
            <Link href="/admin" className="text-sm font-medium text-[#6B6B6B] hover:text-[#FF5F40] transition-colors">
              Admin
            </Link>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          {session?.user ? (
            <>
              <span className="hidden text-sm font-medium text-[#6B6B6B] sm:inline">
                {session.user.name?.split(" ")[0]}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full border border-[#FF5F40] px-4 py-1.5 text-sm font-semibold text-[#FF5F40] transition hover:bg-[#FF5F40] hover:text-white"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="hidden rounded-full border border-[#FF5F40] px-4 py-1.5 text-sm font-semibold text-[#FF5F40] transition hover:bg-[#FF5F40]/10 sm:inline-block"
              >
                Contact Us
              </Link>
              <Link
                href="/signin"
                className="rounded-full bg-[#FF5F40] px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E04A2A]"
              >
                Order Now
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
