import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileManagerService } from '../file-manager/file-manager.service';
import { ChangeProfileDto } from '../auth/dto/change-profile.dto';
import UserRepository from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private fileManagerService: FileManagerService,
    private userRepository: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { avatar, ...rest } = createUserDto;
    const temp = {};

    if (avatar) {
      temp['avatar'] = await this.fileManagerService.createFile(
        'user-avatars/',
        avatar,
      );
    }

    return await this.userRepository.create({ ...rest, ...temp });
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.findAll();
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User was not found');
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto | ChangeProfileDto,
  ): Promise<UserEntity> {
    const user = await this.findOne(id);
    const { avatar, ...rest } = updateUserDto;
    const temp = {};

    if (avatar) {
      await this.fileManagerService.removeFile(user.avatar, false);
      temp['avatar'] = await this.fileManagerService.createUserAvatar(
        'user-avatars/',
        avatar,
      );
    }

    return await this.userRepository.update(id, { ...rest, ...temp });
  }

  async remove(id: string): Promise<UserEntity> {
    await this.findOne(id);
    return await this.userRepository.delete(id);
  }
}
