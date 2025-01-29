import { PassportStrategy } from '@nestjs/passport';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserEntity } from '../../user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  MESSAGE = {
    message: 'The user does not exist or password is incorrect.',
  };

  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  authenticate(req, options?: any): void {
    const email = req.body['email'];
    const password = req.body['password'];

    if (!email || !password) {
      throw new UnauthorizedException(this.MESSAGE);
    }

    super.authenticate(req, options);
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException(this.MESSAGE);
    }

    if (!user.isActive) {
      throw new ForbiddenException('The user is not active');
    }

    return user;
  }
}
