import p from "path";
import { fileURLToPath } from "url";

export function getPathFromDist(path: string) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = p.dirname(__filename);
  const templatePath = p.join(__dirname, path);

  return templatePath;
}
