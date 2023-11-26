import { runCLI } from "./cli";

async function main() {
  const result = await runCLI();

  console.log("Ok!");

  process.exit(0);
}

main().catch((err) => {
  if (err instanceof Error) console.error(err.message);
  else {
    console.error("Something went wrong!");
  }

  process.exit(1);
});
