import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { FileManagerModule } from '../file-manager/file-manager.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import UserRepository from './repositories/user.repository';
import CommonModule from '../common/common.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    FileManagerModule,
    NestjsFormDataModule,
    CommonModule,
    ConfigModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
