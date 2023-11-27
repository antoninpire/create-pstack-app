import { getPathFromDist } from "$/utils/get-path-from-dist";
import fs from "fs-extra";

import { Installer } from "$/installers";
import { addDependency } from "$/utils/add-dependency";
import path from "path";

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

  const mainPagePath = "src/routes/+page.svelte";
  let content = fs.readFileSync(path.join(projectPath, mainPagePath), {
    encoding: "utf-8",
  });

  content += `<button><a href="/ssr">Check SSR</a></button><button><a href="/csr">Check CSR</a></button>`;

  fs.writeFileSync(path.join(projectPath, mainPagePath), content, {
    encoding: "utf-8",
  });
};
