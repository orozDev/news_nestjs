import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { UserEntity } from '../../user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    private authService: AuthService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('ACCESS_SECRET_KEY'),
    });
  }

  async validate(payload: any): Promise<UserEntity> {
    const isActive = await this.authService.checkUserActivityById(payload.sub);

    if (!isActive) {
      throw new ForbiddenException('The user is not active');
    }

    return await this.userService.findOne(payload.sub);
  }
}
