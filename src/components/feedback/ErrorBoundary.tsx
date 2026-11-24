import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'An unexpected application error occurred.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Application ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#070B14] text-slate-900 dark:text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-4">
            <h1 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
              Unable to complete operation
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed break-words">
              {this.state.message}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-xs font-semibold rounded bg-emerald-600 dark:bg-[#4ADE80] text-white dark:text-[#070B14] hover:bg-emerald-700 dark:hover:bg-[#22C55E] transition-colors cursor-pointer"
            >
              Reload Platform
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
