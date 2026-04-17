import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { DEFAULT_SCHEMA_OPTIONS } from '../mongodb.constants'
import { WithTimestampSchema } from './timestamp.schema'

@Schema({ ...DEFAULT_SCHEMA_OPTIONS, collection: 'team' })
export class Team extends WithTimestampSchema {
  id: string

  @Prop({
    required: true,
  })
  name: string

  @Prop({
    required: false,
    default: '',
  })
  description: string

  @Prop({
    required: false,
  })
  feishuWebhook?: string // 飞书群机器人 Webhook URL

  @Prop({
    required: true,
    default: true,
  })
  isActive: boolean

  @Prop({
    required: false,
  })
  ownerId?: string // 团队创建者/所有者 User ID
}

export const TeamSchema = SchemaFactory.createForClass(Team)
