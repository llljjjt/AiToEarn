import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { DEFAULT_SCHEMA_OPTIONS } from '../mongodb.constants'
import { WithTimestampSchema } from './timestamp.schema'

@Schema({ ...DEFAULT_SCHEMA_OPTIONS, collection: 'task' })
export class Task extends WithTimestampSchema {
  id: string

  @Prop({
    required: true,
    index: true,
  })
  teamId: string

  @Prop({
    required: true,
  })
  title: string

  @Prop({
    required: false,
    default: '',
  })
  description: string

  @Prop({
    required: true,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
    index: true,
  })
  status: string

  @Prop({
    required: true,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  })
  priority: string

  @Prop({
    required: true,
    index: true,
  })
  creatorId: string // 创建者 User ID

  @Prop({
    required: false,
    index: true,
  })
  assigneeId?: string // 执行者 User ID

  @Prop({
    required: false,
  })
  dueDate?: Date // 截止日期

  @Prop({
    required: false,
  })
  completedAt?: Date

  @Prop({
    type: [String],
    required: false,
    default: [],
  })
  tags: string[] // 标签
}

export const TaskSchema = SchemaFactory.createForClass(Task)
