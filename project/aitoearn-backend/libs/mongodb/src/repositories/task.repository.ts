import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, RootFilterQuery } from 'mongoose'
import { Task } from '../schemas'
import { BaseRepository } from './base.repository'

@Injectable()
export class TaskRepository extends BaseRepository<Task> {
  logger = new Logger(TaskRepository.name)

  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<Task>,
  ) {
    super(taskModel)
  }

  async findByTeamId(
    teamId: string,
    filter?: {
      status?: string
      assigneeId?: string
      creatorId?: string
    },
  ): Promise<Task[]> {
    const query: RootFilterQuery<Task> = { teamId }

    if (filter?.status) {
      query.status = filter.status
    }
    if (filter?.assigneeId) {
      query.assigneeId = filter.assigneeId
    }
    if (filter?.creatorId) {
      query.creatorId = filter.creatorId
    }

    return await this.taskModel
      .find(query)
      .sort({ createdAt: -1 })
      .lean({ virtuals: true })
      .exec()
  }

  async updateTask(id: string, updateDto: Partial<Task>): Promise<Task | null> {
    return await this.taskModel
      .findByIdAndUpdate(id, { $set: updateDto }, { new: true })
      .lean({ virtuals: true })
      .exec()
  }

  async completeTask(id: string): Promise<Task | null> {
    return await this.taskModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            status: 'completed',
            completedAt: new Date(),
          },
        },
        { new: true },
      )
      .lean({ virtuals: true })
      .exec()
  }

  async countByTeamId(
    teamId: string,
    filter?: { status?: string },
  ): Promise<number> {
    const query: RootFilterQuery<Task> = { teamId }
    if (filter?.status) {
      query.status = filter.status
    }
    return await this.taskModel.countDocuments(query)
  }

  async findOverdueTasks(teamId: string): Promise<Task[]> {
    return await this.taskModel
      .find({
        teamId,
        status: { $in: ['pending', 'in_progress'] },
        dueDate: { $lt: new Date() },
      })
      .lean({ virtuals: true })
      .exec()
  }
}
