"use client";

import { menuCategories } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function CategoryFilter({
  activeCategory,
  onChange,
}: {
  activeCategory: string;
  onChange: (category: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {menuCategories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium capitalize transition",
            activeCategory === category
              ? "border-orange-500 bg-[#FF5F40]/100 text-white"
              : "border-orange-200 bg-white text-slate-700 hover:bg-[#FF5F40]/10",
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
