import { getRoleDefinition } from '../../constants/rbac';
import { ModuleRouteId } from '../../types/navigation';
import { PermissionDomain, UserRoleId } from '../../types/rbac';

const MODULE_PERMISSION_REQUIREMENTS: Partial<Record<ModuleRouteId, PermissionDomain>> = {
  'roles-permissions': 'system_security',
};

export function hasRolePermission(
  roleId: UserRoleId,
  domain: PermissionDomain,
  action: 'read' | 'create' | 'update' | 'approve' = 'read'
): boolean {
  const role = getRoleDefinition(roleId);
  const actions = role.permissions[domain];
  if (!actions) return false;
  return actions.includes(action);
}

export function canRoleViewModule(roleId: UserRoleId, moduleId: ModuleRouteId): boolean {
  if (moduleId === 'roles-permissions') {
    return hasRolePermission(roleId, 'system_security', 'read');
  }
  const requiredDomain = MODULE_PERMISSION_REQUIREMENTS[moduleId];
  if (!requiredDomain) return true;
  return hasRolePermission(roleId, requiredDomain, 'read');
}

export function canViewCohortBudget(roleId: UserRoleId): boolean {
  return (
    roleId === 'national_admin' ||
    roleId === 'program_director' ||
    roleId === 'program_officer' ||
    roleId === 'regional_coordinator' ||
    roleId === 'district_coordinator' ||
    roleId === 'finance_officer' ||
    roleId === 'me_officer' ||
    roleId === 'partner_donor'
  );
}

export function canManageAdmissions(roleId: UserRoleId): boolean {
  return (
    roleId === 'national_admin' ||
    roleId === 'program_director' ||
    roleId === 'program_officer'
  );
}
