import { fail, type Actions } from "@sveltejs/kit";
import type { Session } from "lucia";
import { z } from "zod";

import { db } from "$lib/server/db";
import { auth } from "$lib/server/lucia";

const loginSchema = z.object({
  username: z.string().min(1, "Username cannot be empty"),
  password: z.string().min(1, "Password cannot be empty"),
});

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const data = await request.formData();
    const body = {
      username: data.get("username"),
      password: data.get("password"),
    };

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success)
      return fail(400, {
        message: parsed.error.issues[0].message,
      });

    let session: Session | null = null;

    try {
      const key = await auth.useKey(
        "username",
        parsed.data.username,
        parsed.data.password
      );

      const user = await db.query.users.findFirst({
        where: (table, { eq }) => eq(table.id, key.userId),
      });

      if (!user) throw new Error("User not found !");

      session = await auth.createSession({
        userId: key.userId,
        attributes: {},
      });
      locals.auth.setSession(session);
    } catch (err) {
      console.error(err);
      // invalid username/password
      return fail(400, {
        message: "Invalid username or password.",
      });
    }
  },
};
