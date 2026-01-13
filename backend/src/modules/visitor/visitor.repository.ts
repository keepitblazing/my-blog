import { Inject, Injectable } from '@nestjs/common';
import { eq, sql, desc, and } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '@/common/database/drizzle.provider';
import { visitorLogs, dailyVisitors } from '@/db/schema';
import { CreateVisitorLogDto } from './visitor.schema';

@Injectable()
export class VisitorRepository {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async createLog(data: CreateVisitorLogDto & { isNewVisitor: boolean }) {
    const [log] = await this.db.insert(visitorLogs).values(data).returning();
    return log;
  }

  async findLogsByDate(date: string) {
    return this.db
      .select()
      .from(visitorLogs)
      .where(sql`DATE(${visitorLogs.visitedAt}) = ${date}`)
      .orderBy(desc(visitorLogs.visitedAt));
  }

  async getDailyCount(date: string) {
    const [result] = await this.db
      .select()
      .from(dailyVisitors)
      .where(eq(dailyVisitors.date, date));
    return result?.count || 0;
  }

  async incrementDailyCount(date: string) {
    const result = await this.db
      .insert(dailyVisitors)
      .values({ date, count: 1 })
      .onConflictDoUpdate({
        target: dailyVisitors.date,
        set: {
          count: sql`${dailyVisitors.count} + 1`,
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  }

  async getRecentDailyStats(days: number = 30) {
    return this.db
      .select()
      .from(dailyVisitors)
      .orderBy(desc(dailyVisitors.date))
      .limit(days);
  }

  async getTotalCount(): Promise<number> {
    const [result] = await this.db
      .select({ total: sql<number>`COALESCE(SUM(${dailyVisitors.count}), 0)` })
      .from(dailyVisitors);
    return result?.total || 0;
  }

  async checkExistingVisitor(visitorHash: string, date: string) {
    const [existing] = await this.db
      .select({ id: visitorLogs.id })
      .from(visitorLogs)
      .where(
        and(
          eq(visitorLogs.visitorHash, visitorHash),
          sql`DATE(${visitorLogs.visitedAt}) = ${date}`,
        ),
      )
      .limit(1);

    return !!existing;
  }

  // 트랜잭션으로 방문 로그 + 카운트 증가 원자적 처리
  async logVisitWithCount(
    data: CreateVisitorLogDto,
    date: string,
  ): Promise<{ log: typeof visitorLogs.$inferSelect; isNewVisitor: boolean }> {
    return this.db.transaction(async (tx) => {
      // 기존 방문자인지 확인
      const [existing] = await tx
        .select({ id: visitorLogs.id })
        .from(visitorLogs)
        .where(
          and(
            eq(visitorLogs.visitorHash, data.visitorHash),
            sql`DATE(${visitorLogs.visitedAt}) = ${date}`,
          ),
        )
        .limit(1);

      const isNewVisitor = !existing;

      // 로그 생성
      const [log] = await tx
        .insert(visitorLogs)
        .values({ ...data, isNewVisitor })
        .returning();

      // 신규 방문자면 카운트 증가
      if (isNewVisitor) {
        await tx
          .insert(dailyVisitors)
          .values({ date, count: 1 })
          .onConflictDoUpdate({
            target: dailyVisitors.date,
            set: {
              count: sql`${dailyVisitors.count} + 1`,
              updatedAt: new Date(),
            },
          });
      }

      return { log, isNewVisitor };
    });
  }
}
