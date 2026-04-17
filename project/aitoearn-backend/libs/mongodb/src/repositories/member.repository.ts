import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Member } from '../schemas'
import { BaseRepository } from './base.repository'

@Injectable()
export class MemberRepository extends BaseRepository<Member> {
  logger = new Logger(MemberRepository.name)

  constructor(
    @InjectModel(Member.name)
    private readonly memberModel: Model<Member>,
  ) {
    super(memberModel)
  }

  async findByTeamId(teamId: string): Promise<Member[]> {
    return await this.memberModel
      .find({ teamId, isActive: true })
      .sort({ joinedAt: -1 })
      .lean({ virtuals: true })
      .exec()
  }

  async findByTeamIdAndUserId(teamId: string, userId: string): Promise<Member | null> {
    return await this.memberModel
      .findOne({ teamId, userId })
      .lean({ virtuals: true })
      .exec()
  }

  async createMember(memberData: Partial<Member>): Promise<Member> {
    const member = new this.memberModel({
      ...memberData,
      joinedAt: new Date(),
      isActive: true,
    })
    return await member.save()
  }

  async deactivateMember(id: string): Promise<boolean> {
    const result = await this.memberModel.updateOne(
      { _id: id },
      { $set: { isActive: false } },
    )
    return result.modifiedCount > 0
  }

  async countByTeamId(teamId: string): Promise<number> {
    return await this.memberModel.countDocuments({ teamId, isActive: true })
  }

  async findUserTeams(userId: string): Promise<Member[]> {
    return await this.memberModel
      .find({ userId, isActive: true })
      .lean({ virtuals: true })
      .exec()
  }
}
