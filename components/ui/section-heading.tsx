export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FF5F40] 500">{eyebrow}</p>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
      <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
    </div>
  );
}
