import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { DEFAULT_SCHEMA_OPTIONS } from '../mongodb.constants'
import { WithTimestampSchema } from './timestamp.schema'

@Schema({ ...DEFAULT_SCHEMA_OPTIONS, collection: 'member' })
export class Member extends WithTimestampSchema {
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
  userId: string

  @Prop({
    required: false,
    default: '',
  })
  nickname: string // 团队内昵称

  @Prop({
    required: true,
    default: true,
  })
  isActive: boolean

  @Prop({
    required: false,
  })
  joinedAt?: Date
}

export const MemberSchema = SchemaFactory.createForClass(Member)

// 创建复合索引，确保同一用户不能重复加入同一团队
MemberSchema.index({ teamId: 1, userId: 1 }, { unique: true })
