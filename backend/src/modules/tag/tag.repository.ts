import { Inject, Injectable } from '@nestjs/common';
import { eq, ilike, sql, count } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@/common/database/drizzle.provider';
import { tags, postTags, NewTag } from '@/db/schema';

@Injectable()
export class TagRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findAll() {
    return this.db.select().from(tags).orderBy(tags.name);
  }

  async search(query: string) {
    return this.db
      .select()
      .from(tags)
      .where(ilike(tags.name, `%${query}%`))
      .orderBy(tags.name)
      .limit(10);
  }

  async findAllWithCount() {
    const result = await this.db
      .select({
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
        createdAt: tags.createdAt,
        count: count(postTags.postId),
      })
      .from(tags)
      .leftJoin(postTags, eq(tags.id, postTags.tagId))
      .groupBy(tags.id, tags.name, tags.slug, tags.createdAt)
      .orderBy(tags.name);
    return result;
  }

  async findById(id: string) {
    const [tag] = await this.db.select().from(tags).where(eq(tags.id, id));
    return tag || null;
  }

  async findBySlug(slug: string) {
    const [tag] = await this.db.select().from(tags).where(eq(tags.slug, slug));
    return tag || null;
  }

  async findByName(name: string) {
    const [tag] = await this.db.select().from(tags).where(eq(tags.name, name));
    return tag || null;
  }

  async create(data: NewTag) {
    const [tag] = await this.db.insert(tags).values(data).returning();
    return tag;
  }

  async update(id: string, data: Partial<NewTag>) {
    const [tag] = await this.db
      .update(tags)
      .set(data)
      .where(eq(tags.id, id))
      .returning();
    return tag;
  }

  async delete(id: string) {
    await this.db.delete(tags).where(eq(tags.id, id));
  }
}
