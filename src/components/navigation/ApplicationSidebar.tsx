import { Mail, PanelLeftClose, PanelLeftOpen, Phone, X } from 'lucide-react';
import { useAuth } from '../../app/providers/AuthProvider';
import { useNavigation } from '../../app/providers/NavigationProvider';
import { NAV_GROUPS, NAV_ITEMS } from '../../constants/navigation';
import { ORGANIZATION_CONTACT } from '../../constants/program';
import { NavIcon } from '../ui/IconResolver';

export function ApplicationSidebar() {
  const {
    activeModule,
    navigate,
    sidebarCollapsed,
    toggleSidebarCollapsed,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useNavigation();
  const { canViewModule } = useAuth();

  const renderSidebarBody = (isMobileDrawer: boolean) => {
    const collapsed = isMobileDrawer ? false : sidebarCollapsed;

    return (
      <div className="flex flex-col h-full bg-white dark:bg-[#090F1C] border-r border-slate-200 dark:border-slate-800/80 select-none">
        {/* Brand lockup */}
        <div
          className={`h-16 flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 shrink-0 ${
            collapsed ? 'px-2.5' : 'px-4'
          }`}
        >
          <button
            type="button"
            onClick={() => navigate('dashboard')}
            className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer flex-1"
          >
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-emerald-600 to-teal-500 dark:from-[#22C55E] dark:to-[#2DD4BF] text-white dark:text-[#070B14] font-display font-bold text-xs flex items-center justify-center shrink-0">
              JT
            </div>
            {!collapsed && (
              <span className="font-display text-lg font-extrabold text-slate-900 dark:text-slate-50 tracking-tight truncate">
                JENGA TAIFA
              </span>
            )}
          </button>

          {isMobileDrawer ? (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleSidebarCollapsed}
              className="p-1.5 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer shrink-0"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5" aria-label="Primary program navigation">
          {NAV_GROUPS.map((group) => {
            const visibleItems = NAV_ITEMS.filter(
              (item) => item.groupId === group.id && canViewModule(item.id)
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.id} className="space-y-1.5">
                {!collapsed && (
                  <div className="px-2.5 py-1 text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400">
                    {group.label}
                  </div>
                )}

                <ul className="space-y-1">
                  {visibleItems.map((item) => {
                    const isActive = activeModule === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => navigate(item.id)}
                          title={collapsed ? item.label : undefined}
                          className={`w-full min-h-[42px] flex items-center ${
                            collapsed ? 'justify-center px-2' : 'gap-3 px-3'
                          } py-2 rounded-lg text-sm transition-colors duration-150 cursor-pointer ${
                            isActive
                              ? 'bg-emerald-50 dark:bg-[#131F36] text-emerald-700 dark:text-[#4ADE80] font-semibold border border-emerald-200 dark:border-[#4ADE80]/25'
                              : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111A2E] border border-transparent'
                          }`}
                        >
                          <NavIcon
                            name={item.iconName}
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-emerald-700 dark:text-[#4ADE80]' : 'text-slate-500 dark:text-slate-400'
                            }`}
                          />
                          {!collapsed && <span className="truncate">{item.label}</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* Bottom Get In Touch Card (Phone & Email only) */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 shrink-0">
          {!collapsed ? (
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
              <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">Get in touch</div>
              <a
                href={`tel:${ORGANIZATION_CONTACT.phone}`}
                className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-[#4ADE80] transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-600 dark:text-[#4ADE80] shrink-0" />
                <span className="truncate">{ORGANIZATION_CONTACT.phoneDisplay}</span>
              </a>
              <a
                href={`mailto:${ORGANIZATION_CONTACT.email}`}
                className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-[#4ADE80] transition-colors"
              >
                <Mail className="w-4 h-4 text-teal-600 dark:text-[#2DD4BF] shrink-0" />
                <span className="truncate">{ORGANIZATION_CONTACT.email}</span>
              </a>
            </div>
          ) : (
            <a
              href={`tel:${ORGANIZATION_CONTACT.phone}`}
              title={`Get in touch: ${ORGANIZATION_CONTACT.phoneDisplay}`}
              className="w-full h-10 flex items-center justify-center rounded-md bg-slate-50 dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-[#4ADE80]"
            >
              <Phone className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <aside
        className={`hidden lg:block shrink-0 transition-[width] duration-200 ease-out h-screen sticky top-0 ${
          sidebarCollapsed ? 'w-[86px]' : 'w-[268px]'
        }`}
      >
        {renderSidebarBody(false)}
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/55 dark:bg-black/70 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-76 max-w-[85vw] h-full z-10">{renderSidebarBody(true)}</div>
        </div>
      )}
    </>
  );
}
