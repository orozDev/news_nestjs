import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import MongoIdDto from '../common/dto/mongo-id.dto';
import { Post as PostModel } from './schemas/post.schema';
import { StripContextPipe } from '../common/pipes/strip-context.pipe';
import { ContextInterceptor } from '../common/interceptors/context.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostOwnerGuard } from './guards/post-owner.guard';
import { RetrieveUser } from '../auth/decorators/retrieve-user.decorator';
import { UserEntity } from '../user/entities/user.entity';

@ApiTags('Post')
@Controller('/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiResponse({ type: PostModel })
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @FormDataRequest()
  async create(
    @Body() createPostDto: CreatePostDto,
    @RetrieveUser() user: UserEntity,
  ) {
    return await this.postService.create(createPostDto, user);
  }

  @ApiResponse({ type: [PostModel] })
  @Get()
  async findAll() {
    return await this.postService.findAll();
  }

  @ApiResponse({ type: PostModel })
  @Get(':id')
  async findOne(@Param() { id }: MongoIdDto) {
    return await this.postService.findOne(id);
  }

  @ApiResponse({ type: PostModel })
  @ApiBearerAuth()
  @UseGuards(PostOwnerGuard)
  @FormDataRequest()
  @UseInterceptors(ContextInterceptor)
  @Patch(':id')
  async update(
    @Param() { id }: MongoIdDto,
    @Body(StripContextPipe) updatePostDto: UpdatePostDto,
  ) {
    return await this.postService.update(id, updatePostDto);
  }

  @ApiResponse({ status: HttpStatus.NO_CONTENT, type: PostModel })
  @ApiBearerAuth()
  @UseGuards(PostOwnerGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param() { id }: MongoIdDto) {
    return await this.postService.remove(id);
  }
}
