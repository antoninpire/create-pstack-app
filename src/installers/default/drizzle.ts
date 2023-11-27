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
  });
  addDependency({
    depencencies: ["drizzle-orm"],
    projectPath,
  });

  // Schemas (depends on auth)
  // package json scripts
  // snippets with config etc
};
