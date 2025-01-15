import { GoogleService } from "../service/google.service.js";
import { JWTService } from "../service/jwt.service.js";
import { AuthService } from "../service/auth.service.js";
import logger from "../configs/logger.config.js";
import { responseDTO } from "../dto/responseDTO.js";
import { Context } from "hono";

const googleLogin = async (ctx: Context) => {
  try {
    const { googleToken, email } = await ctx.req.json();
    logger.info(`Google login request received for : ${email}`);

    const googleService = new GoogleService(ctx.env.GOOGLE_ID);
    const authService = new AuthService(ctx.env.DB);
    const jwtService = new JWTService(ctx.env.JWT_SECRET);

    const googlePayload = await googleService.verifyGoogleToken(
      googleToken,
      email
    );
    const user = await authService.findOrCreateUser(googlePayload);
    const token = await jwtService.generateToken(user);

    return ctx.json(responseDTO(200, "success", { user: user, token }), 200);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    logger.error(`Error in googleLogin: ${errorMessage}`);
    return ctx.json(responseDTO(400, "error", null, errorMessage), 400);
  }
};

export default { googleLogin };
