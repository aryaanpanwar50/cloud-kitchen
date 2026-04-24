"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

export function HeroSplit() {
  const { data: session } = useSession();

  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-[#F9F9F7]">
      {/* Watermark food pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="food-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="12" fill="#FF5F40"/>
              <circle cx="80" cy="60" r="8" fill="#FF5F40"/>
              <circle cx="50" cy="100" r="10" fill="#FF5F40"/>
              <circle cx="100" cy="15" r="6" fill="#FF5F40"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#food-pattern)"/>
        </svg>
      </div>

      <div className="relative flex min-h-[92vh] flex-col lg:flex-row">
        {/* Left panel */}
        <div className="flex flex-1 flex-col justify-center px-8 py-16 lg:px-16 xl:px-24">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#FF5F40]">
            Mumbai Cloud Kitchen
          </p>
          <h1 className="max-w-lg text-5xl font-bold leading-tight text-[#1A1A1A] xl:text-6xl">
            Freshly Cooked Meals,{" "}
            <span className="text-[#FF5F40]">Delivered to Your Doorstep</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-[#6B6B6B]">
            Delicious, hygiene-prepared food, fresh in our cloud kitchen and delivered fast to your home or office.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={session?.user ? "/#menu" : "/signin"}
              className="flex items-center gap-2 rounded-full bg-[#FF5F40] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#E04A2A]"
            >
              Order Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link
              href="/#menu"
              className="rounded-full border border-[#E8E8E4] bg-white px-6 py-3 text-sm font-semibold text-[#1A1A1A] transition hover:border-[#FF5F40] hover:text-[#FF5F40]"
            >
              View Menu
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["#FF5F40","#FFB347","#FFA500"].map((c, i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-white" style={{background: c}}/>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#1A1A1A]">2,400+ Reviews</p>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="h-3 w-3 fill-[#FF5F40]" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white border border-[#E8E8E4] px-4 py-2 shadow-sm">
              <svg className="h-4 w-4 text-[#FF5F40]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span className="text-xs font-semibold text-[#1A1A1A]">Fast Delivery</span>
            </div>
          </div>
        </div>

        {/* Right panel — orange background with food image */}
        <div className="relative hidden lg:flex lg:w-[42%] xl:w-[38%]">
          <div className="absolute inset-0 rounded-bl-[4rem] bg-[#FF5F40]" />
          <div className="relative flex w-full items-center justify-center p-12">
            <div className="relative h-[480px] w-full max-w-md">
              <Image
                src="/hero-food.png"
                alt="Freshly cooked Indian food"
                fill
                className="object-contain drop-shadow-2xl"
                priority
                onError={() => {}}
              />
              {/* Fallback decorative rings when no image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-72 w-72 rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile orange strip */}
        <div className="h-3 w-full bg-[#FF5F40] lg:hidden" />
      </div>
    </section>
  );
}
