import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@yikart/aitoearn-auth'
import { TeamAccountGroupService } from './team-account-group.service'

@Controller('team-account-groups')
@UseGuards(JwtAuthGuard)
export class TeamAccountGroupController {
  constructor(
    private readonly teamAccountGroupService: TeamAccountGroupService,
  ) {}

  @Post()
  async createGroup(
    @Body() createDto: {
      teamId: string
      name: string
      platform: string
      description?: string
    },
  ) {
    return await this.teamAccountGroupService.createGroup(createDto)
  }

  @Get('team/:teamId')
  async getTeamGroups(@Param('teamId') teamId: string) {
    return await this.teamAccountGroupService.getGroupsByTeamId(teamId)
  }

  @Get('team/:teamId/platform/:platform')
  async getTeamGroupsByPlatform(
    @Param('teamId') teamId: string,
    @Param('platform') platform: string,
  ) {
    return await this.teamAccountGroupService.getGroupsByTeamIdAndPlatform(
      teamId,
      platform,
    )
  }

  @Get(':id')
  async getGroup(@Param('id') id: string) {
    return await this.teamAccountGroupService.getGroupById(id)
  }

  @Patch(':id')
  async updateGroup(
    @Param('id') id: string,
    @Body() updateDto: {
      name?: string
      description?: string
    },
  ) {
    return await this.teamAccountGroupService.updateGroup(id, updateDto)
  }

  @Post(':id/accounts')
  async addAccount(
    @Param('id') id: string,
    @Body() accountDto: {
      accountId: string
      nickname?: string
      avatar?: string
    },
  ) {
    return await this.teamAccountGroupService.addAccountToGroup(id, accountDto)
  }

  @Delete(':id/accounts/:accountId')
  async removeAccount(
    @Param('id') id: string,
    @Param('accountId') accountId: string,
  ) {
    return await this.teamAccountGroupService.removeAccountFromGroup(
      id,
      accountId,
    )
  }

  @Delete(':id')
  async deleteGroup(@Param('id') id: string) {
    return await this.teamAccountGroupService.deleteGroup(id)
  }
}
