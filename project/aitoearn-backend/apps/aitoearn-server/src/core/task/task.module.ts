import { Module } from '@nestjs/common'
import { TaskController } from './task.controller'
import { TaskService } from './task.service'

@Module({
  providers: [TaskService],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}
