import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@/common/database/drizzle.provider';
import { tags, NewTag } from '@/db/schema';

@Injectable()
export class TagRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findAll() {
    return this.db.select().from(tags).orderBy(tags.name);
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
