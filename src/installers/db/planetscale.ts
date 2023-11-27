import fs from "fs-extra";
import path from "path";

import { Installer } from "$/installers";
import { addDependency } from "$/utils/add-dependency";
import { getPathFromDist } from "$/utils/get-path-from-dist";

export const planetscaleInstaller: Installer = (_opts, projectPath) => {
  addDependency({
    depencencies: ["@planetscale/database"],
    projectPath,
  });

  fs.copySync(getPathFromDist("../template/extras/planetscale"), projectPath);

  const packageJsonPath = path.join(projectPath, "package.json");
  const packageJson = fs.readJsonSync(packageJsonPath);

  packageJson.scripts = {
    ...packageJson.scripts,
    "db:migrate": "dotenv drizzle-kit generate:mysql",
    "db:push": "dotenv drizzle-kit push:mysql",
  };

  fs.writeJSONSync(packageJsonPath, packageJson, { spaces: 2 });

  // TODO: replace project name for tables etc
};
