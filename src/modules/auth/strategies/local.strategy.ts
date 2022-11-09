import {Strategy} from 'passport-local';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {ContextIdFactory, ModuleRef} from '@nestjs/core';
import {AuthService} from '../auth.service';

export const PHONE_LOCAL_STRATEGY_FIELD = 'mobilePhone';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private moduleRef: ModuleRef) {
    super({
      usernameField: PHONE_LOCAL_STRATEGY_FIELD,
      passReqToCallback: false,
    });
  }

  async validate(request: Request, mobilePhone: string): Promise<string> {
    const contextId = ContextIdFactory.getByRequest(request);
    const authService = await this.moduleRef.resolve(AuthService, contextId);
    return authService.loginWithPhone(mobilePhone);
  }
}
