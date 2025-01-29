import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RetrieveUser } from './decorators/retrieve-user.decorator';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';
import { IUser } from './interfaces/user.interface';
import { ChangeProfileDto } from './dto/change-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserWithTokensDto } from './dto/user-with-tokens.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { UserEntity } from '../user/entities/user.entity';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: HttpStatus.OK, type: UserWithTokensDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() loginDto: LoginDto, @RetrieveUser() user: UserEntity) {
    return await this.authService.login(user);
  }

  @ApiResponse({ status: HttpStatus.OK, type: UserWithTokensDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('/login-as-admin')
  async loginAsAdmin(
    @Body() loginDto: LoginDto,
    @RetrieveUser() user: UserEntity,
  ) {
    return await this.authService.loginAsAdmin(user);
  }

  @ApiResponse({ status: HttpStatus.CREATED, type: UserWithTokensDto })
  @HttpCode(HttpStatus.CREATED)
  @FormDataRequest()
  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @ApiResponse({ status: HttpStatus.CREATED, type: RefreshTokenResponseDto })
  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh-token')
  refresh_token(@RetrieveUser() user: IUser) {
    return this.authService.makeToken(user);
  }

  @ApiResponse({ status: HttpStatus.OK, type: UserEntity })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  profile(@RetrieveUser() user: UserEntity) {
    return user;
  }

  @ApiResponse({ status: HttpStatus.OK, type: UserEntity })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('/profile')
  async changeProfile(
    @RetrieveUser() user: UserEntity,
    @Body() changeProfileDto: ChangeProfileDto,
  ) {
    return await this.authService.changeProfile(user, changeProfileDto);
  }

  @ApiResponse({ status: HttpStatus.OK })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/change-password')
  async changePassword(
    @RetrieveUser() user: UserEntity,
    @Body() dto: ChangePasswordDto,
  ) {
    return await this.authService.changePassword(user, dto);
  }
}
