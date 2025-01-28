import { User, UserDocument } from '../schemas/user.schema';
import { UserEntity } from '../entities/user.entity';
import { Model } from 'mongoose';

export default class UserMapper {
  static toEntity(userDocument: UserDocument): UserEntity {
    const user = new UserEntity();
    user.id = userDocument.id;
    user.avatar = userDocument.avatar ?? null;
    user.email = userDocument.email;
    user.firstName = userDocument.firstName;
    user.isActive = userDocument.isActive;
    user.lastName = userDocument.lastName;
    user.password = userDocument.password;
    user.phone = userDocument.phone;
    user.role = userDocument.role;
    return user;
  }

  static toEntities(userDocuments: UserDocument[]): UserEntity[] {
    return userDocuments.map((userDocument) =>
      UserMapper.toEntity(userDocument),
    );
  }

  static async fromEntity(
    user: UserEntity,
    model: Model<User>,
  ): Promise<UserDocument> {
    const document = user.id
      ? await model.findById(user.id).exec()
      : new model();
    document.avatar = user.avatar;
    document.email = user.email;
    document.firstName = user.firstName;
    document.lastName = user.lastName;
    document.isActive = user.isActive;
    document.password = user.password;
    document.phone = user.phone;
    document.role = user.role;
    return document;
  }
}
