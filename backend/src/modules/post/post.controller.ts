import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JoiValidationPipe } from '@/common/pipes/joi-validation.pipe';
import {
  createPostSchema,
  updatePostSchema,
  postIdSchema,
  CreatePostDto,
  UpdatePostDto,
} from './post.schema';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async findAll(@Query('category') category?: string) {
    if (category) {
      if (category !== 'dev' && category !== 'diary') {
        throw new BadRequestException('category는 dev 또는 diary만 가능합니다');
      }
      return this.postService.findByCategory(category);
    }
    return this.postService.findAll();
  }

  @Get('tag/:slug')
  async findByTag(@Param('slug') slug: string) {
    return this.postService.findByTagSlug(slug);
  }

  @Get(':id')
  async findOne(
    @Param(new JoiValidationPipe(postIdSchema)) params: { id: string },
  ) {
    return this.postService.findById(params.id);
  }

  @Post()
  async create(
    @Body(new JoiValidationPipe(createPostSchema)) dto: CreatePostDto,
  ) {
    return this.postService.create(dto);
  }

  @Put(':id')
  async update(
    @Param(new JoiValidationPipe(postIdSchema)) params: { id: string },
    @Body(new JoiValidationPipe(updatePostSchema)) dto: UpdatePostDto,
  ) {
    return this.postService.update(params.id, dto);
  }

  @Delete(':id')
  async remove(
    @Param(new JoiValidationPipe(postIdSchema)) params: { id: string },
  ) {
    await this.postService.delete(params.id);
    return { message: '삭제되었습니다' };
  }
}
