import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { DEFAULT_SCHEMA_OPTIONS } from '../mongodb.constants'
import { WithTimestampSchema } from './timestamp.schema'

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class AnalyticsMetrics {
  @Prop({ required: true, default: 0 })
  publishCount: number // 发布量

  @Prop({ required: true, default: 0 })
  viewCount: number // 浏览量

  @Prop({ required: true, default: 0 })
  likeCount: number // 点赞数

  @Prop({ required: true, default: 0 })
  commentCount: number // 评论数

  @Prop({ required: true, default: 0 })
  shareCount: number // 分享数

  @Prop({ required: true, default: 0 })
  followerCount: number // 粉丝数

  @Prop({ required: true, default: 0 })
  followerGrowth: number // 粉丝增长
}

@Schema({ ...DEFAULT_SCHEMA_OPTIONS, collection: 'analytics' })
export class Analytics extends WithTimestampSchema {
  id: string

  @Prop({
    required: true,
    index: true,
  })
  teamId: string

  @Prop({
    required: true,
    index: true,
  })
  accountId: string

  @Prop({
    required: true,
  })
  platform: string // 平台：douyin, xiaohongshu, kuaishou, bilibili, wechat

  @Prop({
    required: true,
    index: true,
  })
  date: Date // 统计日期（按天）

  @Prop({
    type: AnalyticsMetrics,
    required: true,
    default: {},
  })
  metrics: AnalyticsMetrics
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics)

// 创建复合索引，确保同一账号同一天只有一条记录
AnalyticsSchema.index({ teamId: 1, accountId: 1, date: 1 }, { unique: true })
