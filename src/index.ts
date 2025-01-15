import { Hono } from "hono";
import { ENV } from "./types/types";
import { cors } from "hono/cors";
import routes from "./routes/routes";

const app = new Hono<{ Bindings: ENV }>();

app.use("*", async (c, next) => {
  try {
    await next();
  } catch (err) {
    console.error(err);
    return c.json({ error: "Internal Server Error" }, 500);
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
