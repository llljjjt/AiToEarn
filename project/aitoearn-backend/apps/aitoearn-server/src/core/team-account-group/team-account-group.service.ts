import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { TeamAccountGroupRepository } from '@yikart/mongodb'

@Injectable()
export class TeamAccountGroupService {
  private readonly logger = new Logger(TeamAccountGroupService.name)

  constructor(
    private readonly teamAccountGroupRepository: TeamAccountGroupRepository,
  ) {}

  async createGroup(createDto: {
    teamId: string
    name: string
    platform: string
    description?: string
  }) {
    this.logger.log(`Creating account group: ${createDto.name}`)

    const group = await this.teamAccountGroupRepository.create({
      ...createDto,
      accounts: [],
    })

    return group
  }

  async getGroupsByTeamId(teamId: string) {
    return await this.teamAccountGroupRepository.findByTeamId(teamId)
  }

  async getGroupsByTeamIdAndPlatform(teamId: string, platform: string) {
    return await this.teamAccountGroupRepository.findByTeamIdAndPlatform(
      teamId,
      platform,
    )
  }

  async getGroupById(id: string) {
    const group = await this.teamAccountGroupRepository.findById(id)
    if (!group) {
      throw new NotFoundException(`Account group with id ${id} not found`)
    }
    return group
  }

  async updateGroup(
    id: string,
    updateDto: {
      name?: string
      description?: string
    },
  ) {
    this.logger.log(`Updating account group: ${id}`)

    const group = await this.teamAccountGroupRepository.updateGroup(id, updateDto)
    if (!group) {
      throw new NotFoundException(`Account group with id ${id} not found`)
    }

    return group
  }

  async addAccountToGroup(
    groupId: string,
    account: {
      accountId: string
      nickname?: string
      avatar?: string
    },
  ) {
    this.logger.log(`Adding account ${account.accountId} to group ${groupId}`)

    const group = await this.teamAccountGroupRepository.addAccountToGroup(
      groupId,
      account,
    )

    if (!group) {
      throw new NotFoundException(`Account group with id ${groupId} not found`)
    }

    return group
  }

  async removeAccountFromGroup(groupId: string, accountId: string) {
    this.logger.log(`Removing account ${accountId} from group ${groupId}`)

    const group = await this.teamAccountGroupRepository.removeAccountFromGroup(
      groupId,
      accountId,
    )

    if (!group) {
      throw new NotFoundException(`Account group with id ${groupId} not found`)
    }

    return group
  }

  async deleteGroup(id: string) {
    this.logger.log(`Deleting account group: ${id}`)

    const result = await this.teamAccountGroupRepository.deleteById(id)
    if (!result) {
      throw new NotFoundException(`Account group with id ${id} not found`)
    }

    return { success: true }
  }
}
