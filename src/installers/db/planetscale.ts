import fs from "fs-extra";
import path from "path";

import { Installer } from "$/installers";
import { addDependency } from "$/utils/add-dependency";

export const planetscaleInstaller: Installer = (opts, projectPath) => {
  addDependency({
    depencencies: ["@planetscale/database"],
    projectPath,
    dev: false,
  });

  fs.copySync("template/extras/planetscale", projectPath);

  const packageJsonPath = path.join(projectPath, "package.json");
  const packageJson = fs.readJsonSync(packageJsonPath);

  packageJson.scripts = {
    ...packageJson.scripts,
    "db:migrate": "dotenv drizzle-kit generate:mysql",
    "db:push": "dotenv drizzle-kit push:mysql",
  };
};
