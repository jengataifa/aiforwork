import { CheckCircle2, Clock, AlertCircle, CircleDashed, PauseCircle } from 'lucide-react';

export type SemanticTone = 'success' | 'info' | 'warning' | 'danger' | 'neutral';

interface StatusIndicatorProps {
  label: string;
  tone?: SemanticTone;
}

const TONE_STYLES: Record<SemanticTone, { text: string; bg: string; border: string; Icon: typeof CheckCircle2 }> = {
  success: {
    text: 'text-emerald-700 dark:text-[#4ADE80]',
    bg: 'bg-emerald-50 dark:bg-[#4ADE80]/8',
    border: 'border-emerald-200 dark:border-[#4ADE80]/25',
    Icon: CheckCircle2,
  },
  info: {
    text: 'text-teal-700 dark:text-[#2DD4BF]',
    bg: 'bg-teal-50 dark:bg-[#2DD4BF]/8',
    border: 'border-teal-200 dark:border-[#2DD4BF]/25',
    Icon: Clock,
  },
  warning: {
    text: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-400/8',
    border: 'border-amber-200 dark:border-amber-400/25',
    Icon: AlertCircle,
  },
  danger: {
    text: 'text-rose-700 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-400/8',
    border: 'border-rose-200 dark:border-rose-400/25',
    Icon: PauseCircle,
  },
  neutral: {
    text: 'text-slate-700 dark:text-slate-300',
    bg: 'bg-slate-100 dark:bg-slate-800/60',
    border: 'border-slate-200 dark:border-slate-700/80',
    Icon: CircleDashed,
  },
};

export function StatusBadge({ label, tone = 'neutral' }: StatusIndicatorProps) {
  const style = TONE_STYLES[tone];
  const Icon = style.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border whitespace-nowrap shrink-0 ${style.bg} ${style.border} ${style.text}`}
    >
      <Icon className="w-3 h-3 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
