import fs from "fs-extra";

import { Installer } from "$/installers";
import { addDependency } from "$/utils/add-dependency";

export const tailwindInstaller: Installer = (_opts, projectPath) => {
  addDependency({
    depencencies: ["tailwindcss", "autoprefixer", "postcss"],
    projectPath,
    dev: true,
  });

  fs.copySync("template/extras/tailwind", projectPath);
};
