import { Controller, Get, Param, Query, UseGuards, Post, Body } from '@nestjs/common'
import { JwtAuthGuard } from '@yikart/aitoearn-auth'
import { AnalyticsService } from './analytics.service'

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('record')
  async recordMetrics(
    @Body() data: {
      teamId: string
      accountId: string
      platform: string
      date: string
      metrics: {
        publishCount?: number
        viewCount?: number
        likeCount?: number
        commentCount?: number
        shareCount?: number
        followerCount?: number
        followerGrowth?: number
      }
    },
  ) {
    return await this.analyticsService.recordDailyMetrics({
      ...data,
      date: new Date(data.date),
    })
  }

  @Get('daily/:teamId')
  async getDailyReport(
    @Param('teamId') teamId: string,
    @Query('date') date: string,
  ) {
    const reportDate = date ? new Date(date) : new Date()
    return await this.analyticsService.getDailyReport(teamId, reportDate)
  }

  @Get('weekly/:teamId')
  async getWeeklyReport(
    @Param('teamId') teamId: string,
    @Query('endDate') endDate?: string,
  ) {
    const reportDate = endDate ? new Date(endDate) : new Date()
    return await this.analyticsService.getWeeklyReport(teamId, reportDate)
  }

  @Get('monthly/:teamId')
  async getMonthlyReport(
    @Param('teamId') teamId: string,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    const now = new Date()
    const reportYear = year ? parseInt(year) : now.getFullYear()
    const reportMonth = month ? parseInt(month) : now.getMonth() + 1

    return await this.analyticsService.getMonthlyReport(
      teamId,
      reportYear,
      reportMonth,
    )
  }

  @Get('compare/:teamId')
  async getAccountComparison(
    @Param('teamId') teamId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    return await this.analyticsService.getAccountComparison(teamId, start, end)
  }

  @Get('platform/:teamId')
  async getPlatformStats(
    @Param('teamId') teamId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    return await this.analyticsService.getPlatformStats(teamId, start, end)
  }

  @Get('trend/:accountId')
  async getAccountTrend(
    @Param('accountId') accountId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    return await this.analyticsService.getAccountTrend(accountId, start, end)
  }
}
