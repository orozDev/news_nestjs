import { ApiProperty } from '@nestjs/swagger';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { UserRoleEnum } from '../enums/user-role.enum';
import { Transform } from 'class-transformer';
import { IsUnique } from '../../common/validators/is-unique.validator';
import { User } from '../schemas/user.schema';

export class CreateUserDto {
  @IsOptional()
  @IsFile()
  @MaxFileSize(1e6)
  @HasMimeType(['image/jpeg', 'image/png'])
  avatar?: MemoryStoredFile;

  @ApiProperty({ example: 'oroz@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  @IsUnique(User.name)
  email: string;

  @ApiProperty({ example: '+996700700700' })
  @IsNotEmpty()
  @IsPhoneNumber()
  @IsUnique(User.name)
  phone: string;

  @ApiProperty({ example: 'Orozbek' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Zhenishbek uulu' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: UserRoleEnum.CLIENT })
  @IsNotEmpty()
  @IsString()
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @Transform(({ value }) => value !== 'false' && value !== false)
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ example: '********' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
