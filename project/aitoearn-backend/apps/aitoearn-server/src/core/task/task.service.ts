import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { TaskRepository } from '@yikart/mongodb'

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name)

  constructor(
    private readonly taskRepository: TaskRepository,
  ) {}

  async createTask(createDto: {
    teamId: string
    title: string
    description?: string
    type: string
    assigneeId?: string
    creatorId: string
    dueDate?: Date
    priority?: string
    relatedContentId?: string
  }) {
    this.logger.log(`Creating task: ${createDto.title}`)

    const task = await this.taskRepository.create({
      ...createDto,
      status: 'pending',
    })

    return task
  }

  async getTasksByTeamId(
    teamId: string,
    filter?: {
      status?: string
      assigneeId?: string
      creatorId?: string
    },
  ) {
    return await this.taskRepository.findByTeamId(teamId, filter)
  }

  async getTaskById(id: string) {
    const task = await this.taskRepository.findById(id)
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`)
    }
    return task
  }

  async updateTask(
    id: string,
    updateDto: {
      title?: string
      description?: string
      status?: string
      assigneeId?: string
      dueDate?: Date
      priority?: string
    },
  ) {
    this.logger.log(`Updating task: ${id}`)

    const task = await this.taskRepository.updateTask(id, updateDto)
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`)
    }

    return task
  }

  async completeTask(id: string) {
    this.logger.log(`Completing task: ${id}`)

    const task = await this.taskRepository.completeTask(id)
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`)
    }

    return task
  }

  async deleteTask(id: string) {
    this.logger.log(`Deleting task: ${id}`)

    const result = await this.taskRepository.deleteById(id)
    if (!result) {
      throw new NotFoundException(`Task with id ${id} not found`)
    }

    return { success: true }
  }

  async getTaskStats(teamId: string) {
    const [total, pending, inProgress, completed] = await Promise.all([
      this.taskRepository.countByTeamId(teamId),
      this.taskRepository.countByTeamId(teamId, { status: 'pending' }),
      this.taskRepository.countByTeamId(teamId, { status: 'in_progress' }),
      this.taskRepository.countByTeamId(teamId, { status: 'completed' }),
    ])

    return {
      total,
      pending,
      inProgress,
      completed,
    }
  }

  async getOverdueTasks(teamId: string) {
    return await this.taskRepository.findOverdueTasks(teamId)
  }
}
