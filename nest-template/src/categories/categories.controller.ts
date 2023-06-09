import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import CreateCategoryDto from './dto/createCategory.dto';
import { CategoriesService } from './categories.service';
import JwtAuthenticationGuard from '../authentication/guard/jwt-authentication.guard';
import UpdateCategoryDto from './dto/updateCategory.dto';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @ApiParam({
    name: 'id',
    type: Number,
  })
  @Get(':id')
  getCategoryById(@Param() id: number) {
    return this.categoriesService.getCategoryById(Number(id));
  }

  @ApiBody({
    type: CreateCategoryDto,
  })
  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createCategory(@Body() category: CreateCategoryDto) {
    return this.categoriesService.createCategory(category);
  }

  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiBody({
    type: UpdateCategoryDto,
  })
  @Patch(':id')
  async updateCategory(
    @Param() id: number,
    @Body() category: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(Number(id), category);
  }

  @ApiParam({
    name: 'id',
    type: Number,
  })
  @Delete(':id')
  async deleteCategory(@Param() id: number) {
    return this.categoriesService.deleteCategory(Number(id));
  }
}
