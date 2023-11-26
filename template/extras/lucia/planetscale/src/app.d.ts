/// <reference types="@cloudflare/workers-types" />

import type { UserPreferencesDefaultType } from "$lib/server/db/schema/user-preferences";

declare global {
  namespace App {
    interface Locals {
      auth: import("lucia").AuthRequest;
      session: import("lucia").Session | null;
    }
  }
}

/// <reference types="lucia" />
declare global {
  namespace Lucia {
    type Auth = import("$lib/server/lucia").Auth;
    type DatabaseUserAttributes = {
      email: string;
      username: string;
    };
    type DatabaseSessionAttributes = {
      defaultType: UserPreferencesDefaultType;
    };
  }
}

// THIS IS IMPORTANT!!!
export {};
