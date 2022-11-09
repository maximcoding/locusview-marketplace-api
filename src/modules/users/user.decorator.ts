import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {Request} from 'express';
import {User} from './schemas/user.schema';

export const AuthUser = createParamDecorator((data: keyof User, ctx: ExecutionContext) => {
  const user = ctx.switchToHttp().getRequest<Request>().user as User;
  return data ? user && user[data] : user;
});
