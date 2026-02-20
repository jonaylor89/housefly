/**
 * `housefly run <chapter>` — execute a chapter's starter code and
 * stream its stdout to the terminal.
 */

import { statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { realpathSync } from "node:fs";
import { spawn } from "node:child_process";
import * as path from "node:path";
import { color, resolveStarterEntry } from "../utils.js";

export async function runChapter(chapter: string): Promise<void> {
  const entry = resolveStarterEntry(chapter);

  try {
    statSync(entry);
  } catch {
    console.error(color.red(`Exercise entry not found: ${entry}`));
    process.exit(1);
  }

  console.log(
    color.cyan(`▶ Running chapter ${chapter}`) + color.gray(` (${entry})`),
  );
  console.log(color.dim("─".repeat(60)));

  const env = await loadEnv();

  const child = spawn("npx", ["tsx", entry], {
    stdio: ["inherit", "pipe", "pipe"],
    env,
  });

  child.stdout.on("data", (data: Buffer) => {
    process.stdout.write(data);
  });

  child.stderr.on("data", (data: Buffer) => {
    console.error(color.yellow(data.toString()));
  });

  const code = await new Promise<number>((resolve) => {
    child.on("close", (code) => resolve(code ?? 0));
  });

  console.log(color.dim("─".repeat(60)));

  if (code === 0) {
    console.log(color.green("✔ Process exited successfully."));
  } else {
    console.error(color.red(`✘ Process exited with code ${code}.`));
    process.exit(code);
  }
}

/**
 * Load .env file from the repo root if it exists.
 */
async function loadEnv(): Promise<Record<string, string>> {
  const env: Record<string, string> = {};
  for (const [k, v] of Object.entries(process.env)) {
    if (v !== undefined) env[k] = v;
  }

  // Walk up to find .env
  let dir = process.cwd();
  while (true) {
    const envPath = path.join(dir, ".env");
    try {
      const content = await readFile(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        env[key] = val;
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
