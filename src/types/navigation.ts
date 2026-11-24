export type NavGroupId = 'ai_program' | 'community' | 'finance';

export type ModuleRouteId =
  | 'dashboard'
  | 'course'
  | 'applications'
  | 'about-us'
  | 'membership'
  | 'sacco-network'
  | 'investor-portal'
  | 'donations'
  | 'reports'
  | 'settings'
  | 'roles-permissions';

export interface NavItemConfig {
  id: ModuleRouteId;
  label: string;
  groupId: NavGroupId;
  iconName: string;
  phaseStatus: 'active-foundation' | 'architecture-ready';
  summary: string;
  plannedCollections: string[];
  connectedModules: ModuleRouteId[];
  lifecycleStages?: string[];
}

export interface NavGroupConfig {
  id: NavGroupId;
  label: string;
  defaultExpanded: boolean;
}
