import { UserEntity } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from '../enums/user-role.enum';
import BaseEntityDto from '../../common/dto/base-entity.dto';

export class UserDto extends BaseEntityDto {
  @ApiProperty({ example: '/static/avatar.png' })
  avatar: string;

  @ApiProperty({ example: 'oroz@gmail.com' })
  email: string;

  @ApiProperty({ example: '+996700700700' })
  phone: string;

  @ApiProperty({ example: 'Orozbek' })
  firstName: string;

  @ApiProperty({ example: 'Zhenishbek uulu' })
  lastName: string;

  @ApiProperty({ example: UserRoleEnum.CLIENT })
  role: UserRoleEnum;

  @ApiProperty({ example: true })
  isActive: boolean;

  static fromEntity(user: UserEntity, staticUrlPrefix = ''): UserDto {
    const dto = new UserDto();
    dto.id = user.id;
    dto.avatar = user.avatar
      ? UserDto.prepareUrl(user.avatar, staticUrlPrefix)
      : null;
    dto.email = user.email;
    dto.phone = user.phone;
    dto.firstName = user.firstName;
    dto.lastName = user.lastName;
    dto.role = user.role;
    dto.isActive = user.isActive;

    return dto;
  }

  static fromEntities(users: UserEntity[], staticUrlPrefix = ''): UserDto[] {
    return users.map((user) => UserDto.fromEntity(user, staticUrlPrefix));
  }
}
