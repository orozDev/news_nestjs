import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import MongoIdDto from '../common/dto/mongo-id.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from './schemas/cagegory.schema';

@ApiTags('Category')
@Controller('/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiResponse({ type: Category })
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @ApiResponse({ type: [Category] })
  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @ApiResponse({ type: Category })
  @Get(':id')
  async findOne(@Param() { id }: MongoIdDto) {
    return await this.categoryService.findOne(id);
  }

  @ApiResponse({ type: Category })
  @Patch(':id')
  async update(
    @Param() { id }: MongoIdDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(id, updateCategoryDto);
  }

  @ApiResponse({ status: HttpStatus.NO_CONTENT, type: Category })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param() { id }: MongoIdDto) {
    return await this.categoryService.remove(id);
  }
}
