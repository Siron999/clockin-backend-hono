import { Hono } from "hono";
import { ENV } from "./types/types";
import { cors } from "hono/cors";
import routes from "./routes/routes";
import logger from "./configs/logger.config";
import { HTTPException } from "hono/http-exception";

const app = new Hono<{ Bindings: ENV }>();

app.use("*", async (c, next) => {
  try {
    const startTime = performance.now();
    await next();
    const endTime = performance.now();
    logger.info(`Total Time taken: ${endTime - startTime}ms`);
  } catch (err) {
    logger.error(err);
    throw new HTTPException(500, { message: "Internal Server Error" });
  }
});

app.use("*", async (c, next) => {
  cors({
    origin: c.env.FRONTEND_URL,
    allowHeaders: ["*"],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE", "PATCH", "HEAD"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  });
  await next();
});

app.get("/", async (c) => {
  return c.json({
    message: "Hello World! 2025/01/15",
  });
});
app.route("/api", routes);

export default app;
