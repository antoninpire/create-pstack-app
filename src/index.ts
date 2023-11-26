#!/usr/bin/env node
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";

import { runCLI } from "$/core/cli";
import { scaffoldProject } from "$/core/scaffold-project";
import { runInstallers } from "$/installers";
import { getPackageManager } from "$/utils/get-package-manager";
import { parseNameAndPath } from "$/utils/parse-name-and-path";

async function main() {
  fs.removeSync("test");
  const result = await runCLI();

  const packageManager = getPackageManager();

  // We parse the path of the project as well as the name
  const [parsedName, parsedPath] = parseNameAndPath(result.name);

  // We scaffold the projects
  await scaffoldProject({
    packageManager,
    projectName: parsedName,
    projectPath: parsedPath,
  });

  // We run the different installers
  runInstallers(result, parsedPath);

  // Handle the package.json file
  const packageJsonPath = path.join(parsedPath, "package.json");
  const packageJson = fs.readJsonSync(packageJsonPath);
  packageJson.name = parsedName;

  // ? Bun doesn't support this field (yet)
  if (packageManager !== "bun") {
    const { stdout } = await execa(packageManager, ["-v"], {
      cwd: parsedPath,
    });
    packageJson.packageManager = `${packageManager}@${stdout.trim()}`;
  }

  fs.writeJSONSync(packageJsonPath, packageJson, { spaces: 2 });

  // TODO: sort the package json

  // TODO: if install, run the installer

  // TODO: if git, init a git repository

  // TODO: print next steps

  process.exit(0);
}

main().catch((err) => {
  if (err instanceof Error) console.error(err.message);
  else {
    console.error("Something went wrong!");
  }

  process.exit(1);
});
