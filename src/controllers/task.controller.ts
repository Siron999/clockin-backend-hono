import { Context } from "hono";
import { TaskService } from "../service/tasks.service";
import logger from "../configs/logger.config";
import { DailyLogsInsertType, TasksInsertType } from "../model/task.models";
import { responseDTO } from "../dto/responseDTO";
import { HTTPException } from "hono/http-exception";

const createTask = async (ctx: Context): Promise<Response> => {
  try {
    const userId = ctx.get("user").id;
    const task: TasksInsertType = await ctx.req.json();
    logger.info(`Task creation request received for : ${task.title}`);

    const taskService = new TaskService(ctx.env.DB);
    const newTask = await taskService.createTask(userId, task);

    return ctx.json(responseDTO(200, "success", newTask), 201);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    logger.error(`Error in createTask: ${errorMessage}`);
    throw new HTTPException(400, { message: errorMessage });
  }
};

const addDailyLog = async (ctx: Context): Promise<Response> => {
  try {
    const dailyLog: DailyLogsInsertType = await ctx.req.json();
    logger.info(
      `Daily log creation request received for : ${dailyLog.task_id}`
    );

    const taskService = new TaskService(ctx.env.DB);
    const newDailyLog = await taskService.createDailyLog(dailyLog);

    return ctx.json(responseDTO(200, "success", newDailyLog), 201);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    logger.error(`Error in addDailyLog: ${errorMessage}`);
    throw new HTTPException(400, { message: errorMessage });
  }
};

const getTasksWithRecentDailyLogs = async (ctx: Context): Promise<Response> => {
  try {
    const userId = ctx.get("user").id;
    logger.info(`Get tasks request received for user: ${userId}`);

    const taskService = new TaskService(ctx.env.DB);
    const tasks = await taskService.getTasksWithRecentDailyLogsByUserId(userId);

    return ctx.json(responseDTO(200, "success", tasks), 200);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    logger.error(`Error in getTasksWithRecentDailyLogs: ${errorMessage}`);
    throw new HTTPException(400, { message: errorMessage });
  }
};

const getDailyLogsByTaskId = async (ctx: Context): Promise<Response> => {
  try {
    const taskId = parseInt(ctx.req.param("taskId"), 0);
    const page = parseInt(ctx.req.query("page") || "1", 1);
    const pageSize = parseInt(ctx.req.query("pageSize") || "10", 10);
    logger.info(`Get daily logs request received for task: ${taskId}`);

    const taskService = new TaskService(ctx.env.DB);
    const dailyLogs = await taskService.getDailyLogsByTaskId(taskId, {
      page,
      pageSize,
    });

    return ctx.json(responseDTO(200, "success", dailyLogs), 200);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    logger.error(`Error in getDailyLogsByTaskId: ${errorMessage}`);
    throw new HTTPException(400, { message: errorMessage });
  }
};

export default {
  createTask,
  addDailyLog,
  getTasksWithRecentDailyLogs,
  getDailyLogsByTaskId,
};
