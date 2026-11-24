import React from 'react';

export function ChartCard({
  title,
  subtitle,
  rightAction,
  children,
  footerNote,
}: {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  children: React.ReactNode;
  footerNote?: string;
}) {
  return (
    <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-lg p-5 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
        <div>
          <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          {subtitle && <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {rightAction && <div className="shrink-0">{rightAction}</div>}
      </div>
      <div className="flex-1 min-h-[220px]">{children}</div>
      {footerNote && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-500">
          {footerNote}
        </div>
      )}
    </section>
  );
}
