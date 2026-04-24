"use client";

import type { ReactElement } from "react";
import { menuCategories } from "@/lib/constants";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, ReactElement> = {
  starters: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
    </svg>
  ),
  mains: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
    </svg>
  ),
  drinks: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
    </svg>
  ),
  desserts: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.5 1.5 0 013 15.546V8.5A2.5 2.5 0 015.5 6h13A2.5 2.5 0 0121 8.5v7.046zM3 19.5h18"/>
    </svg>
  ),
};

export function CategorySidebar({
  activeCategory,
  onChange,
  counts,
}: {
  activeCategory: string;
  onChange: (c: string) => void;
  counts: Record<string, number>;
}) {
  return (
    <aside className="w-full rounded-2xl border border-[#E8E8E4] bg-white p-3 lg:w-52 lg:shrink-0">
      <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-widest text-[#6B6B6B]">Categories</p>
      <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {menuCategories.map((cat) => {
          const active = cat === activeCategory;
          return (
            <li key={cat}>
              <button
                onClick={() => onChange(cat)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium capitalize transition",
                  active
                    ? "bg-[#FF5F40] text-white shadow-sm"
                    : "text-[#1A1A1A] hover:bg-[#FFF4E6] hover:text-[#FF5F40]",
                )}
              >
                <span className={active ? "text-white" : "text-[#FF5F40]"}>
                  {categoryIcons[cat] ?? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="9"/>
                    </svg>
                  )}
                </span>
                <span className="flex-1 whitespace-nowrap text-left">{cat}</span>
                {counts[cat] !== undefined && (
                  <span className={cn(
                    "ml-auto rounded-full px-1.5 py-0.5 text-xs",
                    active ? "bg-white/25 text-white" : "bg-[#FFF4E6] text-[#FF5F40]"
                  )}>
                    {counts[cat]}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
