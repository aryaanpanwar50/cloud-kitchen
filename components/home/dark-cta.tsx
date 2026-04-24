import Link from "next/link";

export function DarkCta() {
  return (
    <section className="dark-section relative mx-5 my-6 overflow-hidden rounded-3xl sm:mx-8">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#FF5F40]/10" aria-hidden/>
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-[#FF5F40]/10" aria-hidden/>

      <div className="relative px-8 py-14 text-center sm:py-16">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#FF5F40]">Ready to Eat?</p>
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Hungry? Let Us{" "}
          <span className="text-[#FF5F40]">Cook for You!</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/70">
          Fresh, hygienic, and delicious meals are just a click away. Order now and enjoy hot food delivered straight to your doorstep.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/landing"
            className="rounded-full bg-[#FF5F40] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#E04A2A]"
          >
            Order Now
          </Link>
          <Link
            href="/#menu"
            className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
          >
            View Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
