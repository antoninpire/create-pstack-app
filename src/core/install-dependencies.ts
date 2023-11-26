import { execa } from "execa";

import { Spinner } from "$/types";
import { PackageManager } from "$/utils/get-package-manager";

export async function installDependencies(
  projectPath: string,
  packageManager: PackageManager,
  spinner: Spinner
) {
  spinner.start("Installing dependencies...");

  await execa(packageManager, ["install"], {
    cwd: projectPath,
    stderr: "inherit",
  });

  spinner.stop("Dependencies installed");
}
