"use client";

import { useState } from "react";

const reviews = [
  {
    name: "Priya Sharma",
    role: "Regular Customer",
    quote: "The food was fresh, tasty, and delivered on time. Packaging was hygienic and perfect — highly recommended!",
    rating: 5,
    avatar: "PS",
    color: "#FF5F40",
  },
  {
    name: "Rohit Mehta",
    role: "Office Order",
    quote: "We order daily for our team lunch. Consistent quality, great flavors, and always on time. Best cloud kitchen in Mumbai!",
    rating: 5,
    avatar: "RM",
    color: "#FFB347",
  },
  {
    name: "Anjali Verma",
    role: "Home Delivery",
    quote: "Love the biryani and dal makhani — tastes just like home. The app makes ordering so easy!",
    rating: 4,
    avatar: "AV",
    color: "#FFA040",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <svg key={s} className={`h-4 w-4 ${s <= rating ? "fill-[#FF5F40]" : "fill-gray-200"}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

export function CustomerReviews() {
  const [current, setCurrent] = useState(0);
  const review = reviews[current];

  return (
    <section className="section-card mx-5 my-6 sm:mx-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF5F40]">Testimonials</span>
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Customer Reviews</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrent(c => (c - 1 + reviews.length) % reviews.length)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E8E4] text-[#6B6B6B] transition hover:border-[#FF5F40] hover:text-[#FF5F40]"
            aria-label="Previous review"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button
            onClick={() => setCurrent(c => (c + 1) % reviews.length)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF5F40] text-white transition hover:bg-[#E04A2A]"
            aria-label="Next review"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 rounded-2xl border border-[#E8E8E4] bg-[#F9F9F7] p-8 text-center sm:flex-row sm:text-left">
        <div className="shrink-0">
          <div className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white" style={{background: review.color}}>
            {review.avatar}
          </div>
        </div>
        <div className="flex-1">
          <p className="text-base italic leading-relaxed text-[#1A1A1A]">
            &ldquo;{review.quote}&rdquo;
          </p>
          <div className="mt-4 flex flex-col items-center gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-[#1A1A1A]">{review.name}</p>
              <p className="text-xs text-[#6B6B6B]">{review.role}</p>
            </div>
            <StarRating rating={review.rating}/>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="mt-4 flex justify-center gap-1.5">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-[#FF5F40]" : "w-2 bg-[#E8E8E4]"}`}
            aria-label={`Review ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
