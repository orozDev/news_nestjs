import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../../user/entities/user.entity';
import { IUser } from '../interfaces/user.interface';

export const RetrieveUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Promise<UserEntity | IUser> => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
