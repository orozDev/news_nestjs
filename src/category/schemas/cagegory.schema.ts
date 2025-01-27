import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Category {
  @ApiProperty({ example: 'Category 1' })
  @Prop({ maxlength: 100, unique: true })
  name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
