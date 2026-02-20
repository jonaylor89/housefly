import { readdir, stat, access } from "node:fs/promises";
import { join, basename, resolve } from "node:path";
import { executeExercise } from "./execute.js";
import { autoCompare } from "./compare.js";
import type { CompareResult } from "./compare.js";

export interface ValidationResult {
  chapter: string;
  passed: boolean;
  duration: number;
  output?: string;
  error?: string;
  diff?: string;
  format: string;
}

interface ValidateOptions {
  useSolution?: boolean;
}

// ANSI color helpers for stderr output
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;

/**
 * Check if a file exists at the given path.
 */
async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Find the expected.* file in a solution directory.
 * Looks for expected.txt, expected.json, expected.csv, etc.
 */
async function findExpectedFile(solutionDir: string): Promise<string | null> {
  const extensions = ["txt", "json", "csv", "yaml", "xml"];

  for (const ext of extensions) {
    const filePath = join(solutionDir, `expected.${ext}`);
    if (await fileExists(filePath)) {
      return filePath;
    }
  }

  // Fallback: look for any file starting with "expected."
  try {
    const entries = await readdir(solutionDir);
    const expectedFile = entries.find((e) => e.startsWith("expected."));
    if (expectedFile) {
      return join(solutionDir, expectedFile);
    }
  } catch {
    // directory doesn't exist or can't be read
  }

  return null;
}

/**
 * Extract the chapter number from a directory name.
 * e.g. "chapter1" -> "1", "solution3" -> "3"
 */
function extractChapterNumber(dirName: string): string | null {
  const match = dirName.match(/(\d+)$/);
  return match ? match[1] : null;
}

/**
 * Try to load chapter.config.ts metadata if it exists.
 * Returns null if the file doesn't exist or can't be loaded.
 */
async function loadChapterConfig(
  exerciseDir: string,
): Promise<Record<string, unknown> | null> {
  const configPath = join(exerciseDir, "chapter.config.ts");
  if (!(await fileExists(configPath))) {
    return null;
  }

  try {
    const mod = await import(configPath);
    return mod.default ?? mod;
  } catch {
    return null;
  }
}

/**
 * Load environment variables from a .env file if it exists.
 * Returns a Record<string, string> of the parsed variables.
 */
async function loadEnvFile(rootDir: string): Promise<Record<string, string>> {
  const envPath = join(rootDir, ".env");
  const env: Record<string, string> = {};

  try {
    const { readFile } = await import("node:fs/promises");
    const content = await readFile(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let value = trimmed.slice(eqIdx + 1).trim();
      // Remove surrounding quotes
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
  } catch {
    // .env file doesn't exist, that's fine
  }

  return env;
}

/**
 * Validate a single exercise.
 *
 * The exercise structure mirrors housefly's layout:
 * - `apps/solutionN/` contains `expected.*` and the starter `index.ts`
 * - `_solved/chapterN/` contains the reference solution `index.ts`
 *
 * @param exerciseDir - Path to the exercise directory (e.g. `apps/solution1` or `_solved/chapter1`)
 * @param options.useSolution - If true, run from `_solved/chapterN/` instead of `apps/solutionN/`
 */
export async function validateExercise(
  exerciseDir: string,
  options?: ValidateOptions,
): Promise<ValidationResult> {
  const absDir = resolve(exerciseDir);
  const dirName = basename(absDir);
  const chapterNum = extractChapterNumber(dirName);
  const chapter = chapterNum ? `Chapter ${chapterNum}` : dirName;

  // Determine root directory (two levels up from exercise dir)
  const rootDir = resolve(absDir, "../..");

  // Determine where to find index.ts and expected.*
  let indexDir: string;
  let solutionDir: string;

  if (options?.useSolution) {
    // Running the solved version: index.ts is in _solved/chapterN/
    // expected.* is in apps/solutionN/
    if (dirName.startsWith("solution")) {
      indexDir = join(rootDir, "_solved", `chapter${chapterNum}`);
      solutionDir = absDir;
    } else if (dirName.startsWith("chapter")) {
      indexDir = absDir;
      solutionDir = join(rootDir, "apps", `solution${chapterNum}`);
    } else {
      indexDir = absDir;
      solutionDir = absDir;
    }
  } else {
    // Running the starter version: both index.ts and expected.* in apps/solutionN/
    if (dirName.startsWith("chapter")) {
      indexDir = absDir;
      solutionDir = join(rootDir, "apps", `solution${chapterNum}`);
    } else {
      indexDir = absDir;
      solutionDir = absDir;
    }
  }

  const indexPath = join(indexDir, "index.ts");
  const config = await loadChapterConfig(indexDir);

  // Check that index.ts exists
  if (!(await fileExists(indexPath))) {
    return {
      chapter,
      passed: false,
      duration: 0,
      error: `index.ts not found at ${indexPath}`,
      format: "unknown",
    };
  }

  // Find expected file
  const expectedFile = await findExpectedFile(solutionDir);
  if (!expectedFile) {
    return {
      chapter,
      passed: false,
      duration: 0,
      error: `No expected.* file found in ${solutionDir}`,
      format: "unknown",
    };
  }

  // Load .env from root
  const envVars = await loadEnvFile(rootDir);

  // Execute the exercise
  const start = performance.now();
  let execResult;
  try {
    execResult = await executeExercise(indexPath, envVars);
  } catch (err) {
    const duration = Math.round(performance.now() - start);
    return {
      chapter,
      passed: false,
      duration,
      error: `Execution failed: ${(err as Error).message}`,
      format: "unknown",
    };
  }
  const duration = Math.round(performance.now() - start);

  // Check for execution errors
  if (execResult.exitCode !== 0) {
    const result: ValidationResult = {
      chapter,
      passed: false,
      duration,
      output: execResult.stdout,
      error:
        execResult.stderr || `Process exited with code ${execResult.exitCode}`,
      format: "unknown",
    };
    printResult(result);
    return result;
  }

  // Compare output
  let compareResult: CompareResult;
  try {
    compareResult = await autoCompare(execResult.stdout, expectedFile);
  } catch (err) {
    const result: ValidationResult = {
      chapter,
      passed: false,
      duration,
      output: execResult.stdout,
      error: `Comparison failed: ${(err as Error).message}`,
      format: "unknown",
    };
    printResult(result);
    return result;
  }

  const result: ValidationResult = {
    chapter,
    passed: compareResult.match,
    duration,
    output: execResult.stdout,
    diff: compareResult.diff,
    format: compareResult.format,
  };

  printResult(result);
  return result;
}

/**
 * Print a colorful result to stderr.
 */
function printResult(result: ValidationResult): void {
  const icon = result.passed ? green("✅") : red("❌");
  const status = result.passed ? green("PASS") : red("FAIL");
  const durationStr = dim(`(${result.duration}ms)`);

  console.error(`${icon} ${bold(result.chapter)} ${status} ${durationStr}`);

  if (result.error) {
    console.error(red(`   Error: ${result.error}`));
  }

  if (result.diff) {
    console.error(cyan("   Diff:"));
    for (const line of result.diff.split("\n").slice(0, 30)) {
      if (line.startsWith("+")) {
        console.error(green(`   ${line}`));
      } else if (line.startsWith("-")) {
        console.error(red(`   ${line}`));
      } else {
        console.error(dim(`   ${line}`));
      }
    }
    const totalLines = result.diff.split("\n").length;
    if (totalLines > 30) {
      console.error(dim(`   ... and ${totalLines - 30} more lines`));
    }
  }
}

/**
 * Validate all exercises found in a directory.
 *
 * Scans for directories matching `solution*` or `chapter*` patterns.
 *
 * @param exercisesDir - Path to the directory containing exercise folders (e.g. `apps/`)
 * @param options.useSolution - If true, run solved versions from `_solved/`
 */
export async function validateAll(
  exercisesDir: string,
  options?: ValidateOptions,
): Promise<ValidationResult[]> {
  const absDir = resolve(exercisesDir);
  const entries = await readdir(absDir);

  // Find exercise directories (solution* patterns)
  const exerciseDirs = entries
    .filter((entry) => /^solution\d+$/.test(entry))
    .sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ""), 10);
      const numB = parseInt(b.replace(/\D/g, ""), 10);
      return numA - numB;
    });

  if (exerciseDirs.length === 0) {
    console.error(red("No exercise directories found."));
    return [];
  }

  console.error(bold(`\nRunning ${exerciseDirs.length} exercise(s)...\n`));

  const results: ValidationResult[] = [];

  for (const dir of exerciseDirs) {
    const fullPath = join(absDir, dir);
    const dirStat = await stat(fullPath);
    if (!dirStat.isDirectory()) continue;

    const result = await validateExercise(fullPath, options);
    results.push(result);
  }

  // Print summary
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  console.error("");
  console.error(bold("━".repeat(50)));
  console.error(
    bold(
      `Results: ${green(`${passed} passed`)}, ${failed > 0 ? red(`${failed} failed`) : `${failed} failed`}`,
    ),
  );
  console.error(dim(`Total time: ${(totalDuration / 1000).toFixed(1)}s`));
  console.error(bold("━".repeat(50)));
  console.error("");

  return results;
}
