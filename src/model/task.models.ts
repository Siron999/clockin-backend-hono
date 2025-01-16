import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { Users } from "./user.model";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const Tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_id: integer("user_id")
    .references(() => Users.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  allocated_time_per_day_hours: integer(
    "allocated_time_per_day_hours)"
  ).notNull(),
  created_at: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updated_at: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const DailyLogs = sqliteTable("daily_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  task_id: integer("task_id")
    .references(() => Tasks.id, {
      onDelete: "cascade",
    })
    .notNull(),
  clocked_in: text("clocked_in").notNull(),
  clocked_out: text("clocked_out").notNull(),
  created_at: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updated_at: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export type TasksSelectType = InferSelectModel<typeof Tasks>;
export type TasksInsertType = InferInsertModel<typeof Tasks>;
export type DailyLogsSelectType = InferSelectModel<typeof DailyLogs>;
export type DailyLogsInsertType = InferInsertModel<typeof DailyLogs>;
export type TaskWithDailyLogs = TasksSelectType & {
  daily_logs: DailyLogsSelectType[];
};
