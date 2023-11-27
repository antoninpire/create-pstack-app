import { OAuthRequestError } from "@lucia-auth/oauth";
import type { User } from "lucia";

import { db } from "$lib/server/db";
import { auth, githubAuth } from "$lib/server/lucia";

export const GET = async ({ url, cookies, locals }) => {
  if (locals.session)
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });

  const storedState = cookies.get("github_oauth_state");
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, {
      status: 400,
    });
  }
  try {
    const { getExistingUser, githubUser, createUser, githubTokens } =
      await githubAuth.validateCallback(code);

    let prevUser: User | null;
    if (githubUser.email === null) {
      const res = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `token ${githubTokens.accessToken}`,
        },
      });
      const emails = (await res.json()) as { email: string }[];

      if (!emails || emails.length === 0 || !emails[0].email) {
        return new Response(null, {
          status: 400,
        });
      }
      githubUser.email = emails[0].email;

      const currentUser = await db.query.users.findFirst({
        where: (table, { eq }) => eq(table.email, githubUser.email!),
      });

      prevUser = currentUser
        ? {
            userId: currentUser.id,
            email: emails[0].email,
            username: currentUser.username ?? "",
          }
        : null;
    }

    const getUser = async () => {
      const existingUser = prevUser ?? (await getExistingUser());
      if (existingUser) return existingUser;

      const user = await createUser({
        attributes: {
          email: githubUser.email ?? "",
          username: githubUser.login,
        },
      });

      return user;
    };

    const user = await getUser();
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    locals.auth.setSession(session);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    console.error(e);
    if (e instanceof OAuthRequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
};
