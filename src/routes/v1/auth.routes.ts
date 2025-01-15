import authController from "../../controllers/auth.controller";
import { Context, Hono } from "hono";

const authRoutes = new Hono();

authRoutes.post("/google-signin", (ctx: Context) => {
  return authController.googleLogin(ctx);
});

export default authRoutes;
