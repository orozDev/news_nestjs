import { ExecutionContext, Inject, Injectable } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PostService } from '../post.service';
import { UserRoleEnum } from '../../user/enums/user-role.enum';

@Injectable({})
export class PostOwnerGuard extends JwtAuthGuard {
  constructor(@Inject(PostService) private readonly postService: PostService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const previousResult = await super.canActivate(context);
    if (!previousResult) {
      return false;
    }
    const req = context.switchToHttp().getRequest();
    const postId = req.params.id;
    const post = await this.postService.findOne(postId);
    return post.user === req.user.id || req.user.role === UserRoleEnum.ADMIN;
  }
}
