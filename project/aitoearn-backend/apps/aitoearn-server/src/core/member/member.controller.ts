import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@yikart/aitoearn-auth'
import { CurrentUser } from '@yikart/common'
import { MemberService } from './member.service'

@Controller('members')
@UseGuards(JwtAuthGuard)
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  async addMember(
    @Body() createDto: {
      teamId: string
      userId: string
      nickname?: string
    },
  ) {
    return await this.memberService.addMember(createDto)
  }

  @Get('team/:teamId')
  async getTeamMembers(@Param('teamId') teamId: string) {
    return await this.memberService.getTeamMembers(teamId)
  }

  @Get('my-teams')
  async getMyTeams(@CurrentUser() user: any) {
    return await this.memberService.getUserTeams(user.userId)
  }

  @Get(':id')
  async getMember(@Param('id') id: string) {
    return await this.memberService.getMemberById(id)
  }

  @Delete(':id')
  async removeMember(@Param('id') id: string) {
    return await this.memberService.removeMember(id)
  }

  @Get('team/:teamId/count')
  async getTeamMemberCount(@Param('teamId') teamId: string) {
    const count = await this.memberService.getTeamMemberCount(teamId)
    return { count }
  }
}
