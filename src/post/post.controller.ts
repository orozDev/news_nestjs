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
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import MongoIdDto from '../common/dto/mongo-id.dto';
import { Post as PostModel } from './schemas/post.schema';
import { StripContextPipe } from '../common/pipes/strip-context.pipe';
import { ContextInterceptor } from '../common/interceptors/context.interceptor';

@ApiTags('Post')
@Controller('/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiResponse({ type: PostModel })
  @Post()
  @FormDataRequest()
  async create(@Body() createPostDto: CreatePostDto) {
    return await this.postService.create(createPostDto);
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
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param() { id }: MongoIdDto) {
    return await this.postService.remove(id);
  }
}
