import { UserRoleEnum } from '../../user/enums/user-role.enum';

export interface IUser {
  sub: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role: UserRoleEnum;
}
