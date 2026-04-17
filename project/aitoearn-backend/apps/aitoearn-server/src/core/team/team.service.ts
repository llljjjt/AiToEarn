import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { TeamRepository } from '@yikart/mongodb'

@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name)

  constructor(
    private readonly teamRepository: TeamRepository,
  ) {}

  async createTeam(createDto: {
    name: string
    description?: string
    feishuWebhook?: string
    ownerId: string
  }) {
    this.logger.log(`Creating team: ${createDto.name}`)

    const team = await this.teamRepository.create({
      ...createDto,
      isActive: true,
    })

    return team
  }

  async getTeamById(id: string) {
    const team = await this.teamRepository.findById(id)
    if (!team) {
      throw new NotFoundException(`Team with id ${id} not found`)
    }
    return team
  }

  async getTeamByOwnerId(ownerId: string) {
    return await this.teamRepository.findByOwnerId(ownerId)
  }

  async updateTeam(
    id: string,
    updateDto: {
      name?: string
      description?: string
      feishuWebhook?: string
    },
  ) {
    this.logger.log(`Updating team: ${id}`)

    const team = await this.teamRepository.updateTeam(id, updateDto)
    if (!team) {
      throw new NotFoundException(`Team with id ${id} not found`)
    }

    return team
  }

  async deactivateTeam(id: string) {
    this.logger.log(`Deactivating team: ${id}`)

    const success = await this.teamRepository.deactivateTeam(id)
    if (!success) {
      throw new NotFoundException(`Team with id ${id} not found`)
    }

    return { success: true }
  }
}
