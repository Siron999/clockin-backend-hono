import { Hono } from "hono";
import authRoutes from "./auth.routes";

const hono = new Hono();

hono.route("/auth", authRoutes);

export default hono;
