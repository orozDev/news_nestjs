import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import MongoIdDto from '../common/dto/mongo-id.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { UserDto } from './dto/user.dto';
import { ContextInterceptor } from '../common/interceptors/context.interceptor';
import { StripContextPipe } from '../common/pipes/strip-context.pipe';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from './enums/user-role.enum';
import { RoleAuthGuard } from '../auth/guards/role-auth.guard';
import UsesQueryDto from './dto/uses-query.dto';

@ApiTags('User')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ type: UserDto })
  // @ApiBearerAuth()
  // @Roles(UserRoleEnum.ADMIN)
  // @UseGuards(RoleAuthGuard)
  @Post()
  @FormDataRequest()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return UserDto.fromEntity(user);
  }

  @ApiResponse({ type: [UserDto] })
  @ApiBearerAuth()
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Get()
  async findAll(@Query() usesQueryDto: UsesQueryDto) {
    return await this.userService.findAll(usesQueryDto);
  }

  @ApiResponse({ type: UserDto })
  @ApiBearerAuth()
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @Get(':id')
  async findOne(@Param() { id }: MongoIdDto) {
    return await this.userService.findOne(id);
  }

  @ApiResponse({ type: UserDto })
  @ApiBearerAuth()
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @FormDataRequest()
  @UseInterceptors(ContextInterceptor)
  @Patch(':id')
  async update(
    @Param() { id }: MongoIdDto,
    @Body(StripContextPipe) updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.update(id, updateUserDto);
    return UserDto.fromEntity(user);
  }

  @ApiResponse({ type: UserDto, status: HttpStatus.NO_CONTENT })
  @ApiBearerAuth()
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(RoleAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param() { id }: MongoIdDto) {
    const user = await this.userService.remove(id);
    return UserDto.fromEntity(user);
  }
}
