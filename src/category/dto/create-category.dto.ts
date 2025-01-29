import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Category 1' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
