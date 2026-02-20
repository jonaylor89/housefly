/**
 * `housefly watch <chapter>` — watch the exercise source directory for
 * file changes and re-run validation on every save.
 *
 * Uses node:fs watch for native file-system events with a 300ms debounce.
 */

import * as path from "node:path";
import { statSync, watch } from "node:fs";
import {
  color,
  resolveExerciseDir,
  resolveStarterEntry,
  getRepoRoot,
  padChapter,
} from "../utils.js";
import { validateChapter } from "./validate.js";

export async function watchChapter(chapter: string): Promise<void> {
  const n = parseInt(chapter, 10);

  // Determine the directory to watch
  const watchDir = resolveWatchDir(n);

  try {
    statSync(watchDir);
  } catch {
    console.error(color.red(`Watch directory not found: ${watchDir}`));
    process.exit(1);
  }

  console.log(color.bold(`👁  Watching chapter ${chapter} for changes…`));
  console.log(color.gray(`   ${watchDir}`));
  console.log(color.dim("   Press Ctrl+C to stop.\n"));

  // Initial run
  await runValidationQuiet(chapter);

  // Watch with debounce
  const DEBOUNCE_MS = 300;
  let timer: ReturnType<typeof setTimeout> | null = null;

  watch(watchDir, { recursive: true }, (_eventType, filename) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(async () => {
      const changedFile = filename ?? "unknown";
      console.log(
        color.dim(`\n── ${new Date().toLocaleTimeString()} `) +
          color.yellow(`changed: ${changedFile}`),
      );

      await runValidationQuiet(chapter);
    }, DEBOUNCE_MS);
  });
}

/**
 * Run validation and catch the process.exit() that validateChapter calls
 * on failure — in watch mode we want to keep running.
 */
async function runValidationQuiet(chapter: string): Promise<void> {
  // Override process.exit temporarily so validation failures don't kill
  // the watcher process.
  const originalExit = process.exit;

  try {
    process.exit = ((_code?: number) => {
      // no-op in watch mode
    }) as typeof process.exit;

    await validateChapter(chapter, { explain: true });
  } catch (err) {
    console.error(color.red(`Error: ${(err as Error).message}`));
  } finally {
    process.exit = originalExit;
  }
}

/**
 * Resolve the directory to watch for a given chapter.
 *
 * New layout:  exercises/chapter-NN/starter/src/
 * Legacy:      apps/chapterN/
 */
function resolveWatchDir(chapter: number): string {
  const root = getRepoRoot();

  // New layout
  const newDir = path.join(
    root,
    "exercises",
    `chapter-${padChapter(chapter)}`,
    "starter",
    "src",
  );
  try {
    statSync(newDir);
    return newDir;
  } catch {
    // fall through
  }

  // Legacy
  const legacyDir = path.join(root, "apps", `chapter${chapter}`);
  try {
    statSync(legacyDir);
    return legacyDir;
  } catch {
    // fall through
  }

  return newDir;
}
