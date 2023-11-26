import { Spinner } from "$/types";
import { execa } from "execa";

export async function initializeGit(projectPath: string, spinner: Spinner) {
  spinner.start("Initializing git repository");

  try {
    await execa("git", ["init"], { cwd: projectPath });
    spinner.stop("Git repository initialized");
  } catch (err) {
    spinner.stop("git is not installed. Skipping git initialization...");
    return;
  }
}
