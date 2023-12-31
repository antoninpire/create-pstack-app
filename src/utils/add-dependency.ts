import fs from "fs-extra";
import path from "path";

const dependencyVersionMap = {
  // Drizzle / DB
  "drizzle-orm": "^0.29.0",
  "drizzle-kit": "^0.20.4",
  dotenv: "16.3.1",

  // Planetscale
  "@planetscale/database": "^1.11.0",

  // Turso
  "@libsql/client": "0.4.0-pre.2",

  // Tailwind
  tailwindcss: "^3.3.5",
  autoprefixer: "^10.4.14",
  postcss: "^8.4.31",

  // Lucia
  "@lucia-auth/adapter-mysql": "^2.1.0",
  "@lucia-auth/adapter-sqlite": "^2.0.1",
  lucia: "^2.7.4",
  "@lucia-auth/oauth": "^3.5.0",

  // TRPC
  "@trpc/client": "^10.44.1",
  "@trpc/server": "^10.44.1",
  devalue: "^4.3.2",
  "trpc-svelte-query": "^1.0.3",
  "@tanstack/svelte-query": "4.36.1",
  zod: "^3.22.4",
} as const;

export function addDependency(opts: {
  depencencies: (keyof typeof dependencyVersionMap)[];
  projectPath: string;
}) {
  const packageJsonPath = path.join(opts.projectPath, "package.json");

  const packageJson = fs.readJSONSync(packageJsonPath);

  opts.depencencies.forEach((dependency) => {
    const version = dependencyVersionMap[dependency];

    if (!packageJson["devDependencies"]) {
      packageJson["devDependencies"] = {};
    }

    packageJson["devDependencies"][dependency] = version;
  });

  fs.writeJSONSync(packageJsonPath, packageJson, { spaces: 2 });
}
