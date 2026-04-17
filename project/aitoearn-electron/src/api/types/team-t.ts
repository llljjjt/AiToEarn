/*
 * @Description: 团队相关类型定义
 */

// 团队信息
export interface ITeam {
  _id: string;
  name: string;
  description?: string;
  ownerId: string;
  feishuWebhook?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 成员信息
export interface IMember {
  _id: string;
  teamId: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  isActive: boolean;
  joinedAt: string;
}

// 任务信息
export interface ITask {
  _id: string;
  teamId: string;
  title: string;
  description?: string;
  assigneeId?: string;
  assigneeName?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 任务统计
export interface ITaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

// 分组中的账号信息
export interface IGroupAccount {
  accountId: string;
  nickname?: string;
  avatar?: string;
  addedAt: string;
}

// 账号分组
export interface ITeamAccountGroup {
  _id: string;
  teamId: string;
  name: string;
  platform: string;
  accounts: IGroupAccount[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// 数据统计
export interface IAnalytics {
  _id: string;
  teamId: string;
  accountId: string;
  accountName?: string;
  platform: string;
  date: string;
  publishCount: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  followerGrowth: number;
}

// 日报数据
export interface IDailyReport {
  date: string;
  totalPublish: number;
  totalView: number;
  totalLike: number;
  totalComment: number;
  totalShare: number;
  totalFollowerGrowth: number;
  accounts: IAnalytics[];
}

// 周报/月报数据
export interface IPeriodReport {
  startDate: string;
  endDate: string;
  totalPublish: number;
  totalView: number;
  totalLike: number;
  totalComment: number;
  totalShare: number;
  totalFollowerGrowth: number;
  dailyData: {
    date: string;
    publishCount: number;
    viewCount: number;
    likeCount: number;
  }[];
}

// 账号对比数据
export interface IAccountCompare {
  accountId: string;
  accountName: string;
  platform: string;
  publishCount: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  followerGrowth: number;
}

// 平台统计数据
export interface IPlatformStats {
  platform: string;
  accountCount: number;
  publishCount: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
}

// 趋势数据
export interface ITrendData {
  date: string;
  publishCount: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  followerCount: number;
}

// 创建团队参数
export interface ICreateTeamParams {
  name: string;
  description?: string;
  feishuWebhook?: string;
}

// 更新团队参数
export interface IUpdateTeamParams {
  name?: string;
  description?: string;
  feishuWebhook?: string;
}

// 添加成员参数
export interface IAddMemberParams {
  teamId: string;
  userId: string;
}

// 创建任务参数
export interface ICreateTaskParams {
  teamId: string;
  title: string;
  description?: string;
  assigneeId?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

// 更新任务参数
export interface IUpdateTaskParams {
  title?: string;
  description?: string;
  assigneeId?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

// 创建账号分组参数
export interface ICreateAccountGroupParams {
  teamId: string;
  name: string;
  platform: string;
  description?: string;
}

// 更新账号分组参数
export interface IUpdateAccountGroupParams {
  name?: string;
  description?: string;
}

// 记录数据参数
export interface IRecordAnalyticsParams {
  teamId: string;
  accountId: string;
  platform: string;
  date: string;
  publishCount: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  followerGrowth: number;
}
