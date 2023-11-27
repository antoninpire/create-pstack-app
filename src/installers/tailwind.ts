import fs from "fs-extra";

import { Installer } from "$/installers";
import { addDependency } from "$/utils/add-dependency";
import { getPathFromDist } from "$/utils/get-path-from-dist";

export const tailwindInstaller: Installer = (_opts, projectPath) => {
  addDependency({
    depencencies: ["tailwindcss", "autoprefixer", "postcss"],
    projectPath,
  });

  fs.copySync(getPathFromDist("../template/extras/tailwind"), projectPath);
};
