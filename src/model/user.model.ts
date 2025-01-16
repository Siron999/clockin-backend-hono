import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const Users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  sub: text("sub").unique(),
  name: text("name"),
  given_name: text("given_name"),
  family_name: text("family_name"),
  picture: text("picture"),
  locale: text("locale"),
  hd: text("hd"),
  profile: text("profile"),
  created_at: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updated_at: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export type UsersSelectType = InferSelectModel<typeof Users>;
export type UsersInsertType = InferInsertModel<typeof Users>;
