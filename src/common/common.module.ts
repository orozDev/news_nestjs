import { Module } from '@nestjs/common';
import { IsUniqueUpdatingConstraint } from './validators/is-unique-updating.validator';
import { IsExistedConstraint } from './validators/is-exists.validator';
import { IsUniqueConstraint } from './validators/is-unique.validator';

@Module({
  imports: [],
  providers: [
    IsUniqueUpdatingConstraint,
    IsExistedConstraint,
    IsUniqueConstraint,
  ],
  exports: [
    IsUniqueUpdatingConstraint,
    IsExistedConstraint,
    IsUniqueConstraint,
  ],
})
export default class CommonModule {}
