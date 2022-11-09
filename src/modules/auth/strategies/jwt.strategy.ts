import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {AuthService} from '../auth.service';
import {ConfigService} from '@nestjs/config';
import {jwtConstants} from '../constants';
import {JwtPayload} from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(readonly configService: ConfigService, private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret,
      ignoreExpiration: false,
      passReqToCallback: false, // true in case global auth is turn on
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const user = await this.authService.verifyPayload(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
