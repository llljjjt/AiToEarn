import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { TeamAccountGroup } from '../schemas'
import { BaseRepository } from './base.repository'

@Injectable()
export class TeamAccountGroupRepository extends BaseRepository<TeamAccountGroup> {
  logger = new Logger(TeamAccountGroupRepository.name)

  constructor(
    @InjectModel(TeamAccountGroup.name)
    private readonly teamAccountGroupModel: Model<TeamAccountGroup>,
  ) {
    super(teamAccountGroupModel)
  }

  async findByTeamId(teamId: string): Promise<TeamAccountGroup[]> {
    return await this.teamAccountGroupModel
      .find({ teamId })
      .sort({ createdAt: -1 })
      .lean({ virtuals: true })
      .exec()
  }

  async findByTeamIdAndPlatform(
    teamId: string,
    platform: string,
  ): Promise<TeamAccountGroup[]> {
    return await this.teamAccountGroupModel
      .find({ teamId, platform })
      .lean({ virtuals: true })
      .exec()
  }

  async addAccountToGroup(
    groupId: string,
    account: { accountId: string; nickname?: string; avatar?: string },
  ): Promise<TeamAccountGroup | null> {
    return await this.teamAccountGroupModel
      .findByIdAndUpdate(
        groupId,
        {
          $addToSet: {
            accounts: account,
          },
        },
        { new: true },
      )
      .lean({ virtuals: true })
      .exec()
  }

  async removeAccountFromGroup(
    groupId: string,
    accountId: string,
  ): Promise<TeamAccountGroup | null> {
    return await this.teamAccountGroupModel
      .findByIdAndUpdate(
        groupId,
        {
          $pull: {
            accounts: { accountId },
          },
        },
        { new: true },
      )
      .lean({ virtuals: true })
      .exec()
  }

  async updateGroup(
    id: string,
    updateDto: Partial<TeamAccountGroup>,
  ): Promise<TeamAccountGroup | null> {
    return await this.teamAccountGroupModel
      .findByIdAndUpdate(id, { $set: updateDto }, { new: true })
      .lean({ virtuals: true })
      .exec()
  }
}
