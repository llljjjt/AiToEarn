/*
 * @Description: 任务管理 Store
 */
import { createPersistStore } from '@/utils/createPersistStore';
import { StoreKey } from '@/utils/StroeEnum';
import { teamApi } from '@/api/team';
import { ITask, ITaskStats } from '@/api/types/team-t';

export interface ITaskStore {
  // 任务列表
  tasks: ITask[];
  // 任务统计
  stats?: ITaskStats;
  // 加载状态
  loading: boolean;
}

const state: ITaskStore = {
  tasks: [],
  stats: undefined,
  loading: false,
};

export const useTaskStore = createPersistStore(
  {
    ...state,
  },
  (set, _get) => {
    return {
      // 清空数据
      clear() {
        set({ ...state });
      },

      // 加载任务列表
      async loadTasks(teamId: string, filters?: { status?: string; assigneeId?: string }) {
        set({ loading: true });
        try {
          const tasks = await teamApi.getTeamTasks(teamId, filters);
          if (tasks) {
            set({ tasks });
          }
          return tasks;
        } catch (error) {
          console.error('加载任务列表失败:', error);
          return [];
        } finally {
          set({ loading: false });
        }
      },

      // 加载任务统计
      async loadStats(teamId: string) {
        try {
          const stats = await teamApi.getTaskStats(teamId);
          if (stats) {
            set({ stats });
          }
          return stats;
        } catch (error) {
          console.error('加载任务统计失败:', error);
          return null;
        }
      },

      // 创建任务
      async createTask(data: {
        teamId: string;
        title: string;
        description?: string;
        assigneeId?: string;
        priority?: 'low' | 'medium' | 'high';
        dueDate?: string;
      }) {
        set({ loading: true });
        try {
          const task = await teamApi.createTask(data);
          if (task) {
            const currentTasks = _get().tasks;
            set({ tasks: [task, ...currentTasks] });
            // 刷新统计
            this.loadStats(data.teamId);
          }
          return task;
        } catch (error) {
          console.error('创建任务失败:', error);
          return null;
        } finally {
          set({ loading: false });
        }
      },

      // 更新任务
      async updateTask(
        taskId: string,
        data: {
          title?: string;
          description?: string;
          assigneeId?: string;
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
          priority?: 'low' | 'medium' | 'high';
          dueDate?: string;
        },
      ) {
        try {
          const task = await teamApi.updateTask(taskId, data);
          if (task) {
            const currentTasks = _get().tasks;
            set({
              tasks: currentTasks.map(t => (t._id === taskId ? task : t)),
            });
            // 刷新统计
            if (task.teamId) {
              this.loadStats(task.teamId);
            }
          }
          return task;
        } catch (error) {
          console.error('更新任务失败:', error);
          return null;
        }
      },

      // 完成任务
      async completeTask(taskId: string) {
        try {
          const task = await teamApi.completeTask(taskId);
          if (task) {
            const currentTasks = _get().tasks;
            set({
              tasks: currentTasks.map(t => (t._id === taskId ? task : t)),
            });
            // 刷新统计
            if (task.teamId) {
              this.loadStats(task.teamId);
            }
          }
          return task;
        } catch (error) {
          console.error('完成任务失败:', error);
          return null;
        }
      },

      // 删除任务
      async deleteTask(taskId: string, teamId: string) {
        try {
          const result = await teamApi.deleteTask(taskId);
          if (result?.success) {
            const currentTasks = _get().tasks;
            set({ tasks: currentTasks.filter(t => t._id !== taskId) });
            // 刷新统计
            this.loadStats(teamId);
          }
          return result;
        } catch (error) {
          console.error('删除任务失败:', error);
          return null;
        }
      },

      // 获取逾期任务
      async getOverdueTasks(teamId: string) {
        try {
          const tasks = await teamApi.getOverdueTasks(teamId);
          return tasks || [];
        } catch (error) {
          console.error('获取逾期任务失败:', error);
          return [];
        }
      },
    };
  },
  {
    name: StoreKey.Task,
  },
);
