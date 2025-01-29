import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsOptionalNonNullable } from '../../common/validators/ is-optional-non-nullable.validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
export class ChangeProfileDto {
  @IsOptional()
  @IsFile()
  @MaxFileSize(1e6)
  @HasMimeType(['image/jpeg', 'image/png'])
  avatar?: MemoryStoredFile;

  @ApiProperty({ example: 'mike@gmail.com' })
  @IsOptionalNonNullable()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+996700600600' })
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ example: 'Mike' })
  @IsOptionalNonNullable()
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Will' })
  @IsOptionalNonNullable()
  @IsString()
  @MaxLength(100)
  lastName: string;
}
