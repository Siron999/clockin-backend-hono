import { Context, Next } from "hono";
import { JWTService } from "../service/jwt.service";
import { responseDTO } from "../dto/responseDTO";
import logger from "../configs/logger.config";
import { AuthService } from "../service/auth.service";
import { HTTPException } from "hono/http-exception";

const auth = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const jwtService = new JWTService(c.env.JWT_SECRET);
    const payload = await jwtService.verifyAccessToken(token);

    if (!payload || !payload.sub) {
      throw new Error("Invalid token payload");
    }

    const authService = new AuthService(c.env.DB);
    const user = await authService.getUserById(Number(payload.sub));

    // Add user to context
    c.set("user", user);

    await next();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unauthorized";
    logger.error(`Auth middleware error: ${errorMessage}`);
    throw new HTTPException(401, { message: errorMessage });
  }
};

export { auth };
