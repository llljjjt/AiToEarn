/*
 * @Description: 账号分组管理 Store
 */
import { createPersistStore } from '@/utils/createPersistStore';
import { StoreKey } from '@/utils/StroeEnum';
import { teamApi } from '@/api/team';
import { ITeamAccountGroup } from '@/api/types/team-t';

export interface IAccountGroupStore {
  // 分组列表
  groups: ITeamAccountGroup[];
  // 加载状态
  loading: boolean;
}

const state: IAccountGroupStore = {
  groups: [],
  loading: false,
};

export const useAccountGroupStore = createPersistStore(
  {
    ...state,
  },
  (set, _get) => {
    return {
      // 清空数据
      clear() {
        set({ ...state });
      },

      // 加载分组列表
      async loadGroups(teamId: string) {
        set({ loading: true });
        try {
          const groups = await teamApi.getTeamAccountGroups(teamId);
          if (groups) {
            set({ groups });
          }
          return groups;
        } catch (error) {
          console.error('加载分组列表失败:', error);
          return [];
        } finally {
          set({ loading: false });
        }
      },

      // 按平台加载分组
      async loadGroupsByPlatform(teamId: string, platform: string) {
        set({ loading: true });
        try {
          const groups = await teamApi.getAccountGroupsByPlatform(teamId, platform);
          return groups || [];
        } catch (error) {
          console.error('加载平台分组失败:', error);
          return [];
        } finally {
          set({ loading: false });
        }
      },

      // 创建分组
      async createGroup(data: {
        teamId: string;
        name: string;
        platform: string;
        description?: string;
      }) {
        set({ loading: true });
        try {
          const group = await teamApi.createAccountGroup(data);
          if (group) {
            const currentGroups = _get().groups;
            set({ groups: [group, ...currentGroups] });
          }
          return group;
        } catch (error) {
          console.error('创建分组失败:', error);
          return null;
        } finally {
          set({ loading: false });
        }
      },

      // 更新分组
      async updateGroup(
        groupId: string,
        data: {
          name?: string;
          description?: string;
        },
      ) {
        try {
          const group = await teamApi.updateAccountGroup(groupId, data);
          if (group) {
            const currentGroups = _get().groups;
            set({
              groups: currentGroups.map(g => (g._id === groupId ? group : g)),
            });
          }
          return group;
        } catch (error) {
          console.error('更新分组失败:', error);
          return null;
        }
      },

      // 添加账号到分组
      async addAccountToGroup(
        groupId: string,
        account: {
          accountId: string;
          nickname?: string;
          avatar?: string;
        },
      ) {
        try {
          const group = await teamApi.addAccountToGroup(groupId, account);
          if (group) {
            const currentGroups = _get().groups;
            set({
              groups: currentGroups.map(g => (g._id === groupId ? group : g)),
            });
          }
          return group;
        } catch (error) {
          console.error('添加账号到分组失败:', error);
          return null;
        }
      },

      // 从分组移除账号
      async removeAccountFromGroup(groupId: string, accountId: string) {
        try {
          const group = await teamApi.removeAccountFromGroup(groupId, accountId);
          if (group) {
            const currentGroups = _get().groups;
            set({
              groups: currentGroups.map(g => (g._id === groupId ? group : g)),
            });
          }
          return group;
        } catch (error) {
          console.error('从分组移除账号失败:', error);
          return null;
        }
      },

      // 删除分组
      async deleteGroup(groupId: string) {
        try {
          const result = await teamApi.deleteAccountGroup(groupId);
          if (result?.success) {
            const currentGroups = _get().groups;
            set({ groups: currentGroups.filter(g => g._id !== groupId) });
          }
          return result;
        } catch (error) {
          console.error('删除分组失败:', error);
          return null;
        }
      },
    };
  },
  {
    name: StoreKey.AccountGroup,
  },
);
