import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../../app/providers/AuthProvider';
import { PageHeader, SectionHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ROLES_CATALOG } from '../../constants/rbac';
import { PermissionDomain } from '../../types/rbac';

const DOMAIN_COLUMNS: { key: PermissionDomain; label: string }[] = [
  { key: 'national_oversight', label: 'National' },
  { key: 'beneficiaries_pii', label: 'Participant PII' },
  { key: 'applications_selection', label: 'Intake' },
  { key: 'sacco_network', label: 'SACCOs' },
  { key: 'cohorts_training', label: 'Course' },
  { key: 'assessments_certification', label: 'Certs' },
  { key: 'enterprises_incubation', label: 'Enterprises' },
  { key: 'finance_disbursements', label: 'Finance' },
  { key: 'procurement_assets', label: 'Assets' },
  { key: 'reports_analytics', label: 'Reports' },
  { key: 'system_security', label: 'Security' },
];

export function RolesPermissionsPage() {
  const { role: activeRole, isAdminUser, switchRoleView } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        metaLine="Program Governance · Least-Privilege Access Architecture"
        title="Roles & Governance Matrix"
        subtitle="Defines verified operational scopes across JENGA TAIFA stakeholder roles, protecting participant privacy and SACCO financial accountability."
        actions={<StatusBadge label={`Your Active Role: ${activeRole.shortLabel}`} tone="info" />}
      />

      <section className="bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-slate-800/90 rounded-xl p-5">
        <SectionHeader
          title="13-Role Access Control Matrix"
          description={
            isAdminUser
              ? 'Administrators can click any role row to inspect the platform perspective for that stakeholder.'
              : 'Access scopes are enforced on the server for each authenticated account.'
          }
        />

        <div className="w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-md">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#090F1C] border-b border-slate-200 dark:border-slate-800">
                <th className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  Stakeholder Role
                </th>
                <th className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  Scope
                </th>
                {DOMAIN_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="py-2.5 px-2.5 font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap text-center"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70">
              {ROLES_CATALOG.map((r) => {
                const isSelected = r.id === activeRole.id;
                return (
                  <tr
                    key={r.id}
                    onClick={() => {
                      if (isAdminUser) switchRoleView(r.id);
                    }}
                    className={`${isAdminUser ? 'cursor-pointer' : ''} transition-colors ${
                      isSelected
                        ? 'bg-emerald-50/70 dark:bg-[#131F36]'
                        : 'hover:bg-slate-50 dark:hover:bg-[#101829]'
                    }`}
                  >
                    <td className="py-3 px-3 min-w-[200px]">
                      <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-slate-100">
                        {isSelected && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-[#4ADE80] shrink-0" />
                        )}
                        <span>{r.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {r.description}
                      </p>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-teal-700 dark:text-[#2DD4BF] whitespace-nowrap">
                      {r.scope}
                    </td>
                    {DOMAIN_COLUMNS.map((col) => {
                      const perms = r.permissions[col.key];
                      return (
                        <td key={col.key} className="py-3 px-2.5 text-center font-mono text-[10px]">
                          {perms && perms.length > 0 ? (
                            <span className="text-emerald-700 dark:text-[#4ADE80] font-medium">
                              {perms.map((p) => p[0].toUpperCase()).join('·')}
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-500 mt-3">
          Legend: <span className="font-mono text-emerald-700 dark:text-[#4ADE80]">R</span> Read ·{' '}
          <span className="font-mono text-emerald-700 dark:text-[#4ADE80]">C</span> Create ·{' '}
          <span className="font-mono text-emerald-700 dark:text-[#4ADE80]">U</span> Update ·{' '}
          <span className="font-mono text-emerald-700 dark:text-[#4ADE80]">A</span> Approve
        </p>
      </section>
    </div>
  );
}
