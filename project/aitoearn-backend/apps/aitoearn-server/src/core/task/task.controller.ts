import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@yikart/aitoearn-auth'
import { CurrentUser } from '@yikart/common'
import { TaskService } from './task.service'

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(
    @CurrentUser() user: any,
    @Body() createDto: {
      teamId: string
      title: string
      description?: string
      type: string
      assigneeId?: string
      dueDate?: string
      priority?: string
      relatedContentId?: string
    },
  ) {
    return await this.taskService.createTask({
      ...createDto,
      creatorId: user.userId,
      dueDate: createDto.dueDate ? new Date(createDto.dueDate) : undefined,
    })
  }

  @Get('team/:teamId')
  async getTeamTasks(
    @Param('teamId') teamId: string,
    @Query('status') status?: string,
    @Query('assigneeId') assigneeId?: string,
    @Query('creatorId') creatorId?: string,
  ) {
    return await this.taskService.getTasksByTeamId(teamId, {
      status,
      assigneeId,
      creatorId,
    })
  }

  @Get('team/:teamId/stats')
  async getTaskStats(@Param('teamId') teamId: string) {
    return await this.taskService.getTaskStats(teamId)
  }

  @Get('team/:teamId/overdue')
  async getOverdueTasks(@Param('teamId') teamId: string) {
    return await this.taskService.getOverdueTasks(teamId)
  }

  @Get(':id')
  async getTask(@Param('id') id: string) {
    return await this.taskService.getTaskById(id)
  }

  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateDto: {
      title?: string
      description?: string
      status?: string
      assigneeId?: string
      dueDate?: string
      priority?: string
    },
  ) {
    return await this.taskService.updateTask(id, {
      ...updateDto,
      dueDate: updateDto.dueDate ? new Date(updateDto.dueDate) : undefined,
    })
  }

  @Post(':id/complete')
  async completeTask(@Param('id') id: string) {
    return await this.taskService.completeTask(id)
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return await this.taskService.deleteTask(id)
  }
}
