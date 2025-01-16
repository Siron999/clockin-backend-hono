import { decode, sign, verify } from "hono/jwt";
import logger from "../configs/logger.config.js";
import { UserType } from "../types/types.js";
import { JWTPayload } from "hono/utils/jwt/types";
import { HTTPException } from "hono/http-exception";

export class JWTService {
  jwtSecret: string;
  constructor(jwtSecret: string) {
    this.jwtSecret = jwtSecret;
  }
  async generateToken(user: UserType) {
    const payload: JWTPayload = {
      sub: user.id as number,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    };
    return await sign(payload, this.jwtSecret);
  }

  async verifyAccessToken(token: string): Promise<JWTPayload> {
    try {
      const secret = this.jwtSecret;
      if (!secret) {
        throw new Error("JWT_ACCESS_SECRET is not defined");
      }
      return await verify(token, secret);
    } catch (error) {
      logger.error("Access Token verification failed:", error);
      throw new HTTPException(401, { message: "Invalid token" });
    }
  }

  decodeToken(token: string) {
    try {
      return decode(token);
    } catch (error) {
      logger.error("Error in decoding token:", error);
      return null;
    }
  }
}
