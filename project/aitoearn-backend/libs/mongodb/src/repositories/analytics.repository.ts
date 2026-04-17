import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Analytics } from '../schemas'
import { BaseRepository } from './base.repository'

@Injectable()
export class AnalyticsRepository extends BaseRepository<Analytics> {
  logger = new Logger(AnalyticsRepository.name)

  constructor(
    @InjectModel(Analytics.name)
    private readonly analyticsModel: Model<Analytics>,
  ) {
    super(analyticsModel)
  }

  async upsertDailyMetrics(
    teamId: string,
    accountId: string,
    platform: string,
    date: Date,
    metrics: Partial<Analytics['metrics']>,
  ): Promise<Analytics | null> {
    const dateOnly = new Date(date)
    dateOnly.setHours(0, 0, 0, 0)

    return await this.analyticsModel
      .findOneAndUpdate(
        { teamId, accountId, date: dateOnly },
        {
          $set: {
            teamId,
            accountId,
            platform,
            date: dateOnly,
            metrics,
          },
        },
        { upsert: true, new: true },
      )
      .lean({ virtuals: true })
      .exec()
  }

  async findByTeamIdAndDateRange(
    teamId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Analytics[]> {
    return await this.analyticsModel
      .find({
        teamId,
        date: { $gte: startDate, $lte: endDate },
      })
      .sort({ date: -1 })
      .lean({ virtuals: true })
      .exec()
  }

  async findByAccountIdAndDateRange(
    accountId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Analytics[]> {
    return await this.analyticsModel
      .find({
        accountId,
        date: { $gte: startDate, $lte: endDate },
      })
      .sort({ date: -1 })
      .lean({ virtuals: true })
      .exec()
  }

  async aggregateByTeamId(
    teamId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    return await this.analyticsModel.aggregate([
      {
        $match: {
          teamId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalPublishCount: { $sum: '$metrics.publishCount' },
          totalViewCount: { $sum: '$metrics.viewCount' },
          totalLikeCount: { $sum: '$metrics.likeCount' },
          totalCommentCount: { $sum: '$metrics.commentCount' },
          totalShareCount: { $sum: '$metrics.shareCount' },
          totalFollowerGrowth: { $sum: '$metrics.followerGrowth' },
        },
      },
    ])
  }

  async aggregateByPlatform(
    teamId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any[]> {
    return await this.analyticsModel.aggregate([
      {
        $match: {
          teamId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$platform',
          publishCount: { $sum: '$metrics.publishCount' },
          viewCount: { $sum: '$metrics.viewCount' },
          likeCount: { $sum: '$metrics.likeCount' },
          commentCount: { $sum: '$metrics.commentCount' },
        },
      },
    ])
  }
}
