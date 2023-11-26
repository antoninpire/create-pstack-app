import * as prompts from "@clack/prompts";
import { Command } from "commander";

import { getPackageManager } from "$/utils/get-package-manager";
import { getVersion } from "$/utils/get-version";
import { validateProjectName } from "$/utils/validate-project-name";

type CLIStyling = "none" | "tailwind" | "uno";
type CLIDatabase = "none" | "planetscale" | "turso" | "mysql";

type CLIFlags = {
  git: boolean;
  install: boolean;
  database: CLIDatabase;
  styling: CLIStyling;
  lucia: boolean;
};

type CLIResult = {
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
  const packageManager = getPackageManager();
  const flags = program.opts();

  const project = await prompts.group(
    {
      ...(!program.args[0] && {
        name: () =>
          prompts.text({
            message: "What is the name of your project?",
            defaultValue: projectName,
            validate: validateProjectName,
          }),
      }),
      styling: () =>
        prompts.select({
          message: "What styling solution would you like to use?",
          options: [
            { value: "none", label: "None" },
            { value: "Tailwind CSS", label: "tailwind" },
            { value: "Uno CSS", label: "uno" },
          ],
          initialValue: "none",
        }),
      database: () =>
        prompts.select({
          message: "What database would you like to use?",
          options: [
            { value: "none", label: "None" },
            { value: "Planetscale", label: "planetscale" },
            { value: "Turso", label: "turso" },
            { value: "MySQL", label: "mysql" },
          ],
          initialValue: "none",
        }),
      lucia: () =>
        prompts.confirm({
          message: "Would you like us to setup authentication using Lucia?",
          initialValue: true,
        }),
      ...(!flags["no-install"] && {
        install: () =>
          prompts.confirm({
            message: `Should we install your dependencies using "${packageManager} install"?`,
            initialValue: true,
          }),
      }),
      ...(!flags["no-git"] && {
        git: () =>
          prompts.confirm({
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
      database: project.database as CLIDatabase,
      git: project.git ?? false,
      install: project.install ?? false,
      styling: project.styling as CLIStyling,
      lucia: project.lucia,
    },
  };

  return result;
}
