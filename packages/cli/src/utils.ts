/**
 * Shared utilities for the housefly CLI.
 */

import * as path from "node:path";
import { statSync } from "node:fs";
import { pathToFileURL } from "node:url";

// ── ANSI color helpers (no dependencies) ─────────────────────────────

const ESC = "\x1b[";
const RESET = `${ESC}0m`;

export const color = {
  bold: (s: string) => `${ESC}1m${s}${RESET}`,
  dim: (s: string) => `${ESC}2m${s}${RESET}`,
  red: (s: string) => `${ESC}31m${s}${RESET}`,
  green: (s: string) => `${ESC}32m${s}${RESET}`,
  yellow: (s: string) => `${ESC}33m${s}${RESET}`,
  blue: (s: string) => `${ESC}34m${s}${RESET}`,
  magenta: (s: string) => `${ESC}35m${s}${RESET}`,
  cyan: (s: string) => `${ESC}36m${s}${RESET}`,
  gray: (s: string) => `${ESC}90m${s}${RESET}`,
  bgRed: (s: string) => `${ESC}41m${s}${RESET}`,
  bgGreen: (s: string) => `${ESC}42m${s}${RESET}`,
} as const;

// ── Path helpers ─────────────────────────────────────────────────────

/**
 * Zero-pad a chapter number to 2 digits.
 *
 * @example padChapter(3) => "03"
 */
export function padChapter(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Resolve the root of the housefly monorepo by walking up from this
 * file's location until we find a `turbo.json` (or fall back to cwd).
 */
function findRepoRoot(): string {
  let dir = process.cwd();
  while (true) {
    try {
      statSync(path.join(dir, "turbo.json"));
      return dir;
    } catch {
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }
  return process.cwd();
}

const REPO_ROOT = findRepoRoot();

/**
 * Resolve the exercise directory for a given chapter identifier.
 *
 * Accepts a chapter number (string or numeric). Returns the absolute
 * path to `exercises/chapter-NN/`.
 *
 * Falls back to the legacy `apps/` layout when `exercises/` does not
 * exist yet (apps/solutionN for expected output, _solved/chapterN for
 * solutions).
 */
export function resolveExerciseDir(chapter: string | number): string {
  const n = typeof chapter === "string" ? parseInt(chapter, 10) : chapter;
  if (Number.isNaN(n) || n < 1) {
    throw new Error(`Invalid chapter number: ${chapter}`);
  }

  // Prefer the new exercises/ layout
  const newPath = path.join(REPO_ROOT, "exercises", `chapter-${padChapter(n)}`);
  try {
    statSync(newPath);
    return newPath;
  } catch {
    // fall through
  }

  // Legacy layout – apps/chapterN is the starter
  const legacyPath = path.join(REPO_ROOT, "apps", `chapter${n}`);
  try {
    statSync(legacyPath);
    return legacyPath;
  } catch {
    // fall through
  }

  // Return the new-style path even if it doesn't exist yet – the
  // caller can produce a friendlier error.
  return newPath;
}

/**
 * Resolve the path to the expected output file for a chapter.
 *
 * New layout : exercises/chapter-NN/expected/expected.*
 * Legacy     : apps/solutionN/expected.*
 */
export function resolveExpectedFile(chapter: string | number): string | null {
  const n = typeof chapter === "string" ? parseInt(chapter, 10) : chapter;
  const extensions = ["json", "csv", "txt", "yaml", "xml"];

  // New layout
  const newDir = path.join(
    REPO_ROOT,
    "exercises",
    `chapter-${padChapter(n)}`,
    "expected",
  );
  for (const ext of extensions) {
    const p = path.join(newDir, `expected.${ext}`);
    try {
      statSync(p);
      return p;
    } catch {
      /* continue */
    }
  }

  // Legacy layout
  const legacyDir = path.join(REPO_ROOT, "apps", `solution${n}`);
  for (const ext of extensions) {
    const p = path.join(legacyDir, `expected.${ext}`);
    try {
      statSync(p);
      return p;
    } catch {
      /* continue */
    }
  }

  return null;
}

/**
 * Resolve the starter index.ts for a chapter.
 *
 * New layout : exercises/chapter-NN/starter/src/index.ts
 * Legacy     : apps/chapterN/index.ts  (or _solved/chapterN/index.ts)
 */
export function resolveStarterEntry(chapter: string | number): string {
  const n = typeof chapter === "string" ? parseInt(chapter, 10) : chapter;

  const candidates = [
    path.join(
      REPO_ROOT,
      "exercises",
      `chapter-${padChapter(n)}`,
      "starter",
      "src",
      "index.ts",
    ),
    path.join(REPO_ROOT, "apps", `chapter${n}`, "index.ts"),
  ];

  for (const c of candidates) {
    try {
      statSync(c);
      return c;
    } catch {
      /* continue */
    }
  }

  return candidates[0]; // return first candidate so caller gets a clear error
}

/**
 * Dynamically import a chapter.config.ts and return its default export.
 */
export async function loadChapterConfig(
  exerciseDir: string,
): Promise<Record<string, unknown> | null> {
  const configPath = path.join(exerciseDir, "chapter.config.ts");
  try {
    statSync(configPath);
  } catch {
    return null;
  }

  const mod = await import(pathToFileURL(configPath).href);
  return mod.default ?? mod;
}

/**
 * Return the monorepo root.
 */
export function getRepoRoot(): string {
  return REPO_ROOT;
}
