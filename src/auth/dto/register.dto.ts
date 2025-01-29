import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class RegisterDto {
  @IsOptional()
  @IsFile()
  @MaxFileSize(1e6)
  @HasMimeType(['image/jpeg', 'image/png'])
  avatar?: MemoryStoredFile;

  @ApiProperty({ example: 'oroz@gmail.com' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '********' })
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 0,
    minNumbers: 0,
    minSymbols: 0,
    minUppercase: 0,
  })
  password: string;

  @ApiProperty({ example: '+996700700700' })
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ example: 'Orozbek' })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Zhenishbek uulu' })
  @IsString()
  @MaxLength(100)
  lastName: string;
}
