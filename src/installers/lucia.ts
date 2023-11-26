import fs from "fs-extra";

import { Installer } from "$/installers";
import { addDependency } from "$/utils/add-dependency";

export const luciaInstaller: Installer = (opts, projectPath) => {
  addDependency({
    depencencies: ["@lucia-auth/adapter-mysql", "lucia"],
    projectPath,
    dev: false,
  });

  if (opts.flags.database === "planetscale") {
    fs.copySync("template/extras/lucia/planetscale", projectPath);
  }

  // TODO: snippets for login pages and signup pages

  // TODO: write to .env
};
