import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common'
import { MemberRepository, UserRepository } from '@yikart/mongodb'

@Injectable()
export class MemberService {
  private readonly logger = new Logger(MemberService.name)

  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async addMember(createDto: {
    teamId: string
    userId: string
    nickname?: string
  }) {
    this.logger.log(`Adding member to team: ${createDto.teamId}`)

    // 检查用户是否存在
    const user = await this.userRepository.findById(createDto.userId)
    if (!user) {
      throw new NotFoundException(`User with id ${createDto.userId} not found`)
    }

    // 检查是否已经是成员
    const existingMember = await this.memberRepository.findByTeamIdAndUserId(
      createDto.teamId,
      createDto.userId,
    )
    if (existingMember) {
      throw new ConflictException('User is already a member of this team')
    }

    const member = await this.memberRepository.createMember({
      ...createDto,
      isActive: true,
      joinedAt: new Date(),
    })

    return member
  }

  async getTeamMembers(teamId: string) {
    return await this.memberRepository.findByTeamId(teamId)
  }

  async getMemberById(id: string) {
    const member = await this.memberRepository.findById(id)
    if (!member) {
      throw new NotFoundException(`Member with id ${id} not found`)
    }
    return member
  }

  async removeMember(id: string) {
    this.logger.log(`Removing member: ${id}`)

    const success = await this.memberRepository.deactivateMember(id)
    if (!success) {
      throw new NotFoundException(`Member with id ${id} not found`)
    }

    return { success: true }
  }

  async getUserTeams(userId: string) {
    return await this.memberRepository.findUserTeams(userId)
  }

  async getTeamMemberCount(teamId: string) {
    return await this.memberRepository.countByTeamId(teamId)
  }
}
