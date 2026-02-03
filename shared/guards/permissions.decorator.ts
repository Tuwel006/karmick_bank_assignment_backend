import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'canCreate' | 'canGet' | 'canUpdate' | 'canDelete' | 'canRead';

export interface PermissionRequirement {
  module: string;
  action: PermissionAction;
}

export const RequirePermissions = (module: string, action: PermissionAction) =>
  SetMetadata(PERMISSIONS_KEY, { module, action });