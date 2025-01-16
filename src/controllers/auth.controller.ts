import { GoogleService } from "../service/google.service.js";
import { JWTService } from "../service/jwt.service.js";
import { AuthService } from "../service/auth.service.js";
import logger from "../configs/logger.config.js";
import { responseDTO } from "../dto/responseDTO.js";
import { Context } from "hono";
import { GooglePayload } from "../types/types.js";
import { UsersSelectType } from "../model/user.model.js";
import { HTTPException } from "hono/http-exception";

const googleLogin = async (ctx: Context): Promise<Response> => {
  try {
    const { googleToken, email } = await ctx.req.json();
    logger.info(`Google login request received for : ${email}`);

    const googleService = new GoogleService();
    const authService = new AuthService(ctx.env.DB);
    const jwtService = new JWTService(ctx.env.JWT_SECRET);

    const googlePayload: GooglePayload = await googleService.verifyGoogleToken(
      googleToken,
      email
    );
    const user: UsersSelectType = await authService.findOrCreateUser(
      googlePayload
    );
    const token: string = await jwtService.generateToken(user);

    return ctx.json(responseDTO(200, "success", { user: user, token }), 200);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    logger.error(`Error in googleLogin: ${errorMessage}`);
    throw new HTTPException(400, { message: errorMessage });
  }
};

export default { googleLogin };
