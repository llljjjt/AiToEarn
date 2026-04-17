/*
 * @Description: 团队管理 API
 */
import http from './request';
import {
  ITeam,
  IMember,
  ITask,
  ITaskStats,
  ITeamAccountGroup,
  IAnalytics,
  IDailyReport,
  IPeriodReport,
  IAccountCompare,
  IPlatformStats,
  ITrendData,
  ICreateTeamParams,
  IUpdateTeamParams,
  IAddMemberParams,
  ICreateTaskParams,
  IUpdateTaskParams,
  ICreateAccountGroupParams,
  IUpdateAccountGroupParams,
  IRecordAnalyticsParams,
} from './types/team-t';

export const teamApi = {
  // ========== 团队管理 ==========

  // 创建团队
  createTeam(data: ICreateTeamParams) {
    return http.post<ITeam>('/team', data);
  },

  // 获取团队信息
  getTeam(id: string) {
    return http.get<ITeam>(`/team/${id}`);
  },

  // 获取我的团队
  getMyTeam() {
    return http.get<ITeam>('/team/owner/me');
  },

  // 更新团队信息
  updateTeam(id: string, data: IUpdateTeamParams) {
    return http.put<ITeam>(`/team/${id}`, data);
  },

  // 删除团队
  deleteTeam(id: string) {
    return http.delete<{ success: boolean }>(`/team/${id}`);
  },

  // ========== 成员管理 ==========

  // 添加成员
  addMember(data: IAddMemberParams) {
    return http.post<IMember>('/members', data);
  },

  // 获取团队成员列表
  getTeamMembers(teamId: string) {
    return http.get<IMember[]>(`/members/team/${teamId}`);
  },

  // 获取我加入的团队
  getMyTeams() {
    return http.get<IMember[]>('/members/my-teams');
  },

  // 获取成员信息
  getMember(id: string) {
    return http.get<IMember>(`/members/${id}`);
  },

  // 移除成员
  removeMember(id: string) {
    return http.delete<{ success: boolean }>(`/members/${id}`);
  },

  // 获取成员数量
  getMemberCount(teamId: string) {
    return http.get<{ count: number }>(`/members/team/${teamId}/count`);
  },

  // ========== 任务管理 ==========

  // 创建任务
  createTask(data: ICreateTaskParams) {
    return http.post<ITask>('/tasks', data);
  },

  // 获取团队任务列表
  getTeamTasks(
    teamId: string,
    params?: {
      status?: string;
      assigneeId?: string;
      creatorId?: string;
    },
  ) {
    return http.get<ITask[]>(`/tasks/team/${teamId}`, { params });
  },

  // 获取任务统计
  getTaskStats(teamId: string) {
    return http.get<ITaskStats>(`/tasks/team/${teamId}/stats`);
  },

  // 获取逾期任务
  getOverdueTasks(teamId: string) {
    return http.get<ITask[]>(`/tasks/team/${teamId}/overdue`);
  },

  // 获取任务详情
  getTask(id: string) {
    return http.get<ITask>(`/tasks/${id}`);
  },

  // 更新任务
  updateTask(id: string, data: IUpdateTaskParams) {
    return http.put<ITask>(`/tasks/${id}`, data);
  },

  // 完成任务
  completeTask(id: string) {
    return http.post<ITask>(`/tasks/${id}/complete`);
  },

  // 删除任务
  deleteTask(id: string) {
    return http.delete<{ success: boolean }>(`/tasks/${id}`);
  },

  // ========== 账号分组管理 ==========

  // 创建账号分组
  createAccountGroup(data: ICreateAccountGroupParams) {
    return http.post<ITeamAccountGroup>('/team-account-groups', data);
  },

  // 获取团队所有分组
  getTeamAccountGroups(teamId: string) {
    return http.get<ITeamAccountGroup[]>(`/team-account-groups/team/${teamId}`);
  },

  // 按平台获取分组
  getAccountGroupsByPlatform(teamId: string, platform: string) {
    return http.get<ITeamAccountGroup[]>(
      `/team-account-groups/team/${teamId}/platform/${platform}`,
    );
  },

  // 获取分组详情
  getAccountGroup(id: string) {
    return http.get<ITeamAccountGroup>(`/team-account-groups/${id}`);
  },

  // 更新分组
  updateAccountGroup(id: string, data: IUpdateAccountGroupParams) {
    return http.put<ITeamAccountGroup>(`/team-account-groups/${id}`, data);
  },

  // 添加账号到分组
  addAccountToGroup(
    groupId: string,
    account: {
      accountId: string;
      nickname?: string;
      avatar?: string;
    },
  ) {
    return http.post<ITeamAccountGroup>(
      `/team-account-groups/${groupId}/accounts`,
      account,
    );
  },

  // 从分组移除账号
  removeAccountFromGroup(groupId: string, accountId: string) {
    return http.delete<ITeamAccountGroup>(
      `/team-account-groups/${groupId}/accounts/${accountId}`,
    );
  },

  // 删除分组
  deleteAccountGroup(id: string) {
    return http.delete<{ success: boolean }>(`/team-account-groups/${id}`);
  },

  // ========== 数据统计 ==========

  // 记录每日数据
  recordAnalytics(data: IRecordAnalyticsParams) {
    return http.post<IAnalytics>('/analytics/record', data);
  },

  // 获取日报
  getDailyReport(teamId: string, date?: string) {
    return http.get<IDailyReport>(`/analytics/daily/${teamId}`, {
      params: { date },
    });
  },

  // 获取周报
  getWeeklyReport(teamId: string, endDate?: string) {
    return http.get<IPeriodReport>(`/analytics/weekly/${teamId}`, {
      params: { endDate },
    });
  },

  // 获取月报
  getMonthlyReport(teamId: string, year?: number, month?: number) {
    return http.get<IPeriodReport>(`/analytics/monthly/${teamId}`, {
      params: { year, month },
    });
  },

  // 获取账号对比数据
  getAccountComparison(teamId: string, startDate: string, endDate: string) {
    return http.get<IAccountCompare[]>(`/analytics/compare/${teamId}`, {
      params: { startDate, endDate },
    });
  },

  // 获取平台统计数据
  getPlatformStats(teamId: string, startDate: string, endDate: string) {
    return http.get<IPlatformStats[]>(`/analytics/platform/${teamId}`, {
      params: { startDate, endDate },
    });
  },

  // 获取账号趋势数据
  getAccountTrend(accountId: string, startDate: string, endDate: string) {
    return http.get<ITrendData[]>(`/analytics/trend/${accountId}`, {
      params: { startDate, endDate },
    });
  },
};
