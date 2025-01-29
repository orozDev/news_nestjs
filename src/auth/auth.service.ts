import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IUser } from './interfaces/user.interface';
import { ITokens } from './interfaces/tokens.interface';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { UserRoleEnum } from '../user/enums/user-role.enum';
import { ChangeProfileDto } from './dto/change-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserWithTokensDto } from './dto/user-with-tokens.dto';
import { ValidationException } from '../common/exceptions/validation.exception';
import UserRepository from '../user/repositories/user.repository';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private config: ConfigService,
    private userService: UserService,
  ) {}

  async validateUser(email, password): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ email });
    if (!user) return null;

    const passwordEquals = await user.checkPassword(password);
    if (!passwordEquals) return null;

    return user;
  }

  async checkUserActivityById(id: string): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    if (!user)
      throw new UnauthorizedException(
        'The user does not exist or incorrect token.',
      );
    return user.isActive;
  }

  async login(user: UserEntity): Promise<UserEntity & ITokens> {
    const userPayload = this.prepareUserPayload(user);
    const tokens = this.makeToken(userPayload);
    return Object.assign(user, tokens);
  }

  async loginAsAdmin(user: UserEntity): Promise<UserEntity & ITokens> {
    if (user.role !== UserRoleEnum.ADMIN) {
      throw new ForbiddenException('The user must be admin');
    }

    return await this.login(user);
  }

  makeToken(payload: IUser): ITokens {
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: this.config.get<string>('ACCESS_SECRET_EXPIRES'),
        secret: this.config.get<string>('ACCESS_SECRET_KEY'),
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.config.get<string>('REFRESH_SECRET_KEY_EXPIRES'),
        secret: this.config.get<string>('REFRESH_SECRET_KEY'),
      }),
    };
  }

  async register(registerDto: RegisterDto): Promise<UserWithTokensDto> {
    const user = await this.userService.create({
      ...registerDto,
      isActive: true,
      role: UserRoleEnum.CLIENT,
    });
    return this.login(user);
  }

  async changeProfile(
    user: UserEntity,
    changeProfileDto: ChangeProfileDto,
  ): Promise<UserEntity> {
    return await this.userService.update(user.id, changeProfileDto);
  }

  async changePassword(user: UserEntity, dto: ChangePasswordDto) {
    const passwordEquals = await user.checkPassword(dto.oldPassword);
    if (!passwordEquals) {
      throw new ValidationException({ message: 'Invalid password' });
    }

    await user.setPassword(dto.newPassword);
    await this.userRepository.save(user);

    return { message: 'The password changed' };
  }

  prepareUserPayload(user: UserEntity): IUser {
    return {
      sub: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      role: user.role,
    };
  }
}
