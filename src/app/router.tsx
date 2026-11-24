import { ShieldAlert } from 'lucide-react';
import { useAuth } from './providers/AuthProvider';
import { useNavigation } from './providers/NavigationProvider';
import { EmptyState } from '../components/feedback/EmptyState';
import { AboutUsPage } from '../modules/about/AboutUsPage';
import { ApplicationsPage } from '../modules/applications/ApplicationsPage';
import { CoursePage } from '../modules/course/CoursePage';
import { NationalDashboardPage } from '../modules/dashboard/NationalDashboardPage';
import { DonationsPage } from '../modules/donations/DonationsPage';
import { InvestorPortalPage } from '../modules/investor/InvestorPortalPage';
import { MembershipPage } from '../modules/membership/MembershipPage';
import { ReportsPage } from '../modules/reports/ReportsPage';
import { SaccoNetworkPage } from '../modules/saccos/SaccoNetworkPage';
import { RolesPermissionsPage } from '../modules/settings/RolesPermissionsPage';
import { SettingsPage } from '../modules/settings/SettingsPage';

export function AppRouter() {
  const { activeModule, navigate } = useNavigation();
  const { canViewModule, role } = useAuth();

  if (!canViewModule(activeModule)) {
    return (
      <EmptyState
        icon={<ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
        title="Access Restricted for Current Role"
        description={`The "${role.name}" role does not have read permission for this module.`}
        action={
          <button
            type="button"
            onClick={() => navigate('dashboard')}
            className="px-4 py-2 text-sm font-semibold rounded bg-emerald-600 dark:bg-[#4ADE80] text-white dark:text-[#070B14] hover:bg-emerald-700 dark:hover:bg-[#22C55E] transition-colors cursor-pointer"
          >
            Return to Overview
          </button>
        }
      />
    );
  }

  switch (activeModule) {
    case 'dashboard':
      return <NationalDashboardPage />;
    case 'course':
      return <CoursePage />;
    case 'applications':
      return <ApplicationsPage />;
    case 'about-us':
      return <AboutUsPage />;
    case 'membership':
      return <MembershipPage />;
    case 'sacco-network':
      return <SaccoNetworkPage />;
    case 'investor-portal':
      return <InvestorPortalPage />;
    case 'donations':
      return <DonationsPage />;
    case 'reports':
      return <ReportsPage />;
    case 'roles-permissions':
      return <RolesPermissionsPage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return <NationalDashboardPage />;
  }
}
