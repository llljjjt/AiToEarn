import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'

export interface FeishuMessageCard {
  title: string
  content: string
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'grey'
  fields?: Array<{
    name: string
    value: string
  }>
}

@Injectable()
export class FeishuService {
  private readonly logger = new Logger(FeishuService.name)

  constructor(private readonly httpService: HttpService) {}

  async sendTextMessage(webhookUrl: string, text: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(webhookUrl, {
          msg_type: 'text',
          content: {
            text,
          },
        }),
      )

      this.logger.log('Feishu text message sent successfully')
      return response.data
    }
    catch (error) {
      this.logger.error('Failed to send Feishu text message', error)
      throw error
    }
  }

  async sendCardMessage(webhookUrl: string, card: FeishuMessageCard) {
    try {
      const elements = [
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: card.content,
          },
        },
      ]

      // 添加字段
      if (card.fields && card.fields.length > 0) {
        for (const field of card.fields) {
          elements.push({
            tag: 'div',
            fields: [
              {
                is_short: true,
                text: {
                  tag: 'lark_md',
                  content: `**${field.name}**\n${field.value}`,
                },
              },
            ],
          } as any)
        }
      }

      const response = await firstValueFrom(
        this.httpService.post(webhookUrl, {
          msg_type: 'interactive',
          card: {
            header: {
              title: {
                tag: 'plain_text',
                content: card.title,
              },
              template: card.color || 'blue',
            },
            elements,
          },
        }),
      )

      this.logger.log('Feishu card message sent successfully')
      return response.data
    }
    catch (error) {
      this.logger.error('Failed to send Feishu card message', error)
      throw error
    }
  }

  async sendTaskNotification(
    webhookUrl: string,
    data: {
      taskTitle: string
      assigneeName: string
      creatorName: string
      dueDate?: Date
      priority: string
    },
  ) {
    const fields = [
      { name: '创建人', value: data.creatorName },
      { name: '负责人', value: data.assigneeName },
      { name: '优先级', value: this.getPriorityText(data.priority) },
    ]

    if (data.dueDate) {
      fields.push({
        name: '截止时间',
        value: this.formatDate(data.dueDate),
      })
    }

    return await this.sendCardMessage(webhookUrl, {
      title: '📋 新任务分配',
      content: `**${data.taskTitle}**`,
      color: 'blue',
      fields,
    })
  }

  async sendTaskCompletedNotification(
    webhookUrl: string,
    data: {
      taskTitle: string
      completedBy: string
      completedAt: Date
    },
  ) {
    return await this.sendCardMessage(webhookUrl, {
      title: '✅ 任务已完成',
      content: `**${data.taskTitle}**`,
      color: 'green',
      fields: [
        { name: '完成人', value: data.completedBy },
        { name: '完成时间', value: this.formatDate(data.completedAt) },
      ],
    })
  }

  async sendPublishSuccessNotification(
    webhookUrl: string,
    data: {
      contentTitle: string
      platform: string
      accountName: string
      publishedBy: string
      url?: string
    },
  ) {
    const content = data.url
      ? `**${data.contentTitle}**\n[查看内容](${data.url})`
      : `**${data.contentTitle}**`

    return await this.sendCardMessage(webhookUrl, {
      title: '🚀 内容发布成功',
      content,
      color: 'green',
      fields: [
        { name: '平台', value: this.getPlatformText(data.platform) },
        { name: '账号', value: data.accountName },
        { name: '发布人', value: data.publishedBy },
      ],
    })
  }

  async sendPublishFailedNotification(
    webhookUrl: string,
    data: {
      contentTitle: string
      platform: string
      accountName: string
      errorMessage: string
    },
  ) {
    return await this.sendCardMessage(webhookUrl, {
      title: '❌ 内容发布失败',
      content: `**${data.contentTitle}**\n\n错误信息：${data.errorMessage}`,
      color: 'red',
      fields: [
        { name: '平台', value: this.getPlatformText(data.platform) },
        { name: '账号', value: data.accountName },
      ],
    })
  }

  async sendDailyReport(
    webhookUrl: string,
    data: {
      date: Date
      publishCount: number
      viewCount: number
      likeCount: number
      commentCount: number
      followerGrowth: number
    },
  ) {
    return await this.sendCardMessage(webhookUrl, {
      title: '📊 每日数据报告',
      content: `**${this.formatDate(data.date)}**`,
      color: 'blue',
      fields: [
        { name: '发布量', value: `${data.publishCount} 条` },
        { name: '浏览量', value: this.formatNumber(data.viewCount) },
        { name: '点赞数', value: this.formatNumber(data.likeCount) },
        { name: '评论数', value: this.formatNumber(data.commentCount) },
        { name: '粉丝增长', value: `+${this.formatNumber(data.followerGrowth)}` },
      ],
    })
  }

  private getPriorityText(priority: string): string {
    const map: Record<string, string> = {
      high: '🔴 高',
      medium: '🟡 中',
      low: '🟢 低',
    }
    return map[priority] || priority
  }

  private getPlatformText(platform: string): string {
    const map: Record<string, string> = {
      douyin: '抖音',
      xiaohongshu: '小红书',
      kuaishou: '快手',
      bilibili: 'B站',
      wechat: '公众号',
    }
    return map[platform] || platform
  }

  private formatDate(date: Date): string {
    return new Date(date).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  private formatNumber(num: number): string {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`
    }
    return num.toString()
  }
}
