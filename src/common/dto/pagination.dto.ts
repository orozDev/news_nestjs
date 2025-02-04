import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({ example: 1, required: false })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsOptional()
  page: number;

  @ApiProperty({ example: 20, required: false })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsOptional()
  pageSize: number;
}
