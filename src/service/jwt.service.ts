import { decode, sign, verify } from "hono/jwt";
import logger from "../configs/logger.config.js";
import { UserType } from "../types/types.js";

export class JWTService {
  jwtSecret: string;
  constructor(jwtSecret: string) {
    this.jwtSecret = jwtSecret;
  }
  async generateToken(user: UserType) {
    const payload = {
      sub: user.id,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    };
    return await sign(payload, this.jwtSecret);
  }

  async verifyAccessToken(token: string) {
    try {
      const secret = this.jwtSecret;
      if (!secret) {
        throw new Error("JWT_ACCESS_SECRET is not defined");
      }
      return await verify(token, secret);
    } catch (error) {
      logger.error("Access Token verification failed:", error);
      return null;
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
