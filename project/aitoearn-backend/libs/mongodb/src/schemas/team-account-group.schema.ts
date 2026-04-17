import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { DEFAULT_SCHEMA_OPTIONS } from '../mongodb.constants'
import { WithTimestampSchema } from './timestamp.schema'

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class TeamAccountGroupAccount {
  @Prop({ required: true })
  accountId: string

  @Prop({ required: false })
  nickname?: string

  @Prop({ required: false })
  avatar?: string
}

@Schema({ ...DEFAULT_SCHEMA_OPTIONS, collection: 'teamAccountGroup' })
export class TeamAccountGroup extends WithTimestampSchema {
  id: string

  @Prop({
    required: true,
    index: true,
  })
  teamId: string

  @Prop({
    required: true,
  })
  name: string // 分组名称（如"美食账号组"）

  @Prop({
    required: true,
  })
  platform: string // 平台：douyin, xiaohongshu, kuaishou, bilibili, wechat

  @Prop({
    type: [TeamAccountGroupAccount],
    required: false,
    default: [],
  })
  accounts: TeamAccountGroupAccount[]

  @Prop({
    required: false,
    default: '',
  })
  description: string
}

export const TeamAccountGroupSchema = SchemaFactory.createForClass(TeamAccountGroup)
