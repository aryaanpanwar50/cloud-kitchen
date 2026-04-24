export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="glass-card rounded-3xl border border-orange-100 px-6 py-12 text-center shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}
