import { fail, type Actions } from "@sveltejs/kit";
import { z } from "zod";

import { db } from "$lib/server/db";
import { auth } from "$lib/server/lucia";

const signUpSchema = z.object({
  username: z
    .string()
    .min(5, "Username must be at least 5 characters")
    .max(75, "Username must be at most 75 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters"),
});

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const data = await request.formData();

    const body = {
      username: data.get("username"),
      password: data.get("password"),
      email: data.get("email"),
    };

    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success)
      return fail(400, {
        message: parsed.error.issues[0].message,
      });

    const user = await db.query.users.findFirst({
      where: (user, { or, eq }) =>
        or(
          eq(user.email, parsed.data.email),
          eq(user.username, parsed.data.username)
        ),
    });

    if (user)
      return fail(400, {
        message:
          user.username === parsed.data.username
            ? "Username already taken."
            : "Email already exists.",
      });

    try {
      const user = await auth.createUser({
        key: {
          providerId: "username",
          providerUserId: parsed.data.username,
          password: parsed.data.password,
        },
        attributes: {
          email: parsed.data.email,
          username: parsed.data.username,
        },
      });
      const session = await auth.createSession({
        userId: user.userId,
        attributes: {},
      });
      locals.auth.setSession(session);
    } catch (err) {
      console.error(err);
      return fail(400, {
        message: "Username already taken.",
      });
    }
  },
};
