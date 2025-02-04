import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { FileManagerService } from '../file-manager/file-manager.service';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private fileManagerService: FileManagerService,
  ) {}

  async create(createPostDto: CreatePostDto, user: UserEntity): Promise<Post> {
    const { image, ...rest } = createPostDto;
    const temp = {
      image: await this.fileManagerService.createFile('post-images', image),
    };
    const post = new this.postModel({ ...temp, ...rest, user: user.id });
    return post.save();
  }

  async findAll(): Promise<Post[]> {
    return await this.postModel.find().populate('user', 'category').exec();
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postModel.findById(id).exec();
    if (!post) throw new NotFoundException('Post was not found');
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    const { image, ...rest } = updatePostDto;
    if (image) {
      await this.fileManagerService.removeFile(post.image, false);
      await this.fileManagerService.createFile('post-images', image);
    }

    return await this.postModel
      .findByIdAndUpdate(id, rest, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Post> {
    await this.findOne(id);
    return await this.postModel.findByIdAndDelete(id).exec();
  }
}
