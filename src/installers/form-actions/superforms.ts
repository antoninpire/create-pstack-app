import fs from "fs-extra";

import { Installer } from "$/installers";
import { addDependency } from "$/utils/add-dependency";

export const superformsInstaller: Installer = (opts, projectPath) => {
  addDependency({
    depencencies: ["sveltekit-superforms", "zod"],
    projectPath,
    dev: false,
  });

  fs.copySync("template/extras/superforms", projectPath);
};
