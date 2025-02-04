import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUnique } from '../../common/validators/is-unique.validator';
import { Category } from '../schemas/cagegory.schema';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Category 1' })
  @IsNotEmpty()
  @IsString()
  @IsUnique(Category.name)
  name: string;
}
