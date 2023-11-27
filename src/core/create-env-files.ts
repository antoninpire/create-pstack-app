import fs from "fs-extra";

import { CLIResult } from "$/core/cli";
import path from "path";

export function createEnvFiles(opts: CLIResult, projectPath: string) {
  let content = "";

  if (opts.flags.database === "planetscale") {
    content += `# Database\nDATABASE_HOST="aws.connect.psdb.cloud"\nDATABASE_USERNAME="YOUR_PLANETSCALE_USERNAME"\nDATABASE_PASSWORD="YOUR_PLANETSCALE_PASSWORD"\nDATABASE_URL="YOUR_PLANETSCALE_DB_URL"\n`;
  }
  if (opts.flags.database === "turso") {
    content += `# Database\nDATABASE_URL="YOUR_TURSO_DB_URL"\nDATABASE_AUTH_TOKEN="YOUR_TURSO_AUTH_TOKEN"\n`;
  }

  if (opts.flags.lucia) {
    content += `# Github\nGITHUB_CLIENT_ID=""\nGITHUB_CLIENT_SECRET=""\n`;
  }

  fs.writeSync(
    fs.openSync(path.join(projectPath, ".env"), "w"),
    content.trim()
  );
  fs.writeSync(
    fs.openSync(path.join(projectPath, ".env.example"), "w"),
    content.trim()
  );
}
