import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Team } from '../schemas'
import { BaseRepository } from './base.repository'

@Injectable()
export class TeamRepository extends BaseRepository<Team> {
  logger = new Logger(TeamRepository.name)

  constructor(
    @InjectModel(Team.name)
    private readonly teamModel: Model<Team>,
  ) {
    super(teamModel)
  }

  async findByOwnerId(ownerId: string): Promise<Team | null> {
    return await this.teamModel
      .findOne({ ownerId, isActive: true })
      .lean({ virtuals: true })
      .exec()
  }

  async updateTeam(id: string, updateDto: Partial<Team>): Promise<Team | null> {
    return await this.teamModel
      .findByIdAndUpdate(id, { $set: updateDto }, { new: true })
      .lean({ virtuals: true })
      .exec()
  }

  async deactivateTeam(id: string): Promise<boolean> {
    const result = await this.teamModel.updateOne(
      { _id: id },
      { $set: { isActive: false } },
    )
    return result.modifiedCount > 0
  }
}
