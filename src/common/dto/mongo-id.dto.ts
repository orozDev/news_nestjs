import { IsMongoId, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class MongoIdDto {
  @ApiProperty({
    description: 'Id',
    required: true,
    type: String,
    default: '61d9cfbf17ed7311c4b3e485',
  })
  @IsMongoId()
  @IsString()
  id: string;
}
