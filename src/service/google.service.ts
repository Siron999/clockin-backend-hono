import logger from "../configs/logger.config.js";
import { GooglePayload } from "../types/types.js";

export class GoogleService {
  private googleId: string;

  constructor(googleId: string) {
    this.googleId = googleId;
  }

  async validateGoogleToken(token: string): Promise<GooglePayload> {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + token
      );

      if (!response.ok) {
        logger.error("Error validating token with Google");
        throw new Error("Invalid Google token");
      }

      const payload = await response.json();

      return payload as GooglePayload;
    } catch (error) {
      logger.error("Error in validateGoogleToken:", error);
      throw new Error("Invalid Google token");
    }
  }

  async verifyGoogleToken(googleToken: string, email: string) {
    const googlePayload = await this.validateGoogleToken(googleToken);
    if (googlePayload.email !== email) {
      throw new Error("Email mismatch");
    }
    return googlePayload;
  }
}
