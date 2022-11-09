import {Injectable, CanActivate, ExecutionContext, ForbiddenException} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {Request} from 'express';
import {UserRoleEnum} from '../../../enums/user-role.enum';
import {ROLES_KEY} from '../decorators/roles.decorator';
import {User} from '../../users/schemas/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const user = context.switchToHttp().getRequest<Request>().user as User;
    try {
      return requiredRoles.includes(user.role);
    } catch (e) {
      throw new ForbiddenException('RolesGuard', 'user not exist');
    }
  }
}
