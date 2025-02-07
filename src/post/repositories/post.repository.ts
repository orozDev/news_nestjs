import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../schemas/post.schema';
import {
  Error,
  Model,
  ProjectionType,
  QueryOptions,
  RootFilterQuery,
} from 'mongoose';
import PostEntity from '../entities/post.entity';
import PostMapper from '../mappers/post.mapper';
import RepositoryException from '../../common/exceptions/repository.exception';
import MongoErrorCode from '../../common/enums/mongo-error-code.enum';
import LockedException from '../../common/exceptions/locked.exception';

@Injectable()
export default class PostRepository {
  constructor(@InjectModel(Post.name) private model: Model<Post>) {}

  async findById(id: string): Promise<PostEntity> {
    const document = await this.model.findById(id).exec();
    return PostMapper.toEntity(document);
  }

  async create(data: Partial<PostEntity>): Promise<PostEntity> {
    let post: PostDocument;

    try {
      post = await this.model.create(data);
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new RepositoryException(
          'Failed to create User in database',
          500,
          error.message,
        );
      } else if (
        error.name === 'MongoServerError' &&
        error.code === MongoErrorCode.DuplicateKeyError
      ) {
        throw new RepositoryException(
          'User already exists',
          409,
          error.message,
        );
      }

      throw error;
    }

    return PostMapper.toEntity(post);
  }

  async update(id: string, data: Partial<PostEntity>): Promise<PostEntity> {
    const post = await this.model.findOne({ _id: id }).exec();

    Object.assign(post, data);
    await post.save();

    return PostMapper.toEntity(post);
  }

  async save(post: PostEntity): Promise<PostEntity> {
    const document = await PostMapper.fromEntity(post, this.model);

    try {
      await document.save();
    } catch (error) {
      if (
        error.name === 'MongoServerError' &&
        error.code === MongoErrorCode.DuplicateKeyError
      ) {
        throw new RepositoryException(
          'Post already exists',
          409,
          error.message,
        );
      } else if (error instanceof Error.VersionError) {
        throw new LockedException(
          'Data were modified by another request. Please repeat your request.',
        );
      }

      throw error;
    }

    return PostMapper.toEntity(document);
  }

  async delete(id: string): Promise<PostEntity> {
    const deletedPost = await this.model.findByIdAndDelete(id).exec();
    return PostMapper.toEntity(deletedPost);
  }

  hydrate(doc: any): PostEntity {
    const document: PostDocument = this.model.hydrate(doc);
    return PostMapper.toEntity(document);
  }

  async findOne(
    filter?: RootFilterQuery<PostDocument>,
    projection?: ProjectionType<PostDocument> | null,
    options?: QueryOptions<PostDocument> | null,
  ): Promise<PostEntity> {
    const document = await this.model
      .findOne(filter, projection, options)
      .exec();
    return PostMapper.toEntity(document);
  }

  toEntities(documents: PostDocument[]): PostEntity[] {
    return PostMapper.toEntities(documents);
  }

  toEntity(document: PostDocument): PostEntity {
    return PostMapper.toEntity(document);
  }
}
