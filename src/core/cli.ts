import { confirm, group, select, text } from "@clack/prompts";
import { Command } from "commander";

import { getVersion } from "$/utils/get-version";
import { validateProjectName } from "$/utils/validate-project-name";

type CLIDatabase = "planetscale" | "turso";
export type CLIPackageManager = "yarn" | "npm" | "pnpm" | "bun";

type CLIFlags = {
  packageManager: CLIPackageManager;
  git: boolean;
  install: boolean;
  database: CLIDatabase;
  tailwind: boolean;
  lucia: boolean;
  trpc: boolean;
};

export type CLIResult = {
  name: string;
  flags: CLIFlags;
};

export async function runCLI(): Promise<CLIResult> {
  const program = new Command()
    .name("create-perfect-stack-app")
    .argument(
      "[dir]",
      "The name of the application, as well as the name of the directory to create"
    )
    .option(
      "--no-git",
      "Explicitly disable git initialization. This is disabled by default",
      false
    )
    .option(
      "--no-install",
      "Explicitly disable package installation. This is disabled by default",
      false
    )
    .version(getVersion(), "-v, --version", "Display the version number")
    .parse(process.argv);

  const projectName = program.args[0] ?? "my-app";
  const flags = program.opts();

  const project = await group(
    {
      ...(!program.args[0] && {
        name: () =>
          text({
            message: "What is the name of your project?",
            defaultValue: projectName,
            validate: validateProjectName,
          }),
      }),
      packageManager: () =>
        select({
          message: "What package manager would you like to use?",
          options: [
            { label: "Yarn", value: "yarn" },
            { label: "NPM", value: "npm" },
            { label: "PNPM", value: "pnpm" },
            { label: "Bun", value: "bun" },
          ],
          initialValue: "pnpm",
        }),
      tailwind: () =>
        confirm({
          message: "Would you like to use Tailwind CSS?",
          initialValue: true,
        }),
      database: () =>
        select({
          message: "What database would you like to use?",
          options: [
            { label: "Planetscale", value: "planetscale" },
            { label: "Turso", value: "turso" },
          ],
          initialValue: "planetscale",
        }),
      lucia: async (opts) => {
        if (opts.results.database === "none") return false;
        return confirm({
          message: "Would you like us to setup authentication using Lucia?",
          initialValue: true,
        });
      },
      trpc: () =>
        confirm({
          message: "Would you like to use TRPC?",
          initialValue: true,
        }),
      ...(!flags["no-install"] && {
        install: () =>
          confirm({
            message: `Should we install your dependencies?`,
            initialValue: true,
          }),
      }),
      ...(!flags["no-git"] && {
        git: () =>
          confirm({
            message: "Would you like to initialize a new git repository?",
            initialValue: true,
          }),
      }),
    },
    {
      onCancel: () => {
        process.exit(0);
      },
    }
  );

  const result: CLIResult = {
    name: project.name ?? projectName,
    flags: {
      packageManager: project.packageManager as CLIPackageManager,
      database: project.database as CLIDatabase,
      git: project.git ?? false,
      install: project.install ?? false,
      tailwind: project.tailwind ?? false,
      lucia: (project.lucia as boolean) ?? false,
      trpc: project.trpc ?? false,
    },
  };

  return result;
}
