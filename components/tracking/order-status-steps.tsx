import { trackingStages } from "@/lib/constants";
import type { OrderStatus } from "@/lib/types";
import { cn, orderStageIndex } from "@/lib/utils";

const stageIcons = [
  // Order Placed
  <svg key="0" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>,
  // Confirmed
  <svg key="1" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>,
  // Preparing
  <svg key="2" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V10a2 2 0 012-2h8z"/></svg>,
  // Ready
  <svg key="3" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"/></svg>,
  // Out for Delivery
  <svg key="4" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
  // Delivered
  <svg key="5" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
];

export function OrderStatusSteps({ status }: { status: OrderStatus }) {
  const currentIndex = orderStageIndex(status);

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-start gap-0">
        {trackingStages.map((stage, index) => {
          const done = currentIndex > index;
          const active = currentIndex === index;

          return (
            <div key={stage.key} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                {/* Circle */}
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all",
                  done
                    ? "border-[#FF5F40] bg-[#FF5F40] text-white"
                    : active
                      ? "border-[#FF5F40] bg-white text-[#FF5F40] shadow-md shadow-orange-100"
                      : "border-[#E8E8E4] bg-white text-[#6B6B6B]"
                )}>
                  {done ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  ) : stageIcons[index]}
                </div>
                {/* Label */}
                <p className={cn(
                  "max-w-18 text-center text-xs font-medium",
                  done || active ? "text-[#FF5F40]" : "text-[#6B6B6B]"
                )}>
                  {stage.label}
                </p>
              </div>

              {/* Connector line */}
              {index < trackingStages.length - 1 && (
                <div className={cn(
                  "mb-7 h-0.5 w-10 transition-colors",
                  currentIndex > index ? "bg-[#FF5F40]" : "bg-[#E8E8E4]"
                )}/>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
