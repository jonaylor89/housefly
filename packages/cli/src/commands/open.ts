/**
 * `housefly open <chapter>` — open the exercise folder in the system
 * file manager or editor.
 *
 * Uses platform-specific commands:
 *   Linux  → xdg-open
 *   macOS  → open
 *   Windows → start
 */

import { statSync } from "node:fs";
import { spawn } from "node:child_process";
import { color, resolveExerciseDir } from "../utils.js";

export async function openChapter(chapter: string): Promise<void> {
  const exerciseDir = resolveExerciseDir(chapter);

  try {
    statSync(exerciseDir);
  } catch {
    console.error(color.red(`Exercise directory not found: ${exerciseDir}`));
    process.exit(1);
  }

  console.log(color.cyan(`📂 Opening chapter ${chapter}`));
  console.log(color.gray(`   ${exerciseDir}`));

  const openCmd = getOpenCommand();

  if (!openCmd) {
    console.log(
      color.yellow(
        "Could not detect a suitable open command for your platform.",
      ),
    );
    console.log(color.dim(`Manually open: ${exerciseDir}`));
    return;
  }

  try {
    const child = spawn(openCmd, [exerciseDir], {
      stdio: ["inherit", "ignore", "pipe"],
      detached: true,
    });

    const stderrChunks: Buffer[] = [];
    child.stderr.on("data", (data: Buffer) => stderrChunks.push(data));

    child.on("close", (code) => {
      if (code !== 0) {
        const stderr = Buffer.concat(stderrChunks).toString("utf-8").trim();
        console.error(color.yellow(`Warning: ${openCmd} exited with an error.`));
        if (stderr) console.error(color.dim(stderr));
      }
    });

    child.unref();
  } catch (err) {
    console.error(
      color.yellow(
        `Could not run "${openCmd}": ${(err as Error).message}`,
      ),
    );
    console.log(color.dim(`Manually open: ${exerciseDir}`));
  }
}

function getOpenCommand(): string | null {
  const platform = process.platform;

  switch (platform) {
    case "linux":
      return "xdg-open";
    case "darwin":
      return "open";
    case "win32":
      return "start";
    default:
      return null;
  }
}
