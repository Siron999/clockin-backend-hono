import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { GooglePayload, UserType } from "../types/types.js";
import { Users } from "../model/user.model.js";

export class AuthService {
  dbClient: DrizzleD1Database;

  constructor(db: any) {
    this.dbClient = drizzle(db);
  }

  async findOrCreateUser(googlePayload: GooglePayload): Promise<UserType> {
    const existingUser = await this.dbClient
      .select()
      .from(Users)
      .where(eq(Users.email, googlePayload.email))
      .get();

    const userFields = {
      email: googlePayload.email,
      sub: googlePayload.sub,
      name: googlePayload.name,
      given_name: googlePayload.given_name,
      family_name: googlePayload.family_name,
      picture: googlePayload.picture,
      locale: googlePayload.locale,
      hd: googlePayload.hd,
      profile: googlePayload.profile,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!existingUser) {
      const newUser = await this.dbClient
        .insert(Users)
        .values(userFields)
        .returning()
        .get();
      return { ...newUser };
    }

    const updatedUser = await this.dbClient
      .update(Users)
      .set(userFields)
      .where(eq(Users.email, googlePayload.email))
      .returning()
      .get();

    return { ...updatedUser };
  }
}
