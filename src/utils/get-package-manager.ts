export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

export function getPackageManager(): PackageManager {
  const userAgent = process.env.npm_config_user_agent ?? "";

  if (!userAgent) return "npm";

  if (userAgent.startsWith("bun")) return "bun";
  else if (userAgent.startsWith("pnpm")) return "pnpm";
  else if (userAgent.startsWith("yarn")) return "yarn";
  else return "npm";
}
