import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { JoiValidationPipe } from '@/common/pipes/joi-validation.pipe';
import { createVisitorLogSchema, CreateVisitorLogDto } from './visitor.schema';

@Controller('visitors')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Post('log')
  async logVisit(
    @Body(new JoiValidationPipe(createVisitorLogSchema)) dto: CreateVisitorLogDto,
  ) {
    return this.visitorService.logVisit(dto);
  }

  @Get('count')
  async getDailyCount(@Query('date') date?: string) {
    const count = await this.visitorService.getDailyCount(date);
    return { count };
  }

  @Get('stats')
  async getStats(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days, 10) : 30;
    return this.visitorService.getStats(daysNum);
  }
}
