import { getPathFromDist } from "$/utils/get-path-from-dist";
import fs from "fs-extra";

import { Installer } from "$/installers";
import { addDependency } from "$/utils/add-dependency";

export const trpcInstaller: Installer = (opts, projectPath) => {
  addDependency({
    depencencies: [
      "trpc-svelte-query",
      "@trpc/client",
      "@trpc/server",
      "devalue",
      "zod",
      "@tanstack/svelte-query",
    ],
    projectPath,
  });

  fs.copySync(
    getPathFromDist(
      opts.flags.lucia
        ? "../template/extras/trpc"
        : "../template/extras/trpc-no-auth"
    ),
    projectPath
  );
};
