/**
 * `housefly hint <chapter>` — show progressive hints for a chapter.
 *
 * Reads hints from chapter.config.ts and tracks progress in a
 * `.housefly-progress` file inside the exercise directory.
 */

import * as path from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import {
  color,
  resolveExerciseDir,
  loadChapterConfig,
} from "../utils.js";

const PROGRESS_FILE = ".housefly-progress";

interface Progress {
  hintsShown: number;
}

export async function showHint(chapter: string): Promise<void> {
  const exerciseDir = resolveExerciseDir(chapter);

  // Load chapter config to get hints
  const config = await loadChapterConfig(exerciseDir);
  const hints: string[] = (config?.hints as string[]) ?? [];

  if (hints.length === 0) {
    console.log(
      color.yellow(`No hints available for chapter ${chapter}.`),
    );
    console.log(
      color.dim("This chapter does not have a chapter.config.ts with hints."),
    );
    return;
  }

  // Load progress
  const progress = await loadProgress(exerciseDir);
  const nextIdx = progress.hintsShown;

  if (nextIdx >= hints.length) {
    console.log(color.magenta("🏁 No more hints!"));
    console.log(
      color.dim(
        `You've seen all ${hints.length} hint(s) for chapter ${chapter}.`,
      ),
    );
    console.log(
      color.dim(
        'Run "housefly reset <chapter>" to also reset hint progress.',
      ),
    );
    return;
  }

  // Show the hint
  const hintNum = nextIdx + 1;
  const total = hints.length;

  console.log(
    color.bold(color.cyan(`💡 Hint ${hintNum}/${total} — Chapter ${chapter}`)),
  );
  console.log(color.dim("─".repeat(50)));
  console.log();
  console.log(`  ${hints[nextIdx]}`);
  console.log();

  if (hintNum < total) {
    console.log(
      color.dim(`Run "housefly hint ${chapter}" again for the next hint.`),
    );
  } else {
    console.log(color.dim("That was the last hint! 🍀"));
  }

  // Save progress
  progress.hintsShown = hintNum;
  await saveProgress(exerciseDir, progress);
}

// ── Progress persistence ─────────────────────────────────────────────

async function loadProgress(exerciseDir: string): Promise<Progress> {
  const filePath = path.join(exerciseDir, PROGRESS_FILE);
  try {
    const content = await readFile(filePath, "utf-8");
    return JSON.parse(content) as Progress;
  } catch {
    return { hintsShown: 0 };
  }
}

async function saveProgress(
  exerciseDir: string,
  progress: Progress,
): Promise<void> {
  const filePath = path.join(exerciseDir, PROGRESS_FILE);
  try {
    await writeFile(filePath, JSON.stringify(progress, null, 2) + "\n", "utf-8");
  } catch (err) {
    // Non-fatal — the exercise dir may not exist yet
    console.error(
      color.dim(`(Could not save progress: ${(err as Error).message})`),
    );
  }
}
