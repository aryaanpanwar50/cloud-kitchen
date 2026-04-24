import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-[#FF5F40]/100 text-white hover:bg-orange-600",
        variant === "secondary" && "border border-orange-200 bg-white text-slate-800 hover:bg-[#FF5F40]/10",
        variant === "ghost" && "text-slate-700 hover:bg-[#FF5F40]/20",
        variant === "danger" && "bg-rose-500 text-white hover:bg-rose-600",
        className,
      )}
      {...props}
    />
  );
}
