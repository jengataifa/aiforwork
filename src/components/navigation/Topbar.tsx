import { LogIn, Menu, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../app/providers/AuthProvider';
import { useNavigation } from '../../app/providers/NavigationProvider';
import { useTheme } from '../../app/providers/ThemeProvider';
import { getNavItemById, NAV_GROUPS } from '../../constants/navigation';
import { Breadcrumbs } from '../ui/PageHeader';
import { NotificationPanel } from './NotificationPanel';
import { ProfileMenu } from './ProfileMenu';

export function Topbar() {
  const { activeModule, navigate, setMobileMenuOpen } = useNavigation();
  const { isAuthenticated, signInWithGoogle } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const currentItem = getNavItemById(activeModule);
  const currentGroup = NAV_GROUPS.find((g) => g.id === currentItem.groupId);

  return (
    <header className="h-14 sm:h-16 px-2.5 sm:px-5 lg:px-6 border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#090F1C]/95 backdrop-blur-xs sticky top-0 z-30 flex items-center justify-between gap-2">
      {/* Left zone: Mobile drawer toggle + Full Mobile Brand OR Desktop Breadcrumbs */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-md text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile & Tablet Brand Title — prominent forest green */}
        <button
          type="button"
          onClick={() => navigate('dashboard')}
          className="lg:hidden font-display text-xl sm:text-2xl font-bold tracking-tight text-[#14532D] dark:text-white whitespace-nowrap cursor-pointer"
        >
          JENGA TAIFA
        </button>

        {/* Desktop Breadcrumbs */}
        <div className="hidden lg:block min-w-0 truncate">
          <Breadcrumbs
            items={[
              { label: 'JENGA TAIFA', moduleId: 'dashboard' },
              ...(currentGroup ? [{ label: currentGroup.label }] : []),
              { label: currentItem.label },
            ]}
            onNavigate={navigate}
          />
        </div>
      </div>

      {/* Right zone: Compact Theme Switch + Notification Icon + Icon Sign In / User Avatar */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={toggleTheme}
          className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white dark:bg-[#090F1C] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer shrink-0"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[#ffd700]" aria-hidden="true" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" aria-hidden="true" />
          )}
        </button>

        <NotificationPanel />

        {!isAuthenticated ? (
          <button
            type="button"
            onClick={() => void signInWithGoogle()}
            aria-label="Sign in with Google"
            title="Sign in"
            className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-emerald-600 dark:bg-[#4ADE80] hover:bg-emerald-700 dark:hover:bg-[#22C55E] text-white dark:text-[#070B14] transition-colors cursor-pointer shrink-0"
          >
            <LogIn className="w-4 h-4" />
          </button>
        ) : (
          <ProfileMenu />
        )}
      </div>
    </header>
  );
}
