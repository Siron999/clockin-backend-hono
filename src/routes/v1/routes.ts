import { Hono } from "hono";
import authRoutes from "./auth.routes";
import taskRoutes from "./tasks.routes";

const hono = new Hono();

hono.route("/auth", authRoutes);
hono.route("/tasks", taskRoutes);

export default hono;
