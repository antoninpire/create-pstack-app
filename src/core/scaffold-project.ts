import { confirm, select, spinner } from "@clack/prompts";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

import { PackageManager } from "$/utils/get-package-manager";

export async function scaffoldProject(opts: {
  projectName: string;
  projectPath: string;
  packageManager: PackageManager;
}) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const templatePath = path.join(__dirname, "../template/default");

  const s = spinner();

  s.start("Scaffolding project...");

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
          s.stop("Aborting...");
          process.exit(1);
        case "empty":
          const confirmation = await confirm({
            message: `Are you sure you want to empty "${opts.projectName}"?`,
          });

          if (!confirmation) {
            s.stop("Aborting...");
            process.exit(1);
          }

          s.message(`Emptying "${opts.projectName}"...`);
          fs.emptyDirSync(opts.projectPath);
          break;
      }
    } else {
      if (opts.projectName !== ".")
        s.message(
          `"${opts.projectName}" already exists but is empty, continuing...\n`
        );
    }
  }

  s.start("Copying template files...");
  fs.copySync(templatePath, opts.projectPath);

  s.stop("Copied template filed successfully!");
}
