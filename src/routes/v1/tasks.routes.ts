import taskController from "../../controllers/task.controller";
import { Context, Hono } from "hono";
import { auth } from "../../middleware/authenticate.middleware";

const taskRoutes = new Hono();

taskRoutes.use("/*", auth);

taskRoutes.post("/", (ctx: Context) => {
  return taskController.createTask(ctx);
});

taskRoutes.post("/daily-logs", (ctx: Context) => {
  return taskController.addDailyLog(ctx);
});

taskRoutes.get("/", (ctx: Context) => {
  return taskController.getTasksWithRecentDailyLogs(ctx);
});

taskRoutes.get("/daily-logs/:taskId", (ctx: Context) => {
  return taskController.getDailyLogsByTaskId(ctx);
});

export default taskRoutes;
