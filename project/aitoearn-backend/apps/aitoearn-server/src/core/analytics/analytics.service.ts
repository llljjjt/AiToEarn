import { Injectable, Logger } from '@nestjs/common'
import { AnalyticsRepository } from '@yikart/mongodb'

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name)

  constructor(
    private readonly analyticsRepository: AnalyticsRepository,
  ) {}

  async recordDailyMetrics(data: {
    teamId: string
    accountId: string
    platform: string
    date: Date
    metrics: {
      publishCount?: number
      viewCount?: number
      likeCount?: number
      commentCount?: number
      shareCount?: number
      followerCount?: number
      followerGrowth?: number
    }
  }) {
    this.logger.log(`Recording daily metrics for account ${data.accountId}`)

    return await this.analyticsRepository.upsertDailyMetrics(
      data.teamId,
      data.accountId,
      data.platform,
      data.date,
      data.metrics,
    )
  }

  async getDailyReport(teamId: string, date: Date) {
    const startDate = new Date(date)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(date)
    endDate.setHours(23, 59, 59, 999)

    const records = await this.analyticsRepository.findByTeamIdAndDateRange(
      teamId,
      startDate,
      endDate,
    )

    return this.aggregateMetrics(records)
  }

  async getWeeklyReport(teamId: string, endDate: Date) {
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    const start = new Date(endDate)
    start.setDate(start.getDate() - 6)
    start.setHours(0, 0, 0, 0)

    const records = await this.analyticsRepository.findByTeamIdAndDateRange(
      teamId,
      start,
      end,
    )

    return this.aggregateMetrics(records)
  }

  async getMonthlyReport(teamId: string, year: number, month: number) {
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 0, 23, 59, 59, 999)

    const records = await this.analyticsRepository.findByTeamIdAndDateRange(
      teamId,
      start,
      end,
    )

    return this.aggregateMetrics(records)
  }

  async getAccountComparison(teamId: string, startDate: Date, endDate: Date) {
    const records = await this.analyticsRepository.findByTeamIdAndDateRange(
      teamId,
      startDate,
      endDate,
    )

    // 按账号分组统计
    const accountMap = new Map()

    for (const record of records) {
      const key = record.accountId
      if (!accountMap.has(key)) {
        accountMap.set(key, {
          accountId: record.accountId,
          platform: record.platform,
          publishCount: 0,
          viewCount: 0,
          likeCount: 0,
          commentCount: 0,
          shareCount: 0,
          followerGrowth: 0,
        })
      }

      const account = accountMap.get(key)
      account.publishCount += record.metrics.publishCount || 0
      account.viewCount += record.metrics.viewCount || 0
      account.likeCount += record.metrics.likeCount || 0
      account.commentCount += record.metrics.commentCount || 0
      account.shareCount += record.metrics.shareCount || 0
      account.followerGrowth += record.metrics.followerGrowth || 0
    }

    return Array.from(accountMap.values())
  }

  async getPlatformStats(teamId: string, startDate: Date, endDate: Date) {
    return await this.analyticsRepository.aggregateByPlatform(
      teamId,
      startDate,
      endDate,
    )
  }

  async getAccountTrend(
    accountId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const records = await this.analyticsRepository.findByAccountIdAndDateRange(
      accountId,
      startDate,
      endDate,
    )

    return records.map(record => ({
      date: record.date,
      ...record.metrics,
    }))
  }

  private aggregateMetrics(records: any[]) {
    const total = {
      publishCount: 0,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      followerGrowth: 0,
    }

    for (const record of records) {
      total.publishCount += record.metrics.publishCount || 0
      total.viewCount += record.metrics.viewCount || 0
      total.likeCount += record.metrics.likeCount || 0
      total.commentCount += record.metrics.commentCount || 0
      total.shareCount += record.metrics.shareCount || 0
      total.followerGrowth += record.metrics.followerGrowth || 0
    }

    return {
      total,
      records: records.length,
      details: records,
    }
  }
}
