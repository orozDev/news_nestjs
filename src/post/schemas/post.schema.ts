import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Category } from '../../category/schemas/cagegory.schema';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class Post {
  @ApiProperty({ example: 'Post 1' })
  @Prop({ maxlength: 100 })
  name: string;

  @ApiProperty({ example: 'description' })
  @Prop({ maxlength: 200 })
  description: string;

  @ApiProperty({ example: 'html content' })
  @Prop({ maxlength: 5000 })
  content: string;

  @ApiProperty({ example: '/static/1.png' })
  @Prop()
  image: string;

  @ApiProperty({ example: Date.now() })
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  category: Category;

  @ApiProperty({ example: ['Tag 1', 'Tag 2'] })
  @Prop({ type: [String], default: [] })
  tags: string[];

  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const PostSchema = SchemaFactory.createForClass(Post);
