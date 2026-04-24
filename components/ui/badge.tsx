import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("status-pill inline-flex items-center", className)}>{children}</span>
  );
}
