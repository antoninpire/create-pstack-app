// scripts in package.json
// dependencies: drizzle-orm
// dev dependencies: drizzle-kit
// code snippet

import { Installer } from "$/installers";
import { addDependency } from "$/utils/add-dependency";

export const drizzleInstaller: Installer = (opts, projectPath) => {
  addDependency({
    depencencies: ["drizzle-kit", "dotenv"],
    projectPath,
    dev: true,
  });
  addDependency({
    depencencies: ["drizzle-orm"],
    projectPath,
    dev: false,
  });

  // Schemas (depends on auth)
  // package json scripts
  // snippets with config etc
};
