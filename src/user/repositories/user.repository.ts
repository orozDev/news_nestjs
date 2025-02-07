import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { UserEntity } from '../entities/user.entity';
import {
  Error,
  Model,
  ProjectionType,
  QueryOptions,
  RootFilterQuery,
} from 'mongoose';
import UserMapper from '../mappers/user.mapper';
import RepositoryException from '../../common/exceptions/repository.exception';
import MongoErrorCode from '../../common/enums/mongo-error-code.enum';
import LockedException from '../../common/exceptions/locked.exception';
import * as bcryptjs from 'bcryptjs';
import UsesQueryDto from '../dto/uses-query.dto';

@Injectable()
export default class UserRepository {
  constructor(@InjectModel(User.name) private model: Model<User>) {}

  async findAll(): Promise<UserEntity[]> {
    const documents = await this.model.find().exec();
    return UserMapper.toEntities(documents);
  }

  async find(
    usesQueryDto: UsesQueryDto,
  ): Promise<{ count: number; users: UserEntity[] }> {
    const { page = 1, pageSize = 12, search, ...rest } = usesQueryDto;

    const queries = { ...rest };
    if (search) queries['$text'] = { $search: search };

    const documents = await this.model
      .find(queries)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const count = await this.model.countDocuments(queries).exec();
    const users = UserMapper.toEntities(documents);

    return { count, users };
  }

  async findById(id: string): Promise<UserEntity> {
    const document = await this.model.findById(id).exec();
    return UserMapper.toEntity(document);
  }

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    let user: UserDocument;

    if (data.password) {
      data.password = await UserRepository.makePassword(data.password);
    }

    try {
      user = await this.model.create(data);
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

    return UserMapper.toEntity(user);
  }

  async update(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.model.findOne({ _id: id }).exec();

    if (data?.password) {
      data.password = await UserRepository.makePassword(data.password);
    }

    Object.assign(user, data);
    await user.save();

    return UserMapper.toEntity(user);
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const document = await UserMapper.fromEntity(user, this.model);

    try {
      await document.save();
    } catch (error) {
      if (
        error.name === 'MongoServerError' &&
        error.code === MongoErrorCode.DuplicateKeyError
      ) {
        throw new RepositoryException(
          'User already exists',
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

    return UserMapper.toEntity(document);
  }

  async delete(id: string): Promise<UserEntity> {
    const deletedUser = await this.model.findByIdAndDelete(id).exec();
    return UserMapper.toEntity(deletedUser);
  }

  hydrate(doc: any): UserEntity {
    const document: UserDocument = this.model.hydrate(doc);
    return UserMapper.toEntity(document);
  }

  static makePassword(password: string): Promise<string> {
    return bcryptjs.hash(password, 10);
  }

  async findOne(
    filter?: RootFilterQuery<UserDocument>,
    projection?: ProjectionType<UserDocument> | null,
    options?: QueryOptions<UserDocument> | null,
  ): Promise<UserEntity> {
    const document = await this.model
      .findOne(filter, projection, options)
      .exec();
    return UserMapper.toEntity(document);
  }

  toEntities(documents: UserDocument[]): UserEntity[] {
    return UserMapper.toEntities(documents);
  }

  toEntity(document: UserDocument): UserEntity {
    return UserMapper.toEntity(document);
  }
}
