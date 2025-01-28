import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from '../enums/user-role.enum';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ example: '/static/avatar.png' })
  @Prop({ required: false })
  avatar: string;

  @ApiProperty({ example: 'oroz@gmail.com' })
  @Prop({ unique: true })
  email: string;

  @ApiProperty({ example: '+996700700700' })
  @Prop({ unique: true })
  phone: string;

  @ApiProperty({ example: 'Orozbek' })
  @Prop()
  firstName: string;

  @ApiProperty({ example: 'Zhenishbek uulu' })
  @Prop()
  lastName: string;

  @ApiProperty({ example: UserRoleEnum.CLIENT })
  @Prop({
    enum: UserRoleEnum,
    default: UserRoleEnum.CLIENT,
  })
  role: UserRoleEnum;

  @ApiProperty({ example: true })
  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
