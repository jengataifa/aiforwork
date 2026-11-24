import { ChevronRight } from 'lucide-react';
import React from 'react';
import { ModuleRouteId } from '../../types/navigation';

export interface BreadcrumbItem {
  label: string;
  moduleId?: ModuleRouteId;
}

export function Breadcrumbs({
  items,
  onNavigate,
}: {
  items: BreadcrumbItem[];
  onNavigate?: (moduleId: ModuleRouteId) => void;
}) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${idx}`}>
            {idx > 0 && (
              <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600 shrink-0" aria-hidden="true" />
            )}
            {item.moduleId && !isLast && onNavigate ? (
              <button
                type="button"
                onClick={() => onNavigate(item.moduleId!)}
                className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {item.label}
              </button>
            ) : (
              <span className={isLast ? 'text-slate-900 dark:text-slate-200 font-semibold truncate' : 'truncate'}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle: string;
  metaLine?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, metaLine, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800/80">
      <div className="min-w-0">
        {metaLine && <p className="text-sm font-semibold text-emerald-700 dark:text-[#4ADE80] mb-1.5">{metaLine}</p>}
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight [text-wrap:balance]">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}

export function SectionHeader({
  title,
  description,
  rightSlot,
}: {
  title: string;
  description?: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
      <div>
        <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
          {title}
        </h2>
        {description && <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{description}</p>}
      </div>
      {rightSlot && <div className="flex items-center gap-2 shrink-0">{rightSlot}</div>}
    </div>
  );
}
