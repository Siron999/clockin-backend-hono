import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { GooglePayload, UserType } from "../types/types.js";
import {
  Users,
  UsersInsertType,
  UsersSelectType,
} from "../model/user.model.js";
import { HTTPException } from "hono/http-exception";

export class AuthService {
  dbClient: DrizzleD1Database;

  constructor(db: any) {
    this.dbClient = drizzle(db);
  }

  async findOrCreateUser(
    googlePayload: GooglePayload
  ): Promise<UsersSelectType> {
    const existingUser: UsersSelectType | undefined = await this.dbClient
      .select()
      .from(Users)
      .where(eq(Users.email, googlePayload.email))
      .get();

    const userFields: UsersInsertType = this.getUserFields(googlePayload);
    if (!existingUser) {
      const newUser: UsersSelectType = await this.dbClient
        .insert(Users)
        .values(userFields)
        .returning()
        .get();
      return { ...newUser };
    }

    const updatedUser: UsersSelectType = await this.dbClient
      .update(Users)
      .set(userFields)
      .where(eq(Users.email, googlePayload.email))
      .returning()
      .get();

    return { ...updatedUser };
  }

  async getUserById(id: number): Promise<UsersSelectType> {
    const user: UsersSelectType | undefined = await this.dbClient
      .select()
      .from(Users)
      .where(eq(Users.id, id))
      .get();
    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }
    return { ...user };
  }

  getUserFields(googlePayload: GooglePayload) {
    return {
      email: googlePayload.email,
      sub: googlePayload.sub,
      name: googlePayload.name,
      given_name: googlePayload.given_name,
      family_name: googlePayload.family_name,
      picture: googlePayload.picture,
      locale: googlePayload.locale,
      hd: googlePayload.hd,
      profile: googlePayload.profile,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
}
