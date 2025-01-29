import { ITokens } from '../interfaces/tokens.interface';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenResponseDto implements ITokens {
  @ApiProperty({ example: '' })
  accessToken: string;

  @ApiProperty({ example: '' })
  refreshToken: string;
}
