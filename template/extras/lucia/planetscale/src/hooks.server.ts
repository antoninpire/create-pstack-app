import { type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

import { auth } from "$lib/server/lucia";

const authHandle: Handle = async ({ event, resolve }) => {
  event.locals.auth = auth.handleRequest(event);
  event.locals.session = await event.locals.auth.validate();

  return await resolve(event);
};

const protectedRoutesHandle: Handle = async ({ event, resolve }) => {
  const route_id = event.route.id;

  // if (route_id?.startsWith('/(app)/(private)') && !event.locals.session?.user) {
  // 	throw redirect(302, '/login?path=' + event.url.pathname);
  // }

  // if (
  // 	route_id?.startsWith('/(auth)') &&
  // 	!event.url.searchParams.has('/logout') &&
  // 	event.locals.session?.user
  // ) {
  // 	throw redirect(302, '/' + event.locals.session.defaultType + 's');
  // }

  return resolve(event);
};

export const handle = sequence(authHandle, protectedRoutesHandle);
