import { BaseEntity } from '../../common/entities/base.entity';

export default class CategoryEntity extends BaseEntity<CategoryEntity> {
  name: string;

  constructor(partial?: Partial<CategoryEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
