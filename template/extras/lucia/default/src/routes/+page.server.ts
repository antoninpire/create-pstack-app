import { fail, redirect, type Actions, type ServerLoad } from "@sveltejs/kit";

import { auth } from "$lib/server/lucia";

export const load: ServerLoad = async ({ locals }) => {
  return {
    session: locals.session,
  };
};

export const actions: Actions = {
  logout: async ({ locals }) => {
    if (!locals.session) return fail(401, { message: "Already logged out." });

    await auth.invalidateSession(locals.session.sessionId); // invalidate session
    locals.auth.setSession(null); // remove cookie
    locals.session = null;

    throw redirect(302, "/login");
  },
};
