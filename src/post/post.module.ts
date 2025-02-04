import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Category, CategorySchema } from '../category/schemas/cagegory.schema';
import { Post, PostSchema } from './schemas/post.schema';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { FileManagerModule } from '../file-manager/file-manager.module';
import CommonModule from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
      },
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
    NestjsFormDataModule,
    FileManagerModule,
    CommonModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
