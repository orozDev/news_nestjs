import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../schemas/user.schema';
import { UserRoleEnum } from '../enums/user-role.enum';
import * as bcryptjs from 'bcryptjs';

export class UserEntity extends BaseEntity<UserEntity> implements User {
  avatar: string;
  email: string;
  firstName: string;
  isActive: boolean;
  lastName: string;
  password: string;
  phone: string;
  role: UserRoleEnum;

  get getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  async checkPassword(password): Promise<boolean> {
    return await bcryptjs.compare(password, this.password);
  }

  async setPassword(password): Promise<string> {
    const hashedPassword = await bcryptjs.hash(password, 10);
    this.password = hashedPassword;
    return hashedPassword;
  }

  constructor(partial?: Partial<UserEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
