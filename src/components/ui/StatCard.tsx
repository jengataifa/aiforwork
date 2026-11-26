import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  accent?: 'emerald' | 'teal' | 'amber';
  icon?: React.ReactNode;
  onClick?: () => void;
}

export function StatCard({
  label,
  value,
  subValue,
  accent = 'emerald',
  icon,
  onClick,
}: StatCardProps) {
  const accentText =
    accent === 'teal'
      ? 'text-teal-600 dark:text-[#2DD4BF]'
      : accent === 'amber'
        ? 'text-slate-950 dark:text-[#ffd700]'
        : 'text-emerald-600 dark:text-[#4ADE80]';

  const accentBg =
    accent === 'teal'
      ? 'bg-teal-50 dark:bg-[#0F242A] border-teal-200 dark:border-[#2DD4BF]/25'
      : accent === 'amber'
        ? 'bg-[#ffd700] dark:bg-[#ffd700]/15 border-[#ffd700] dark:border-[#ffd700]/40'
        : 'bg-emerald-50 dark:bg-[#102022] border-emerald-200 dark:border-[#4ADE80]/25';

  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`w-full text-left bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-5 transition-colors duration-150 ${
        onClick
          ? 'hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-[#111A2E] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/50 dark:focus-visible:ring-[#4ADE80]/60'
          : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">{label}</span>
        {icon && (
          <span className={`w-8 h-8 rounded-md border flex items-center justify-center shrink-0 ${accentBg} ${accentText}`}>
            {icon}
          </span>
        )}
      </div>

      <div className="font-display text-2xl sm:text-[26px] font-bold text-slate-900 dark:text-slate-50 tracking-tight tabular-nums leading-tight">
        {value}
      </div>

      {subValue && (
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
          {subValue}
        </p>
      )}
    </Wrapper>
  );
}
