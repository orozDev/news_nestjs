import { ITokens } from '../interfaces/tokens.interface';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';

export class UserWithTokensDto extends UserEntity implements ITokens {
  @ApiProperty({ example: '' })
  accessToken: string;
  @ApiProperty({ example: '' })
  refreshToken: string;
}
