import React from 'react';

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6 border border-dashed border-slate-300 dark:border-slate-800 rounded-lg bg-white dark:bg-[#0B111E]">
      <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 mb-3">{icon}</div>
      <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-200">{title}</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-md leading-relaxed">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2.5 animate-pulse" aria-busy="true" aria-label="Loading content">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 rounded bg-slate-200 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800" />
      ))}
    </div>
  );
}
