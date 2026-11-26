import { LogOut, Settings, Shield } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { useNavigation } from '../../app/providers/NavigationProvider';
import { ROLES_CATALOG } from '../../constants/rbac';
import { UserRoleId } from '../../types/rbac';

export function ProfileMenu() {
  const { user, profile, isAdminUser, role, switchRoleView, signOut } = useAuth();
  const { navigate } = useNavigation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const initial = (profile.displayName || user.displayName || 'U').trim()[0]?.toUpperCase() || 'U';
  const [imgError, setImgError] = useState(false);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Account menu for ${profile.displayName}`}
        title={user.email || profile.displayName}
        className="h-8 w-8 rounded-full overflow-hidden border border-emerald-500/60 dark:border-[#4ADE80]/50 bg-emerald-50 dark:bg-[#18233A] text-emerald-700 dark:text-[#4ADE80] flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shrink-0"
      >
        {user.photoURL && !imgError ? (
          <img
            src={user.photoURL}
            alt={profile.displayName}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xs font-mono font-bold">{initial}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-40 w-76 bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-2xl overflow-hidden">
          <div className="px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {profile.displayName}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 truncate">
              {role.shortLabel} · {profile.district}, Uganda
            </div>
            {user.email && (
              <div className="text-xs mt-1 font-medium text-emerald-700 dark:text-[#4ADE80] truncate">
                {user.email}
              </div>
            )}
          </div>

          {isAdminUser && (
            <div className="p-3.5 border-b border-slate-200 dark:border-slate-800">
              <label
                htmlFor="role-view-select"
                className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5"
              >
                Manage &amp; View as Stakeholder Role
              </label>
              <select
                id="role-view-select"
                value={role.id}
                onChange={(e) => switchRoleView(e.target.value as UserRoleId)}
                className="w-full h-9 px-2.5 text-xs bg-slate-50 dark:bg-[#090F1C] border border-slate-300 dark:border-slate-800 rounded text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-600 dark:focus:border-[#4ADE80]/60"
              >
                {ROLES_CATALOG.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="p-2 space-y-1">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate('settings');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#131C31] rounded-md transition-colors cursor-pointer"
            >
              <span className="p-1 rounded bg-emerald-100 dark:bg-[#132920] text-emerald-700 dark:text-[#4ADE80] inline-flex items-center justify-center">
                <Settings className="w-3.5 h-3.5" />
              </span>
              <span>Profile &amp; Settings</span>
            </button>

            {isAdminUser && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate('roles-permissions');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#131C31] rounded-md transition-colors cursor-pointer"
              >
                <span className="p-1 rounded bg-[#ffd700] text-slate-950 inline-flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5" />
                </span>
                <span>Roles &amp; Governance</span>
              </button>
            )}

            <div className="pt-1 mt-1 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  void signOut();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
