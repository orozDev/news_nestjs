import { BaseEntity } from '../../common/entities/base.entity';
import { UserEntity } from '../../user/entities/user.entity';
import CategoryEntity from '../../category/entities/category.entity';

export default class PostEntity extends BaseEntity<PostEntity> {
  name: string;
  description: string;
  content: string;
  image: string;
  createdAt: Date;
  tags: string[];

  categoryId: string | null = null;
  category?: CategoryEntity;

  userId: string | null = null;
  user?: UserEntity;

  constructor(partial?: Partial<PostEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
