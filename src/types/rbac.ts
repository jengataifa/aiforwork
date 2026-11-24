export type UserRoleId =
  | 'national_admin'
  | 'program_director'
  | 'program_officer'
  | 'regional_coordinator'
  | 'district_coordinator'
  | 'sacco_admin'
  | 'trainer'
  | 'finance_officer'
  | 'enterprise_officer'
  | 'me_officer'
  | 'beneficiary'
  | 'enterprise_manager'
  | 'partner_donor';

export type PermissionDomain =
  | 'national_oversight'
  | 'beneficiaries_pii'
  | 'applications_selection'
  | 'sacco_network'
  | 'cohorts_training'
  | 'assessments_certification'
  | 'enterprises_incubation'
  | 'finance_disbursements'
  | 'procurement_assets'
  | 'reports_analytics'
  | 'system_security';

export type AccessScope = 'national' | 'regional' | 'district' | 'sacco' | 'assigned' | 'self' | 'approved_reports';

export interface RoleDefinition {
  id: UserRoleId;
  name: string;
  shortLabel: string;
  description: string;
  scope: AccessScope;
  permissions: Partial<Record<PermissionDomain, ('read' | 'create' | 'update' | 'approve')[]>>;
}

export interface AuthSessionUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  roleId: UserRoleId;
  regionName?: string;
  saccoName?: string;
  isDemoPreview: boolean;
}
