import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';
import { EmptyState } from '../feedback/EmptyState';

export interface DataColumn<T> {
  key: string;
  header: string;
  align?: 'left' | 'right';
  render: (row: T) => React.ReactNode;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: DataColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  emptyTitle = 'No matching records',
  emptyDescription = 'Adjust your active search or region filter to view entries.',
  emptyIcon,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon ?? <span className="text-xs font-mono">0</span>}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="w-full overflow-x-auto border border-slate-200 dark:border-slate-800/90 rounded-lg bg-white dark:bg-[#0D1424]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090F1C]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-2.5 px-3.5 text-[11px] font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap ${
                  col.align === 'right' ? 'text-right' : 'text-left'
                } ${col.hideOnMobile ? 'hidden md:table-cell' : ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70">
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`transition-colors duration-150 ${
                onRowClick
                  ? 'hover:bg-slate-50 dark:hover:bg-[#131C31] cursor-pointer'
                  : 'hover:bg-slate-50/60 dark:hover:bg-[#101829]'
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-3 px-3.5 text-xs text-slate-800 dark:text-slate-200 align-middle ${
                    col.align === 'right' ? 'text-right tabular-nums' : 'text-left'
                  } ${col.hideOnMobile ? 'hidden md:table-cell' : ''}`}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  totalItems,
}: {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
  totalItems: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4 pt-3 text-xs text-slate-600 dark:text-slate-400">
      <span className="tabular-nums">
        Page {page} of {Math.max(1, totalPages)} · {totalItems} records
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1424] text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1424] text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
