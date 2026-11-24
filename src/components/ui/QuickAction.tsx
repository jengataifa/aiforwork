import { ArrowUpRight } from 'lucide-react';
import React from 'react';

interface QuickActionProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick: () => void;
  stageNote?: string;
}

export function QuickAction({ title, subtitle, icon, onClick, stageNote }: QuickActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left flex items-start justify-between gap-3 p-3.5 rounded-lg bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 hover:border-emerald-400 dark:hover:border-[#4ADE80]/40 hover:bg-slate-50/80 dark:hover:bg-[#111A2E] transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/50 dark:focus-visible:ring-[#4ADE80]/60"
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="p-2 rounded-md bg-emerald-50 dark:bg-slate-800/80 text-emerald-700 dark:text-[#4ADE80] shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-[#4ADE80]/15 transition-colors">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-slate-950 dark:group-hover:text-white truncate">
            {title}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">{subtitle}</div>
          {stageNote && <div className="text-[11px] text-slate-500 mt-1">{stageNote}</div>}
        </div>
      </div>
      <ArrowUpRight
        className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-emerald-700 dark:group-hover:text-[#4ADE80] shrink-0 mt-0.5 transition-colors"
        aria-hidden="true"
      />
    </button>
  );
}
