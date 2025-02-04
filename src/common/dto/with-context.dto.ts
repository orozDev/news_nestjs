import { Allow } from 'class-validator';
import { UserEntity } from '../../user/entities/user.entity';

export class WithContextDto {
  @Allow()
  __context?: {
    user: UserEntity;
    params: object;
  };
}
