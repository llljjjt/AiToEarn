/*
 * @Description: 数据统计 Store
 */
import { createPersistStore } from '@/utils/createPersistStore';
import { StoreKey } from '@/utils/StroeEnum';
import { teamApi } from '@/api/team';
import {
  IDailyReport,
  IPeriodReport,
  IAccountCompare,
  IPlatformStats,
  ITrendData,
} from '@/api/types/team-t';

export interface IAnalyticsStore {
  // 日报数据
  dailyReport?: IDailyReport;
  // 周报数据
  weeklyReport?: IPeriodReport;
  // 月报数据
  monthlyReport?: IPeriodReport;
  // 账号对比数据
  accountComparison: IAccountCompare[];
  // 平台统计数据
  platformStats: IPlatformStats[];
  // 趋势数据
  trendData: ITrendData[];
  // 加载状态
  loading: boolean;
}

const state: IAnalyticsStore = {
  dailyReport: undefined,
  weeklyReport: undefined,
  monthlyReport: undefined,
  accountComparison: [],
  platformStats: [],
  trendData: [],
  loading: false,
};

export const useAnalyticsStore = createPersistStore(
  {
    ...state,
  },
  (set, _get) => {
    return {
      // 清空数据
      clear() {
        set({ ...state });
      },

      // 获取日报
      async getDailyReport(teamId: string, date?: string) {
        set({ loading: true });
        try {
          const report = await teamApi.getDailyReport(teamId, date);
          if (report) {
            set({ dailyReport: report });
          }
          return report;
        } catch (error) {
          console.error('获取日报失败:', error);
          return null;
        } finally {
          set({ loading: false });
        }
      },

      // 获取周报
      async getWeeklyReport(teamId: string, endDate?: string) {
        set({ loading: true });
        try {
          const report = await teamApi.getWeeklyReport(teamId, endDate);
          if (report) {
            set({ weeklyReport: report });
          }
          return report;
        } catch (error) {
          console.error('获取周报失败:', error);
          return null;
        } finally {
          set({ loading: false });
        }
      },

      // 获取月报
      async getMonthlyReport(teamId: string, year?: number, month?: number) {
        set({ loading: true });
        try {
          const report = await teamApi.getMonthlyReport(teamId, year, month);
          if (report) {
            set({ monthlyReport: report });
          }
          return report;
        } catch (error) {
          console.error('获取月报失败:', error);
          return null;
        } finally {
          set({ loading: false });
        }
      },

      // 获取账号对比数据
      async getAccountComparison(teamId: string, startDate: string, endDate: string) {
        set({ loading: true });
        try {
          const data = await teamApi.getAccountComparison(teamId, startDate, endDate);
          if (data) {
            set({ accountComparison: data });
          }
          return data;
        } catch (error) {
          console.error('获取账号对比数据失败:', error);
          return [];
        } finally {
          set({ loading: false });
        }
      },

      // 获取平台统计数据
      async getPlatformStats(teamId: string, startDate: string, endDate: string) {
        set({ loading: true });
        try {
          const data = await teamApi.getPlatformStats(teamId, startDate, endDate);
          if (data) {
            set({ platformStats: data });
          }
          return data;
        } catch (error) {
          console.error('获取平台统计数据失败:', error);
          return [];
        } finally {
          set({ loading: false });
        }
      },

      // 获取账号趋势数据
      async getAccountTrend(accountId: string, startDate: string, endDate: string) {
        set({ loading: true });
        try {
          const data = await teamApi.getAccountTrend(accountId, startDate, endDate);
          if (data) {
            set({ trendData: data });
          }
          return data;
        } catch (error) {
          console.error('获取趋势数据失败:', error);
          return [];
        } finally {
          set({ loading: false });
        }
      },

      // 记录每日数据
      async recordAnalytics(data: {
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
      }) {
        try {
          const result = await teamApi.recordAnalytics(data);
          return result;
        } catch (error) {
          console.error('记录数据失败:', error);
          return null;
        }
      },
    };
  },
  {
    name: StoreKey.Analytics,
  },
);
