import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { HIDDEN_SETTINGS_ROUTES, NAV_ITEMS } from '../../constants/navigation';
import { ModuleRouteId } from '../../types/navigation';

interface NavigationContextValue {
  activeModule: ModuleRouteId;
  navigate: (moduleId: ModuleRouteId) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  globalSearch: string;
  setGlobalSearch: (query: string) => void;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

function parseHashRoute(): ModuleRouteId {
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  const valid = NAV_ITEMS.some((item) => item.id === raw) || Boolean(HIDDEN_SETTINGS_ROUTES[raw]);
  return valid ? (raw as ModuleRouteId) : 'dashboard';
}

function scrollPageToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [activeModule, setActiveModule] = useState<ModuleRouteId>(() => parseHashRoute());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const navigate = useCallback((moduleId: ModuleRouteId) => {
    setActiveModule(moduleId);
    setMobileMenuOpen(false);
    scrollPageToTop();
    const nextHash = `#/${moduleId}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash);
    }
  }, []);

  useEffect(() => {
    scrollPageToTop();
  }, [activeModule]);

  useEffect(() => {
    const onHashChange = () => {
      setActiveModule(parseHashRoute());
      scrollPageToTop();
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const toggleSidebarCollapsed = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        activeModule,
        navigate,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,
        globalSearch,
        setGlobalSearch,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationContextValue {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return ctx;
}
