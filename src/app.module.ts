import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { ConfigModule } from '@nestjs/config';
import CoreModule from './core/core.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { FileManagerModule } from './file-manager/file-manager.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve('static'),
      serveRoot: '/static/',
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/posts'),
    NestjsFormDataModule,
    CoreModule,
    UserModule,
    PostModule,
    CategoryModule,
    FileManagerModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
