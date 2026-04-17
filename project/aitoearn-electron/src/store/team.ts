/*
 * @Description: 团队管理 Store
 */
import { createPersistStore } from '@/utils/createPersistStore';
import { StoreKey } from '@/utils/StroeEnum';
import { teamApi } from '@/api/team';
import { ITeam, IMember } from '@/api/types/team-t';

export interface ITeamStore {
  // 当前团队信息
  currentTeam?: ITeam;
  // 团队成员列表
  members: IMember[];
  // 加载状态
  loading: boolean;
}

const state: ITeamStore = {
  currentTeam: undefined,
  members: [],
  loading: false,
};

export const useTeamStore = createPersistStore(
  {
    ...state,
  },
  (set, _get) => {
    return {
      // 清空数据
      clear() {
        set({ ...state });
      },

      // 设置当前团队
      setCurrentTeam(team: ITeam) {
        set({ currentTeam: team });
      },

      // 获取我的团队
      async getMyTeam() {
        set({ loading: true });
        try {
          const team = await teamApi.getMyTeam();
          if (team) {
            set({ currentTeam: team });
            // 同时加载成员列表
            this.loadMembers(team._id);
          }
          return team;
        } catch (error) {
          console.error('获取团队信息失败:', error);
          return null;
        } finally {
          set({ loading: false });
        }
      },

      // 创建团队
      async createTeam(data: { name: string; description?: string; feishuWebhook?: string }) {
        set({ loading: true });
        try {
          const team = await teamApi.createTeam(data);
          if (team) {
            set({ currentTeam: team });
          }
          return team;
        } catch (error) {
          console.error('创建团队失败:', error);
          return null;
        } finally {
          set({ loading: false });
        }
      },

      // 更新团队信息
      async updateTeam(id: string, data: { name?: string; description?: string; feishuWebhook?: string }) {
        set({ loading: true });
        try {
          const team = await teamApi.updateTeam(id, data);
          if (team) {
            set({ currentTeam: team });
          }
          return team;
        } catch (error) {
          console.error('更新团队信息失败:', error);
          return null;
        } finally {
          set({ loading: false });
        }
      },

      // 加载成员列表
      async loadMembers(teamId: string) {
        try {
          const members = await teamApi.getTeamMembers(teamId);
          if (members) {
            set({ members });
          }
          return members;
        } catch (error) {
          console.error('加载成员列表失败:', error);
          return [];
        }
      },

      // 添加成员
      async addMember(teamId: string, userId: string) {
        try {
          const member = await teamApi.addMember({ teamId, userId });
          if (member) {
            const currentMembers = _get().members;
            set({ members: [...currentMembers, member] });
          }
          return member;
        } catch (error) {
          console.error('添加成员失败:', error);
          return null;
        }
      },

      // 移除成员
      async removeMember(memberId: string) {
        try {
          const result = await teamApi.removeMember(memberId);
          if (result?.success) {
            const currentMembers = _get().members;
            set({ members: currentMembers.filter(m => m._id !== memberId) });
          }
          return result;
        } catch (error) {
          console.error('移除成员失败:', error);
          return null;
        }
      },
    };
  },
  {
    name: StoreKey.Team,
  },
);
