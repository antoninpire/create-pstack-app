import { confirm, select } from "@clack/prompts";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

import { Spinner } from "$/types";
import { PackageManager } from "$/utils/get-package-manager";

export async function scaffoldProject(
  opts: {
    projectName: string;
    projectPath: string;
    packageManager: PackageManager;
  },
  spinner: Spinner
) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const templatePath = path.join(__dirname, "../template/default");

  spinner.start("Scaffolding project...");

  if (fs.existsSync(opts.projectPath)) {
    if (fs.readdirSync(opts.projectPath).length > 0) {
      // The directory is not empty
      const newPath = await select({
        message: "Directory is not empty, what do you want to do?",
        options: [
          {
            label: "Cancel (recommended)",
            value: "cancel",
          },
          {
            label: "Empty the directory and continue",
            value: "empty",
          },
        ],
        initialValue: "abort",
      });

      switch (newPath) {
        case "abort":
          spinner.stop("Aborting...");
          process.exit(1);
        case "empty":
          const confirmation = await confirm({
            message: `Are you sure you want to empty "${opts.projectName}"?`,
          });

          if (!confirmation) {
            spinner.stop("Aborting...");
            process.exit(1);
          }

          spinner.message(`Emptying "${opts.projectName}"...`);
          fs.emptyDirSync(opts.projectPath);
          break;
      }
    } else {
      if (opts.projectName !== ".")
        spinner.message(
          `"${opts.projectName}" already exists but is empty, continuing...\n`
        );
    }
  }

  spinner.stop("Scaffolded project successfully!");

  spinner.start("Copying template files...");
  fs.copySync(templatePath, opts.projectPath);
  fs.copySync(
    templatePath + "/.gitignore",
    path.join(opts.projectPath, ".gitignore")
  );

  spinner.stop("Copied template filed successfully!");
}
