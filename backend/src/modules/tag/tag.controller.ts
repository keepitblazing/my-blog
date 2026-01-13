import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { JoiValidationPipe } from '@/common/pipes/joi-validation.pipe';
import {
  createTagSchema,
  updateTagSchema,
  tagIdSchema,
  tagSlugSchema,
  CreateTagDto,
  UpdateTagDto,
} from './tag.schema';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAll() {
    return this.tagService.findAll();
  }

  @Get('search')
  async search(@Query('q') query: string) {
    if (!query || query.trim().length === 0) {
      return [];
    }
    return this.tagService.search(query.trim());
  }

  @Get('with-count')
  async findAllWithCount() {
    return this.tagService.findAllWithCount();
  }

  // slug 라우트가 :id 보다 먼저 와야 함
  @Get('slug/:slug')
  async findBySlug(
    @Param(new JoiValidationPipe(tagSlugSchema)) params: { slug: string },
  ) {
    return this.tagService.findBySlug(params.slug);
  }

  @Get(':id')
  async findOne(
    @Param(new JoiValidationPipe(tagIdSchema)) params: { id: string },
  ) {
    return this.tagService.findById(params.id);
  }

  @Post()
  async create(
    @Body(new JoiValidationPipe(createTagSchema)) dto: CreateTagDto,
  ) {
    return this.tagService.create(dto);
  }

  @Put(':id')
  async update(
    @Param(new JoiValidationPipe(tagIdSchema)) params: { id: string },
    @Body(new JoiValidationPipe(updateTagSchema)) dto: UpdateTagDto,
  ) {
    return this.tagService.update(params.id, dto);
  }

  @Delete(':id')
  async remove(
    @Param(new JoiValidationPipe(tagIdSchema)) params: { id: string },
  ) {
    await this.tagService.delete(params.id);
    return { message: '삭제되었습니다' };
  }
}
