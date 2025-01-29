import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private config: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('REFRESH_SECRET_KEY'),
    });
  }

  async validate(payload: any): Promise<IUser> {
    const isActive = await this.authService.checkUserActivityById(payload.sub);

    if (!isActive) {
      throw new ForbiddenException('The user is not active');
    }

    delete payload.iat;
    delete payload.exp;

    return payload;
  }
}
