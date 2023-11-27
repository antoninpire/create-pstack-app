import { Installer } from "$/installers";
import { addDependency } from "$/utils/add-dependency";
import { getPathFromDist } from "$/utils/get-path-from-dist";
import fs from "fs-extra";
import path from "path";

export const tursoInstaller: Installer = (opts, projectPath) => {
  addDependency({
    depencencies: ["@libsql/client"],
    projectPath,
  });

  fs.copySync(getPathFromDist("../template/extras/turso"), projectPath);

  const packageJsonPath = path.join(projectPath, "package.json");
  const packageJson = fs.readJsonSync(packageJsonPath);

  packageJson.scripts = {
    ...packageJson.scripts,
    "db:migrate": "dotenv drizzle-kit generate:sqlite",
    "db:push": "dotenv drizzle-kit push:sqlite",
  };

  fs.writeJSONSync(packageJsonPath, packageJson, { spaces: 2 });
};
