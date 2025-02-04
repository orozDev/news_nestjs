import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { User } from '../schemas/user.schema';
import { UserRoleEnum } from '../enums/user-role.enum';
import { Transform } from 'class-transformer';
import { IsOptionalNonNullable } from '../../common/validators/ is-optional-non-nullable.validator';
import { IsUniqueUpdating } from '../../common/validators/is-unique-updating.validator';

export class UpdateUserDto {
  @IsOptional()
  @IsFile()
  @MaxFileSize(1e6)
  @HasMimeType(['image/jpeg', 'image/png'])
  avatar?: MemoryStoredFile;

  @ApiProperty({ example: 'oroz@gmail.com' })
  @IsOptionalNonNullable()
  @IsEmail()
  @IsUniqueUpdating(User.name)
  email: string;

  @ApiProperty({ example: '+996700700700' })
  @IsOptionalNonNullable()
  @IsPhoneNumber()
  @IsUniqueUpdating(User.name)
  phone: string;

  @ApiProperty({ example: 'Orozbek' })
  @IsOptionalNonNullable()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Zhenishbek uulu' })
  @IsOptionalNonNullable()
  @IsString()
  lastName: string;

  @ApiProperty({ example: UserRoleEnum.CLIENT })
  @IsOptionalNonNullable()
  @IsString()
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;

  @ApiProperty({ example: true })
  @IsOptionalNonNullable()
  @Transform(({ value }) => value !== 'false' && value !== false)
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ example: '********' })
  @IsOptionalNonNullable()
  @IsString()
  password: string;
}
