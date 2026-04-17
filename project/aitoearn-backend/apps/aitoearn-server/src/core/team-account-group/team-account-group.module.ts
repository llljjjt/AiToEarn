import { Module } from '@nestjs/common'
import { TeamAccountGroupController } from './team-account-group.controller'
import { TeamAccountGroupService } from './team-account-group.service'

@Module({
  providers: [TeamAccountGroupService],
  controllers: [TeamAccountGroupController],
  exports: [TeamAccountGroupService],
})
export class TeamAccountGroupModule {}
