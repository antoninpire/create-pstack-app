import fs from "fs-extra";

import { Installer } from "$/installers";
import { addDependency } from "$/utils/add-dependency";
import { getPathFromDist } from "$/utils/get-path-from-dist";

export const luciaInstaller: Installer = (opts, projectPath) => {
  addDependency({
    depencencies: [
      opts.flags.database === "planetscale"
        ? "@lucia-auth/adapter-mysql"
        : "@lucia-auth/adapter-sqlite",
      "lucia",
      "@lucia-auth/oauth",
      "zod",
    ],
    projectPath,
  });

  fs.copySync(getPathFromDist("../template/extras/lucia/default"), projectPath);

  if (opts.flags.database === "planetscale") {
    fs.copySync(
      getPathFromDist("../template/extras/lucia/planetscale"),
      projectPath
    );
  } else if (opts.flags.database === "turso") {
    fs.copySync(getPathFromDist("../template/extras/lucia/turso"), projectPath);
  }
};
