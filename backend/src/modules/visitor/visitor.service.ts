import { Injectable } from '@nestjs/common';
import { VisitorRepository } from './visitor.repository';
import { CreateVisitorLogDto } from './visitor.schema';

@Injectable()
export class VisitorService {
  constructor(private readonly visitorRepository: VisitorRepository) {}

  async logVisit(dto: CreateVisitorLogDto) {
    const today = new Date().toISOString().split('T')[0];

    // 트랜잭션으로 원자적 처리
    const { log } = await this.visitorRepository.logVisitWithCount(dto, today);
    return log;
  }

  async getDailyCount(date?: string) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return this.visitorRepository.getDailyCount(targetDate);
  }

  async getStats(days: number = 30) {
    return this.visitorRepository.getRecentDailyStats(days);
  }

  async getTotalCount() {
    return this.visitorRepository.getTotalCount();
  }
}
