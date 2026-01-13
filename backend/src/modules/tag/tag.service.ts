import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { TagRepository } from './tag.repository';
import { CreateTagDto, UpdateTagDto } from './tag.schema';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async findAll() {
    return this.tagRepository.findAll();
  }

  async search(query: string) {
    return this.tagRepository.search(query);
  }

  async findAllWithCount() {
    return this.tagRepository.findAllWithCount();
  }

  async findById(id: string) {
    const tag = await this.tagRepository.findById(id);
    if (!tag) {
      throw new NotFoundException('태그를 찾을 수 없습니다');
    }
    return tag;
  }

  async findBySlug(slug: string) {
    const tag = await this.tagRepository.findBySlug(slug);
    if (!tag) {
      throw new NotFoundException('태그를 찾을 수 없습니다');
    }
    return tag;
  }

  async create(dto: CreateTagDto) {
    const existingByName = await this.tagRepository.findByName(dto.name);
    if (existingByName) {
      throw new ConflictException('이미 존재하는 태그 이름입니다');
    }

    const existingBySlug = await this.tagRepository.findBySlug(dto.slug);
    if (existingBySlug) {
      throw new ConflictException('이미 존재하는 슬러그입니다');
    }

    return this.tagRepository.create(dto);
  }

  async update(id: string, dto: UpdateTagDto) {
    const existing = await this.tagRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('태그를 찾을 수 없습니다');
    }

    if (dto.name && dto.name !== existing.name) {
      const existingByName = await this.tagRepository.findByName(dto.name);
      if (existingByName) {
        throw new ConflictException('이미 존재하는 태그 이름입니다');
      }
    }

    if (dto.slug && dto.slug !== existing.slug) {
      const existingBySlug = await this.tagRepository.findBySlug(dto.slug);
      if (existingBySlug) {
        throw new ConflictException('이미 존재하는 슬러그입니다');
      }
    }

    return this.tagRepository.update(id, dto);
  }

  async delete(id: string) {
    const existing = await this.tagRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('태그를 찾을 수 없습니다');
    }
    await this.tagRepository.delete(id);
  }
}
