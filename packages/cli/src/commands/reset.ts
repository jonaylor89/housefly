/**
 * `housefly reset <chapter>` — restore starter files to their original
 * state using `git checkout`.
 *
 * Falls back to a warning if git is unavailable or the checkout fails.
 */

import * as path from "node:path";
import { statSync } from "node:fs";
import { unlink } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import {
  color,
  resolveExerciseDir,
  getRepoRoot,
  padChapter,
} from "../utils.js";

const PROGRESS_FILE = ".housefly-progress";

export async function resetChapter(chapter: string): Promise<void> {
  const n = parseInt(chapter, 10);
  const exerciseDir = resolveExerciseDir(chapter);
  const root = getRepoRoot();

  // Determine the path to reset (relative to repo root for git)
  const resetTarget = resolveResetTarget(n, root);

  console.log(color.yellow(`⟳ Resetting chapter ${chapter}…`));
  console.log(color.gray(`  ${resetTarget}`));

  // Attempt git checkout
  try {
    execFileSync("git", ["checkout", "--", resetTarget], {
      cwd: root,
      stdio: ["inherit", "pipe", "pipe"],
    });
    console.log(color.green("✔ Starter files restored to original state."));
  } catch (err: unknown) {
    const error = err as { stderr?: Buffer; message: string };
    if (error.stderr) {
      console.error(color.red("✘ git checkout failed:"));
      console.error(color.dim(error.stderr.toString().trim()));
    } else {
      console.error(color.red(`✘ Could not run git: ${error.message}`));
    }
    printFallbackHelp(resetTarget, root);
  }

  // Also remove hint progress file
  const progressPath = path.join(exerciseDir, PROGRESS_FILE);
  try {
    await unlink(progressPath);
    console.log(color.dim("  (hint progress reset)"));
  } catch {
    // File may not exist — that's fine
  }
}

/**
 * Determine the relative path to reset.
 *
 * New layout : exercises/chapter-NN/starter/
 * Legacy     : apps/chapterN/
 */
function resolveResetTarget(chapter: number, root: string): string {
  const newTarget = path.join(
    "exercises",
    `chapter-${padChapter(chapter)}`,
    "starter",
  );

  try {
    statSync(path.join(root, newTarget));
    return newTarget;
  } catch {
    // fall through
  }

  // Legacy
  return path.join("apps", `chapter${chapter}`);
}

function printFallbackHelp(target: string, root: string): void {
  console.log();
  console.log(color.yellow("Manual reset options:"));
  console.log(color.dim(`  git checkout -- ${target}`));
  console.log(color.dim(`  Or copy the original starter from the repository.`));
}
