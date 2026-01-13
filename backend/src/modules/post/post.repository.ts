import { Inject, Injectable } from '@nestjs/common';
import { eq, desc, inArray } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@/common/database/drizzle.provider';
import { posts, postTags, tags, NewPost } from '@/db/schema';

@Injectable()
export class PostRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findAll(includePrivate = false) {
    return this.db.query.posts.findMany({
      where: includePrivate ? undefined : eq(posts.isPrivate, false),
      orderBy: [desc(posts.createdAt)],
      with: {
        postTags: {
          with: {
            tag: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.db.query.posts.findFirst({
      where: eq(posts.id, id),
      with: {
        postTags: {
          with: {
            tag: true,
          },
        },
      },
    });
  }

  async findByCategory(category: 'dev' | 'diary', includePrivate = false) {
    return this.db.query.posts.findMany({
      where: (posts, { eq, and }) => {
        const conditions = [eq(posts.category, category)];
        if (!includePrivate) {
          conditions.push(eq(posts.isPrivate, false));
        }
        return and(...conditions);
      },
      orderBy: [desc(posts.createdAt)],
      with: {
        postTags: {
          with: {
            tag: true,
          },
        },
      },
    });
  }

  async create(data: NewPost) {
    const [post] = await this.db.insert(posts).values(data).returning();
    return post;
  }

  async update(id: string, data: Partial<NewPost>) {
    const [post] = await this.db
      .update(posts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return post;
  }

  async delete(id: string) {
    await this.db.delete(posts).where(eq(posts.id, id));
  }

  async updateTags(postId: string, tagIds: string[]) {
    // 트랜잭션으로 delete + insert 묶기
    await this.db.transaction(async (tx) => {
      await tx.delete(postTags).where(eq(postTags.postId, postId));

      if (tagIds.length > 0) {
        await tx.insert(postTags).values(
          tagIds.map((tagId) => ({
            postId,
            tagId,
          })),
        );
      }
    });
  }

  async createWithTags(data: NewPost, tagIds: string[]) {
    return this.db.transaction(async (tx) => {
      const [post] = await tx.insert(posts).values(data).returning();

      if (tagIds.length > 0) {
        await tx.insert(postTags).values(
          tagIds.map((tagId) => ({
            postId: post.id,
            tagId,
          })),
        );
      }

      return post;
    });
  }

  async findByTagSlug(tagSlug: string, includePrivate = false) {
    const baseQuery = this.db
      .select({ post: posts })
      .from(posts)
      .innerJoin(postTags, eq(posts.id, postTags.postId))
      .innerJoin(tags, eq(postTags.tagId, tags.id))
      .where(eq(tags.slug, tagSlug))
      .orderBy(desc(posts.createdAt));

    const result = await baseQuery;

    // private 필터링
    if (!includePrivate) {
      return result.filter((r) => !r.post.isPrivate).map((r) => r.post);
    }

    return result.map((r) => r.post);
  }

  // 태그 ID들이 실제로 존재하는지 검증
  async validateTagIds(tagIds: string[]): Promise<boolean> {
    if (tagIds.length === 0) return true;

    const existingTags = await this.db
      .select({ id: tags.id })
      .from(tags)
      .where(inArray(tags.id, tagIds));

    return existingTags.length === tagIds.length;
  }
}
