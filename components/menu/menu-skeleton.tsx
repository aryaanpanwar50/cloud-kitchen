export function MenuSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-3xl border border-orange-100 bg-white p-4 shadow-sm"
        >
          <div className="h-44 rounded-2xl bg-[#FF5F40]/20" />
          <div className="mt-4 h-5 w-2/3 rounded bg-[#FF5F40]/20" />
          <div className="mt-3 h-4 rounded bg-[#FF5F40]/10" />
          <div className="mt-2 h-4 w-5/6 rounded bg-[#FF5F40]/10" />
          <div className="mt-6 h-10 rounded-2xl bg-[#FF5F40]/20" />
        </div>
      ))}
    </div>
  );
}
