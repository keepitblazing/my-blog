import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PostRepository } from './post.repository';
import { CreatePostDto, UpdatePostDto } from './post.schema';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async findAll(includePrivate = false) {
    const posts = await this.postRepository.findAll(includePrivate);
    return posts.map(this.transformPostWithTags);
  }

  async findById(id: string) {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException('포스트를 찾을 수 없습니다');
    }
    return this.transformPostWithTags(post);
  }

  async findByCategory(category: 'dev' | 'diary', includePrivate = false) {
    const posts = await this.postRepository.findByCategory(
      category,
      includePrivate,
    );
    return posts.map(this.transformPostWithTags);
  }

  async create(dto: CreatePostDto) {
    const { tagIds = [], ...postData } = dto;

    // 태그 ID 검증
    if (tagIds.length > 0) {
      const isValid = await this.postRepository.validateTagIds(tagIds);
      if (!isValid) {
        throw new BadRequestException('존재하지 않는 태그가 포함되어 있습니다');
      }
    }

    // 트랜잭션으로 생성
    const post = await this.postRepository.createWithTags(postData, tagIds);
    return this.findById(post.id);
  }

  async update(id: string, dto: UpdatePostDto) {
    const existing = await this.postRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('포스트를 찾을 수 없습니다');
    }

    const { tagIds, ...postData } = dto;

    // 태그 ID 검증
    if (tagIds !== undefined && tagIds.length > 0) {
      const isValid = await this.postRepository.validateTagIds(tagIds);
      if (!isValid) {
        throw new BadRequestException('존재하지 않는 태그가 포함되어 있습니다');
      }
    }

    if (Object.keys(postData).length > 0) {
      await this.postRepository.update(id, postData);
    }

    if (tagIds !== undefined) {
      await this.postRepository.updateTags(id, tagIds);
    }

    return this.findById(id);
  }

  async delete(id: string) {
    const existing = await this.postRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('포스트를 찾을 수 없습니다');
    }
    await this.postRepository.delete(id);
  }

  async findByTagSlug(tagSlug: string, includePrivate = false) {
    return this.postRepository.findByTagSlug(tagSlug, includePrivate);
  }

  private transformPostWithTags(post: any) {
    const { postTags: _, ...rest } = post;
    return {
      ...rest,
      tags: post.postTags?.map((pt: any) => pt.tag).filter(Boolean) || [],
    };
  }
}
