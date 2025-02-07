import { ApiProperty } from '@nestjs/swagger';

export default abstract class BaseEntityDto {
  @ApiProperty({ example: '61d9cfbf17ed7311c4b3e485' })
  id: string;

  static prepareUrl(filePath: string, staticUrlPrefix: string): string {
    return `${staticUrlPrefix}${staticUrlPrefix.endsWith('/') || filePath.startsWith('/') ? '' : '/'}${filePath}`;
  }
}
