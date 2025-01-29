import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../category/schemas/cagegory.schema';
import { User } from '../../user/schemas/user.schema';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class CreatePostDto {
  @ApiProperty({ example: 'Post 1' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'description' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  description: string;

  @ApiProperty({ example: 'html content' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  content: string;

  @IsNotEmpty()
  @IsFile()
  @MaxFileSize(16e6)
  @HasMimeType(['image/jpeg', 'image/png'])
  image: MemoryStoredFile;

  @ApiProperty({ example: Date.now() })
  createdAt: Date;

  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  category: Category;

  @ApiProperty({ example: ['Tag 1', 'Tag 2'] })
  tags: string[];

  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  user: User;
}
