import mongoose, { Model } from 'mongoose';
import { Post, PostDocument } from '../schemas/post.schema';
import PostEntity from '../entities/post.entity';
import { CategoryDocument } from '../../category/schemas/cagegory.schema';
import { CategoryMapper } from '../../category/mappers/category.mapper';
import UserMapper from '../../user/mappers/user.mapper';
import { UserDocument } from '../../user/schemas/user.schema';

export default class PostMapper {
  static toEntity(postDocument: PostDocument): PostEntity {
    const post = new PostEntity();
    post.id = postDocument.id;
    post.name = postDocument.name;
    post.description = postDocument.description;
    post.content = postDocument.content;
    post.tags = postDocument.tags;

    if (postDocument.category instanceof mongoose.Types.ObjectId) {
      post.categoryId = postDocument.category.toString();
    } else if (postDocument.category != null) {
      post.category = CategoryMapper.toEntity(
        post.category as CategoryDocument,
      );
      post.categoryId = post.category.id;
    }

    if (postDocument.user instanceof mongoose.Types.ObjectId) {
      post.userId = postDocument.user.toString();
    } else if (postDocument.user != null) {
      post.user = UserMapper.toEntity(post.user as UserDocument);
      post.userId = post.user.id;
    }

    return post;
  }

  static toEntities(postDocuments: PostDocument[]): PostEntity[] {
    return postDocuments.map((postDocument) =>
      PostMapper.toEntity(postDocument),
    );
  }

  static async fromEntity(
    post: PostEntity,
    model: Model<Post>,
  ): Promise<PostDocument> {
    const document = post.id
      ? await model.findById(post.id).exec()
      : new model();

    document.name = post.name;
    document.description = post.description;
    document.content = post.content;
    document.tags = post.tags;
    document.category = post.categoryId
      ? new mongoose.Types.ObjectId(post.categoryId)
      : null;
    document.user = post.userId
      ? new mongoose.Types.ObjectId(post.userId)
      : null;

    return document;
  }
}
