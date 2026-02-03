import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, PermissionRequirement } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<PermissionRequirement>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Super admin has all permissions
    if (user.role?.name === 'super_admin') {
      return true;
    }

    // Check if user has the required permission
    const hasPermission = user.role?.permissions?.some(permission => {
      let actionProperty = requiredPermission.action;
      if (!actionProperty.startsWith('can')) {
        actionProperty = `can${actionProperty.charAt(0).toUpperCase() + actionProperty.slice(1)}` as any;
      }
      // Special case for 'read' mapping to 'canGet' if needed, 
      // but let's stick to the mapping or explicit check
      if (actionProperty === 'canRead') actionProperty = 'canGet' as any;
      if (actionProperty === 'canDelete') actionProperty = 'canDelete' as any; // already starts with can

      return permission.module?.name === requiredPermission.module && permission[actionProperty];
    });

    if (!hasPermission) {
      throw new ForbiddenException(`Insufficient permissions for ${requiredPermission.module}.${requiredPermission.action}`);
    }

    return true;
  }
}