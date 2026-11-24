export function ProgressIndicator({
  value,
  max = 100,
  label,
  showFraction = false,
  tone = 'green',
}: {
  value: number;
  max?: number;
  label?: string;
  showFraction?: boolean;
  tone?: 'green' | 'teal' | 'amber';
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0;
  const barColor =
    tone === 'teal'
      ? 'bg-teal-600 dark:bg-[#2DD4BF]'
      : tone === 'amber'
        ? 'bg-amber-500 dark:bg-amber-400'
        : 'bg-gradient-to-r from-emerald-600 to-emerald-500 dark:from-[#22C55E] dark:to-[#4ADE80]';

  return (
    <div className="w-full">
      {(label || showFraction) && (
        <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
          {label && <span className="text-slate-700 dark:text-slate-300 truncate">{label}</span>}
          <span className="font-mono text-slate-600 dark:text-slate-400 tabular-nums shrink-0">
            {showFraction ? `${value}/${max} (${pct}%)` : `${pct}%`}
          </span>
        </div>
      )}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-sm overflow-hidden">
        <div className={`h-full ${barColor} transition-all duration-300`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
