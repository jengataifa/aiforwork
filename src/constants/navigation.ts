import { NavGroupConfig, NavItemConfig } from '../types/navigation';

export const NAV_GROUPS: NavGroupConfig[] = [
  { id: 'ai_program', label: 'AI FOR WORK & BUSINESS', defaultExpanded: true },
  { id: 'community', label: 'COMMUNITY', defaultExpanded: true },
  { id: 'finance', label: 'FINANCE', defaultExpanded: true },
];

export const NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'dashboard',
    label: 'Overview',
    groupId: 'ai_program',
    iconName: 'LayoutDashboard',
    phaseStatus: 'active-foundation',
    summary: 'Program overview, implementation cycle, and impact metrics for AI for Work & Business.',
    plannedCollections: ['users', 'applications', 'programSettings'],
    connectedModules: ['course', 'applications', 'investor-portal'],
  },
  {
    id: 'course',
    label: 'Practical AI Course',
    groupId: 'ai_program',
    iconName: 'BookOpen',
    phaseStatus: 'active-foundation',
    summary: 'Day 1 to Day 10 practical AI training, income service templates, final exam, and A4 PDF certification.',
    plannedCollections: ['users'],
    connectedModules: ['dashboard', 'applications'],
  },
  {
    id: 'applications',
    label: 'Cohort Admissions',
    groupId: 'ai_program',
    iconName: 'ClipboardCheck',
    phaseStatus: 'active-foundation',
    summary: 'Open, upcoming, and past training cohorts, eligibility criteria, and admissions workflow.',
    plannedCollections: ['applications', 'programSettings'],
    connectedModules: ['dashboard', 'course'],
    lifecycleStages: ['Submitted', 'Under Review', 'Approved', 'Assigned to Cohort', 'Active', 'Completed'],
  },
  {
    id: 'about-us',
    label: 'About Us',
    groupId: 'community',
    iconName: 'Compass',
    phaseStatus: 'active-foundation',
    summary: 'Organization profile of JENGA TAIFA COMMUNITY BASED ORGANIZATION UGANDA LIMITED.',
    plannedCollections: ['users'],
    connectedModules: ['membership', 'sacco-network'],
  },
  {
    id: 'membership',
    label: 'Membership',
    groupId: 'community',
    iconName: 'Users',
    phaseStatus: 'active-foundation',
    summary: 'Community membership categories, development clusters, and cooperative participation.',
    plannedCollections: ['users'],
    connectedModules: ['about-us', 'sacco-network'],
  },
  {
    id: 'sacco-network',
    label: 'SACCOs',
    groupId: 'community',
    iconName: 'Building2',
    phaseStatus: 'active-foundation',
    summary: 'Registered JENGA TAIFA SACCOs directory and customisable MOU template generator.',
    plannedCollections: ['saccos'],
    connectedModules: ['investor-portal', 'membership'],
  },
  {
    id: 'investor-portal',
    label: 'Investor & ROI',
    groupId: 'finance',
    iconName: 'Landmark',
    phaseStatus: 'active-foundation',
    summary: '11% annual investor accrual engine, returns projection calculator, and partner checkout.',
    plannedCollections: ['investments'],
    connectedModules: ['donations', 'reports'],
  },
  {
    id: 'donations',
    label: 'Donations',
    groupId: 'finance',
    iconName: 'Wallet',
    phaseStatus: 'active-foundation',
    summary: 'Support youth digital skilling and community enterprises via Equity Bank Uganda or Mobile Money.',
    plannedCollections: ['donations'],
    connectedModules: ['investor-portal', 'reports'],
  },
  {
    id: 'reports',
    label: 'Reports',
    groupId: 'finance',
    iconName: 'BarChart3',
    phaseStatus: 'active-foundation',
    summary: 'Comprehensive activity, admissions, financial accountability, and program progress reports.',
    plannedCollections: ['applications', 'investments', 'donations'],
    connectedModules: ['investor-portal', 'dashboard'],
  },
];

export const HIDDEN_SETTINGS_ROUTES: Record<string, { label: string; groupLabel: string }> = {
  settings: { label: 'Profile & Settings', groupLabel: 'Account' },
  'roles-permissions': { label: 'Roles & Governance', groupLabel: 'Account' },
};

export function getNavItemById(id: string): NavItemConfig {
  const found = NAV_ITEMS.find((item) => item.id === id);
  if (found) return found;
  const hidden = HIDDEN_SETTINGS_ROUTES[id];
  if (hidden) {
    return {
      id: id as NavItemConfig['id'],
      label: hidden.label,
      groupId: 'ai_program',
      iconName: 'Settings',
      phaseStatus: 'active-foundation',
      summary: hidden.label,
      plannedCollections: ['users'],
      connectedModules: ['dashboard'],
    };
  }
  return NAV_ITEMS[0];
}
