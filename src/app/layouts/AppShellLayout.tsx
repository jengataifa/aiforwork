import { AlertCircle, BookOpen, Building2, Compass, Landmark, LayoutDashboard, X } from 'lucide-react';
import React from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { useNavigation } from '../../app/providers/NavigationProvider';
import { ApplicationSidebar } from '../../components/navigation/ApplicationSidebar';
import { Topbar } from '../../components/navigation/Topbar';
import { ModuleRouteId } from '../../types/navigation';

const MOBILE_TABS: { id: ModuleRouteId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'about-us', label: 'About Us', icon: Compass },
  { id: 'course', label: 'Course', icon: BookOpen },
  { id: 'sacco-network', label: 'SACCOs', icon: Building2 },
  { id: 'investor-portal', label: 'Investor', icon: Landmark },
];

export function AppShellLayout({ children }: { children: React.ReactNode }) {
  const { activeModule, navigate } = useNavigation();
  const { authError, clearAuthError } = useAuth();

  return (
    <div className="min-h-screen bg-[#F4F6F9] dark:bg-[#070B14] text-slate-900 dark:text-slate-100 flex">
      <ApplicationSidebar />

      <div className="flex-1 min-w-0 flex flex-col pb-20 lg:pb-6">
        <Topbar />

        {authError && (
          <div className="px-4 sm:px-6 lg:px-8 pt-4 max-w-[1440px] w-full mx-auto">
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-950 dark:text-amber-200 text-sm flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
              <button
                type="button"
                onClick={clearAuthError}
                aria-label="Dismiss alert"
                className="p-1 rounded hover:bg-amber-200/50 dark:hover:bg-amber-900/50 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile-first bottom thumb navigation */}
      <nav
        aria-label="Mobile quick navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 h-16 bg-white/95 dark:bg-[#090F1C]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-5"
      >
        {MOBILE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeModule === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => navigate(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'text-emerald-700 dark:text-[#4ADE80]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-full px-1">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
