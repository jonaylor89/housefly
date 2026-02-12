import { spawn } from "node:child_process";
import { resolve } from "node:path";

export interface ExecuteResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

/**
 * Execute an exercise's index.ts file using tsx.
 *
 * @param indexPath - Path to the exercise's index.ts file
 * @param env - Optional additional environment variables
 * @returns stdout, stderr, and exit code
 */
export async function executeExercise(
  indexPath: string,
  env?: Record<string, string>,
): Promise<ExecuteResult> {
  const absolutePath = resolve(indexPath);

  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["tsx", absolutePath], {
      env: { ...process.env, ...env },
      stdio: ["ignore", "pipe", "pipe"],
    });

    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];

    child.stdout.on("data", (chunk: Buffer) => stdoutChunks.push(chunk));
    child.stderr.on("data", (chunk: Buffer) => stderrChunks.push(chunk));

    child.on("error", (err) => {
      reject(new Error(`Failed to spawn tsx process: ${err.message}`));
    });

    child.on("close", (code) => {
      resolve({
        stdout: Buffer.concat(stdoutChunks).toString("utf-8"),
        stderr: Buffer.concat(stderrChunks).toString("utf-8"),
        exitCode: code ?? 1,
      });
    });
  });
}
