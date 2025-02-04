import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Category } from '../schemas/cagegory.schema';
import { IsUniqueUpdating } from '../../common/validators/is-unique-updating.validator';

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Category 1' })
  @IsNotEmpty()
  @IsString()
  @IsUniqueUpdating(Category.name)
  name: string;
}
