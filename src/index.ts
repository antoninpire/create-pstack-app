#!/usr/bin/env node
import { spinner as clackSpinner, outro } from "@clack/prompts";
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";

import { runCLI } from "$/core/cli";
import { initializeGit } from "$/core/initialize-git";
import { installDependencies } from "$/core/install-dependencies";
import { scaffoldProject } from "$/core/scaffold-project";
import { runInstallers } from "$/installers";
import { getPackageManager } from "$/utils/get-package-manager";
import { parseNameAndPath } from "$/utils/parse-name-and-path";
import { sortPackageJson } from "sort-package-json";

async function main() {
  // TODO: remove this line
  fs.removeSync("test");

  const result = await runCLI();

  const packageManager = getPackageManager();

  const spinner = clackSpinner();

  // We parse the path of the project as well as the name
  const [parsedName, parsedPath] = parseNameAndPath(result.name);

  // We scaffold the projects
  await scaffoldProject(
    {
      packageManager,
      projectName: parsedName,
      projectPath: parsedPath,
    },
    spinner
  );

  // We run the different installers
  runInstallers(result, parsedPath, spinner);

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

  // We sort the package.json file
  sortPackageJson(packageJson);

  fs.writeJSONSync(packageJsonPath, packageJson, { spaces: 2 });

  // We install the dependencies
  if (result.flags.install) {
    await installDependencies(parsedPath, packageManager, spinner);
  }

  // We initialize the git repository
  if (result.flags.git) {
    await initializeGit(parsedPath, spinner);
  }

  // Show the next steps
  outro("Thanks for trying us out !");

  process.exit(0);
}

main().catch((err) => {
  if (err instanceof Error) console.error(err.message);
  else {
    console.error("Something went wrong!");
  }

  process.exit(1);
});
