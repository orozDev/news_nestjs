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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import MongoIdDto from '../common/dto/mongo-id.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { UserDto } from './dto/user.dto';
import { ContextInterceptor } from '../common/interceptors/context.interceptor';
import { StripContextPipe } from '../common/pipes/strip-context.pipe';

@ApiTags('User')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ type: UserDto })
  @Post()
  @FormDataRequest()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return UserDto.fromEntity(user);
  }

  @ApiResponse({ type: [UserDto] })
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return UserDto.fromEntities(users);
  }

  @Get(':id')
  async findOne(@Param() { id }: MongoIdDto) {
    const user = await this.userService.findOne(id);
    return UserDto.fromEntity(user);
  }

  @ApiResponse({ type: UserDto })
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param() { id }: MongoIdDto) {
    const user = await this.userService.remove(id);
    return UserDto.fromEntity(user);
  }
}
