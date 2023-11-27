import { CLIResult } from "$/core/cli";
import { planetscaleInstaller } from "$/installers/db/planetscale";
import { tursoInstaller } from "$/installers/db/turso";
import { drizzleInstaller } from "$/installers/drizzle";
import { luciaInstaller } from "$/installers/lucia";
import { tailwindInstaller } from "$/installers/tailwind";
import { trpcInstaller } from "$/installers/trpc";
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
      label: "TRPC",
      enabled: opts.flags.trpc,
      install: trpcInstaller,
    },
  ].filter((i) => i.enabled);

  installers.forEach((installer) => {
    spinner.start(`Scaffolding ${installer.label}...`);

    installer.install(opts, projectPath);

    spinner.stop(`Scaffolded ${installer.label}...`);
  });
}
