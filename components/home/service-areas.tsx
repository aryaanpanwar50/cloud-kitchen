"use client";

import { useState } from "react";

export function ServiceAreas() {
  const [area, setArea] = useState("");

  return (
    <section className="section-card mx-5 my-6 sm:mx-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        {/* Left */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF5F40]">Delivery</span>
          <h2 className="mt-1 text-2xl font-bold text-[#1A1A1A]">Our Service Areas</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#6B6B6B]">
            We deliver freshly prepared, hygienic food to selected locations so you can enjoy hot meals right at your doorstep. Check if we deliver to your area below.
          </p>

          <div className="mt-5 flex gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-[#E8E8E4] bg-[#F9F9F7] px-4 py-2.5">
              <svg className="h-4 w-4 shrink-0 text-[#FF5F40]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <input
                value={area}
                onChange={e => setArea(e.target.value)}
                placeholder="Enter your area"
                className="flex-1 bg-transparent text-sm text-[#1A1A1A] outline-none placeholder:text-[#6B6B6B]"
              />
            </div>
            <button className="rounded-xl bg-[#FF5F40] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#E04A2A]">
              Check Now
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"/>
            <span className="text-xs text-[#6B6B6B]">Average delivery time 25 – 40 mins</span>
          </div>
        </div>

        {/* Right — map placeholder */}
        <div className="relative h-52 overflow-hidden rounded-2xl border border-[#E8E8E4] bg-[#FFF4E6] lg:h-64">
          <div className="flex h-full items-center justify-center flex-col gap-3 text-[#6B6B6B]">
            <svg className="h-12 w-12 text-[#FF5F40]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
            </svg>
            <span className="text-sm font-medium">Mumbai Delivery Zone</span>
            <span className="text-xs">Map integration coming soon</span>
          </div>
        </div>
      </div>
    </section>
  );
}
