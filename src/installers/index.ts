import { CLIResult } from "$/core/cli";
import { planetscaleInstaller } from "$/installers/db/planetscale";
import { tursoInstaller } from "$/installers/db/turso";
import { drizzleInstaller } from "$/installers/default/drizzle";
import { superformsInstaller } from "$/installers/form-actions/superforms";
import { trpcInstaller } from "$/installers/form-actions/trpc";
import { luciaInstaller } from "$/installers/lucia";
import { tailwindInstaller } from "$/installers/tailwind";
import { Spinner } from "$/types";

export type Installer = (opts: CLIResult, projectPath: string) => void;

export function runInstallers(
  opts: CLIResult,
  projectPath: string,
  spinner: Spinner
) {
  // Order is important here
  const installers = [
    {
      label: "Tailwind CSS",
      enabled: opts.flags.tailwind,
      install: tailwindInstaller,
    },
    {
      label: "Drizzle",
      enabled: true,
      install: drizzleInstaller,
    },
    {
      label: opts.flags.database === "planetscale" ? "Planetscale" : "Turso",
      enabled: true,
      install:
        opts.flags.database === "planetscale"
          ? planetscaleInstaller
          : tursoInstaller,
    },
    {
      label: "Lucia",
      enabled: opts.flags.lucia,
      install: luciaInstaller,
    },
    {
      label: "Form Actions",
      enabled: opts.flags["form-actions"] !== "none",
      install:
        opts.flags["form-actions"] === "trpc"
          ? trpcInstaller
          : superformsInstaller,
    },
  ].filter((i) => i.enabled);

  installers.forEach((installer) => {
    spinner.start(`Scaffolding ${installer.label}...`);

    installer.install(opts, projectPath);

    spinner.stop(`Scaffolded ${installer.label}...`);
  });
}
