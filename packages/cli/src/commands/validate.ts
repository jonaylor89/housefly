/**
 * `housefly validate <chapter>` — run a chapter's starter code and
 * compare its output against the expected output file.
 *
 * `housefly validate --all` — validate every chapter that has an
 * expected output file.
 */

import * as path from "node:path";
import { statSync, readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import {
  color,
  resolveStarterEntry,
  resolveExpectedFile,
  resolveExerciseDir,
  getRepoRoot,
  padChapter,
} from "../utils.js";

// ── Types ────────────────────────────────────────────────────────────

interface ValidateOptions {
  explain?: boolean;
}

interface ValidationResult {
  chapter: number;
  passed: boolean;
  message: string;
  diff?: string;
}

// ── Single chapter validation ────────────────────────────────────────

export async function validateChapter(
  chapter: string,
  opts: ValidateOptions = {},
): Promise<void> {
  const result = await runValidation(parseInt(chapter, 10));

  if (result.passed) {
    console.log(color.green(`🎉 Chapter ${chapter}: PASSED! 🎯`));
  } else {
    console.error(color.red(`💥 Chapter ${chapter}: FAILED`));
    console.error(color.yellow(result.message));

    if (opts.explain && result.diff) {
      console.log();
      console.log(color.bold("─── Detailed diff ───"));
      console.log(result.diff);
      console.log(color.bold("─────────────────────"));
    }

    console.log();
    console.log(color.cyan("⚡ Try fixing the errors and run again! 🚀"));
    process.exit(1);
  }
}

// ── Validate all chapters ────────────────────────────────────────────

export async function validateAllChapters(
  opts: ValidateOptions = {},
): Promise<void> {
  console.log(color.bold("🔍 Validating all chapters…\n"));

  const results: ValidationResult[] = [];

  // Discover chapters: try exercises/ first, fall back to apps/solutionN
  const chapters = discoverChapters();

  if (chapters.length === 0) {
    console.error(color.yellow("No chapters with expected output found."));
    process.exit(1);
  }

  for (const n of chapters) {
    process.stdout.write(color.gray(`  Chapter ${n}… `));

    const result = await runValidation(n);
    results.push(result);

    if (result.passed) {
      process.stdout.write(color.green("✔ PASS\n"));
    } else {
      process.stdout.write(color.red("✘ FAIL\n"));
      if (opts.explain && result.diff) {
        console.log(color.dim(result.diff));
      }
    }
  }

  // Summary table
  console.log();
  console.log(color.bold("─── Summary ─────────────────────────────────"));

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  for (const r of results) {
    const icon = r.passed ? color.green("✔") : color.red("✘");
    const status = r.passed ? color.green("PASS") : color.red("FAIL");
    console.log(`  ${icon} Chapter ${String(r.chapter).padStart(2)} ${status}`);
  }

  console.log(color.bold("──────────────────────────────────────────────"));
  console.log(
    `  ${color.green(`${passed} passed`)}  ${failed > 0 ? color.red(`${failed} failed`) : color.dim("0 failed")}  ${color.dim(`${results.length} total`)}`,
  );

  if (failed > 0) {
    process.exit(1);
  }
}

// ── Core validation logic ────────────────────────────────────────────

async function runValidation(chapter: number): Promise<ValidationResult> {
  const entry = resolveStarterEntry(chapter);
  const expectedPath = resolveExpectedFile(chapter);

  if (!expectedPath) {
    return {
      chapter,
      passed: false,
      message: `No expected output file found for chapter ${chapter}.`,
    };
  }

  try {
    statSync(entry);
  } catch {
    return {
      chapter,
      passed: false,
      message: `Starter entry not found: ${entry}`,
    };
  }

  // Load .env
  const env = await loadEnv();

  // Execute the student solution
  let output: string;
  let exitCode: number;

  try {
    const result = await runProcess("npx", ["tsx", entry], env);
    output = result.stdout.trim();
    exitCode = result.code;
  } catch (err) {
    return {
      chapter,
      passed: false,
      message: `Failed to execute: ${(err as Error).message}`,
    };
  }

  if (exitCode !== 0) {
    return {
      chapter,
      passed: false,
      message: `Process exited with code ${exitCode}.`,
    };
  }

  // Load expected output
  const expected = (await readFile(expectedPath, "utf-8")).trim();
  const ext = path.extname(expectedPath).slice(1);

  // Compare
  const { passed, diff } = compare(output, expected, ext);

  return {
    chapter,
    passed,
    message: passed
      ? "Output matches expected."
      : "Output differs from expected.",
    diff,
  };
}

// ── Process runner ───────────────────────────────────────────────────

function runProcess(
  cmd: string,
  args: string[],
  env: Record<string, string>,
): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: ["inherit", "pipe", "pipe"],
      env,
    });

    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];

    child.stdout.on("data", (data: Buffer) => stdoutChunks.push(data));
    child.stderr.on("data", (data: Buffer) => stderrChunks.push(data));

    child.on("error", reject);
    child.on("close", (code) => {
      resolve({
        stdout: Buffer.concat(stdoutChunks).toString("utf-8"),
        stderr: Buffer.concat(stderrChunks).toString("utf-8"),
        code: code ?? 0,
      });
    });
  });
}

// ── Comparison helpers ───────────────────────────────────────────────

function compare(
  actual: string,
  expected: string,
  format: string,
): { passed: boolean; diff?: string } {
  // JSON: semantic comparison (sorted keys)
  if (format === "json") {
    try {
      const a = JSON.parse(actual);
      const e = JSON.parse(expected);
      const aSorted = JSON.stringify(sortDeep(a), null, 2);
      const eSorted = JSON.stringify(sortDeep(e), null, 2);

      if (aSorted === eSorted) {
        return { passed: true };
      }

      return {
        passed: false,
        diff: buildDiff(eSorted, aSorted),
      };
    } catch {
      // Fall through to text comparison
    }
  }

  // CSV: normalize line endings, trim each cell
  if (format === "csv") {
    const normA = normalizeCsv(actual);
    const normE = normalizeCsv(expected);

    if (normA === normE) {
      return { passed: true };
    }

    return {
      passed: false,
      diff: buildDiff(normE, normA),
    };
  }

  // Plain text comparison
  if (actual === expected) {
    return { passed: true };
  }

  return {
    passed: false,
    diff: buildDiff(expected, actual),
  };
}

function sortDeep(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortDeep);
  if (obj !== null && typeof obj === "object") {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(obj as Record<string, unknown>).sort()) {
      sorted[key] = sortDeep((obj as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return obj;
}

function normalizeCsv(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) =>
      line
        .split(",")
        .map((cell) => cell.trim())
        .join(","),
    )
    .filter((l) => l.length > 0)
    .join("\n");
}

function buildDiff(expected: string, actual: string): string {
  const expLines = expected.split("\n");
  const actLines = actual.split("\n");
  const lines: string[] = [];

  const max = Math.max(expLines.length, actLines.length);
  for (let i = 0; i < max; i++) {
    const e = expLines[i] ?? "";
    const a = actLines[i] ?? "";
    if (e === a) {
      lines.push(color.dim(`  ${e}`));
    } else {
      if (e) lines.push(color.red(`- ${e}`));
      if (a) lines.push(color.green(`+ ${a}`));
    }
  }

  return lines.join("\n");
}

// ── Chapter discovery ────────────────────────────────────────────────

function discoverChapters(): number[] {
  const root = getRepoRoot();
  const chapters: number[] = [];

  // Try new layout
  try {
    for (const entry of readdirSync(path.join(root, "exercises"), {
      withFileTypes: true,
    })) {
      if (entry.isDirectory() && entry.name.startsWith("chapter-")) {
        const n = parseInt(entry.name.replace("chapter-", ""), 10);
        if (!Number.isNaN(n)) chapters.push(n);
      }
    }
  } catch {
    // exercises/ doesn't exist yet
  }

  // Legacy layout
  if (chapters.length === 0) {
    try {
      for (const entry of readdirSync(path.join(root, "apps"), {
        withFileTypes: true,
      })) {
        if (entry.isDirectory() && entry.name.startsWith("solution")) {
          const n = parseInt(entry.name.replace("solution", ""), 10);
          if (!Number.isNaN(n)) chapters.push(n);
        }
      }
    } catch {
      // no apps/ either
    }
  }

  return chapters.sort((a, b) => a - b);
}

// ── .env loader ──────────────────────────────────────────────────────

async function loadEnv(): Promise<Record<string, string>> {
  const env: Record<string, string> = {};

  // Copy current env
  for (const [k, v] of Object.entries(process.env)) {
    if (v !== undefined) env[k] = v;
  }

  let dir = process.cwd();
  while (true) {
    try {
      const content = await readFile(path.join(dir, ".env"), "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx === -1) continue;
        env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
      }
      break;
    } catch {
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }

  return env;
}
