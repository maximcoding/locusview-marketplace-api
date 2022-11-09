import {CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException} from '@nestjs/common';
import {UserStatusEnum} from '../../../enums/user-status.enum';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    try {
      const userStatus = request.session?.passport?.user.status;
      if (userStatus === UserStatusEnum.active) {
        return request.isAuthenticated();
      } else if ([UserStatusEnum.disabled, UserStatusEnum.deleted, UserStatusEnum.banned].includes(userStatus)) {
        throw new ForbiddenException('SessionAuthGuard', userStatus);
      } else {
        throw new UnauthorizedException();
      }
    } catch (e) {
      throw e;
    }
  }
}
