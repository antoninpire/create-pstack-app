import fs from "fs-extra";
import path from "path";
import { type PackageJson } from "type-fest";
import { fileURLToPath } from "url";

export function getVersion() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const pkgJsonPath = path.join(__dirname, "../package.json");
  const content = fs.readJSONSync(pkgJsonPath) as PackageJson;

  return content.version ?? "0.0.1";
}
