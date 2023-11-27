import fs from "fs-extra";

import { Installer } from "$/installers";
import { addDependency } from "$/utils/add-dependency";
import { getPathFromDist } from "$/utils/get-path-from-dist";

export const superformsInstaller: Installer = (opts, projectPath) => {
  addDependency({
    depencencies: ["sveltekit-superforms", "zod"],
    projectPath,
  });

  fs.copySync(getPathFromDist("../template/extras/superforms"), projectPath);
};
