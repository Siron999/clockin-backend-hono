import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import {
  DailyLogsInsertType,
  DailyLogsSelectType,
  TasksInsertType,
  TasksSelectType,
  TaskWithDailyLogs,
} from "../model/task.models";
import { DailyLogs, Tasks } from "../model";
import { eq, desc, sql } from "drizzle-orm";
import { PaginatedResponse, PaginationParams } from "../types/types";

export class TaskService {
  dbClient: DrizzleD1Database;

  constructor(db: any) {
    this.dbClient = drizzle(db);
  }

  async createTask(
    userId: number,
    task: TasksInsertType
  ): Promise<TasksSelectType> {
    const taskFields: TasksInsertType = {
      user_id: userId,
      title: task.title,
      allocated_time_per_day_hours: task.allocated_time_per_day_hours,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const newTask = await this.dbClient
      .insert(Tasks)
      .values(taskFields)
      .returning()
      .get();
    return { ...newTask };
  }

  async getTasksWithRecentDailyLogsByUserId(
    userId: number
  ): Promise<TaskWithDailyLogs[]> {
    const tasks = await this.dbClient
      .select()
      .from(Tasks)
      .leftJoin(DailyLogs, eq(Tasks.id, DailyLogs.task_id))
      .where(eq(Tasks.user_id, userId))
      .orderBy(desc(DailyLogs.created_at))
      .limit(5)
      .all();
    const taskMap = new Map<number, TaskWithDailyLogs>();

    tasks.forEach((row) => {
      const { tasks, daily_logs } = row;

      if (!taskMap.has(tasks.id)) {
        taskMap.set(tasks.id, {
          ...tasks,
          daily_logs: [],
        });
      }

      if (daily_logs) {
        taskMap.get(tasks.id)!.daily_logs.push(daily_logs);
      }
    });

    return Array.from(taskMap.values());
  }

  async createDailyLog(
    dailyLog: DailyLogsInsertType
  ): Promise<DailyLogsSelectType> {
    const dailyLogFields: DailyLogsInsertType = {
      task_id: dailyLog.task_id,
      clocked_in: dailyLog.clocked_in,
      clocked_out: dailyLog.clocked_out,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const newDailyLog: DailyLogsSelectType = await this.dbClient
      .insert(DailyLogs)
      .values(dailyLogFields)
      .returning()
      .get();
    return { ...newDailyLog };
  }

  async getDailyLogsByTaskId(
    taskId: number,
    { page = 1, pageSize = 10 }: PaginationParams = {}
  ): Promise<PaginatedResponse<DailyLogsSelectType, "dailyLogs">> {
    try {
      // Get total count
      const countResult = await this.dbClient
        .select({ count: sql`count(*)` })
        .from(DailyLogs)
        .where(eq(DailyLogs.task_id, taskId))
        .get();

      const total = Number(countResult?.count || 0);
      const offset = (page - 1) * pageSize;
      const totalPages = Math.ceil(total / pageSize);

      // Get paginated daily logs
      const dailyLogs = await this.dbClient
        .select()
        .from(DailyLogs)
        .where(eq(DailyLogs.task_id, taskId))
        .limit(pageSize)
        .offset(offset)
        .all();

      return {
        total,
        currentPage: page,
        totalPages,
        pageSize,
        hasMore: page < totalPages,
        dailyLogs,
      };
    } catch (error) {
      console.error("Error fetching daily logs:", error);
      throw error;
    }
  }
}
