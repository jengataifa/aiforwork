import { Search, X } from 'lucide-react';
import React from 'react';

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search records...',
  className = '',
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 pl-8 pr-8 text-xs bg-white dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-600 dark:focus:border-[#4ADE80]/60 transition-colors"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2 p-0.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export interface FilterOption {
  value: string;
  label: string;
}

export function FilterBar({
  options,
  activeValue,
  onChange,
}: {
  options: FilterOption[];
  activeValue: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800/90 rounded-md">
      {options.map((opt) => {
        const isActive = opt.value === activeValue;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isActive
                ? 'bg-white dark:bg-[#18233A] text-emerald-700 dark:text-[#4ADE80] border border-slate-200 dark:border-slate-700/80 shadow-xs dark:shadow-none'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function FormField({
  label,
  id,
  required,
  hint,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-medium text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="text-rose-600 dark:text-rose-400 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
}

export function SelectField({
  id,
  value,
  onChange,
  options,
  className = '',
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  className?: string;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full h-9 px-3 text-xs bg-white dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-600 dark:focus:border-[#4ADE80]/60 transition-colors ${className}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function DateField({
  id,
  value,
  onChange,
  className = '',
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <input
      id={id}
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full h-9 px-3 text-xs bg-white dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 rounded-md text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:border-emerald-600 dark:focus:border-[#4ADE80]/60 transition-colors ${className}`}
    />
  );
}
