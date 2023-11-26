import { spinner } from "@clack/prompts";

import { CLIResult } from "$/core/cli";
import { planetscaleInstaller } from "$/installers/db/planetscale";
import { tursoInstaller } from "$/installers/db/turso";
import { drizzleInstaller } from "$/installers/default/drizzle";
import { superformsInstaller } from "$/installers/form-actions/superforms";
import { trpcInstaller } from "$/installers/form-actions/trpc";
import { luciaInstaller } from "$/installers/lucia";
import { tailwindInstaller } from "$/installers/styling/tailwind";
import { unoInstaller } from "$/installers/styling/uno";

export type Installer = (opts: CLIResult, projectPath: string) => void;

export function runInstallers(opts: CLIResult, projectPath: string) {
  const s = spinner();
  s.start("Running the installers...");

  // Order is important here
  const installers = [
    {
      label: opts.flags.styling === "tailwind" ? "Tailwind CSS" : "Uno CSS",
      enabled: opts.flags.styling !== "none",
      install:
        opts.flags.styling === "tailwind" ? tailwindInstaller : unoInstaller,
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
    s.start(`Scaffolding ${installer.label}...`);

    installer.install(opts, projectPath);

    s.stop(`Scaffolded ${installer.label}...`);
  });

  s.stop("Ran the installers...");
}
