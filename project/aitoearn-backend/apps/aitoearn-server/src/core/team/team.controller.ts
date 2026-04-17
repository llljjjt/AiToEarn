import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@yikart/aitoearn-auth'
import { CurrentUser } from '@yikart/common'
import { TeamService } from './team.service'

@Controller('team')
@UseGuards(JwtAuthGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  async createTeam(
    @CurrentUser() user: any,
    @Body() createDto: {
      name: string
      description?: string
      feishuWebhook?: string
    },
  ) {
    return await this.teamService.createTeam({
      ...createDto,
      ownerId: user.userId,
    })
  }

  @Get(':id')
  async getTeam(@Param('id') id: string) {
    return await this.teamService.getTeamById(id)
  }

  @Get('owner/me')
  async getMyTeam(@CurrentUser() user: any) {
    return await this.teamService.getTeamByOwnerId(user.userId)
  }

  @Patch(':id')
  async updateTeam(
    @Param('id') id: string,
    @Body() updateDto: {
      name?: string
      description?: string
      feishuWebhook?: string
    },
  ) {
    return await this.teamService.updateTeam(id, updateDto)
  }

  @Delete(':id')
  async deleteTeam(@Param('id') id: string) {
    return await this.teamService.deactivateTeam(id)
  }
}
