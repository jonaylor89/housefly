import { readFile } from "node:fs/promises";
import { extname } from "node:path";

export interface CompareResult {
  match: boolean;
  diff?: string;
  format: "json" | "csv" | "text";
}

/**
 * Recursively sort all keys in a JSON value so that object key order
 * doesn't affect comparison.
 */
function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value !== null && typeof value === "object") {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      sorted[key] = sortKeysDeep((value as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return value;
}

/**
 * Build a simple line-by-line diff string showing expected vs actual.
 * Lines prefixed with `-` are from expected, `+` from actual.
 */
function lineDiff(expected: string, actual: string): string {
  const expectedLines = expected.split("\n");
  const actualLines = actual.split("\n");
  const maxLen = Math.max(expectedLines.length, actualLines.length);
  const parts: string[] = [];

  for (let i = 0; i < maxLen; i++) {
    const eLine = expectedLines[i];
    const aLine = actualLines[i];

    if (eLine === aLine) {
      parts.push(` ${eLine ?? ""}`);
    } else {
      if (eLine !== undefined) parts.push(`-${eLine}`);
      if (aLine !== undefined) parts.push(`+${aLine}`);
    }
  }

  return parts.join("\n");
}

/**
 * Parse both strings as JSON, sort keys recursively, and compare.
 */
export function compareJson(actual: string, expected: string): CompareResult {
  try {
    const actualParsed = sortKeysDeep(JSON.parse(actual));
    const expectedParsed = sortKeysDeep(JSON.parse(expected));

    const actualNormalized = JSON.stringify(actualParsed, null, 2);
    const expectedNormalized = JSON.stringify(expectedParsed, null, 2);

    if (actualNormalized === expectedNormalized) {
      return { match: true, format: "json" };
    }

    return {
      match: false,
      diff: lineDiff(expectedNormalized, actualNormalized),
      format: "json",
    };
  } catch (err) {
    return {
      match: false,
      diff: `JSON parse error: ${(err as Error).message}\n\nExpected:\n${expected}\n\nActual:\n${actual}`,
      format: "json",
    };
  }
}

/**
 * Normalize CSV content: trim each row, normalize line endings,
 * remove trailing empty lines.
 */
function normalizeCsv(content: string): string {
  return content
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line, idx, arr) => {
      // Remove trailing empty lines
      if (line === "" && idx === arr.length - 1) return false;
      return true;
    })
    .join("\n");
}

/**
 * Normalize CSV (trim rows, normalize line endings), compare line by line.
 */
export function compareCsv(actual: string, expected: string): CompareResult {
  const actualNormalized = normalizeCsv(actual);
  const expectedNormalized = normalizeCsv(expected);

  if (actualNormalized === expectedNormalized) {
    return { match: true, format: "csv" };
  }

  return {
    match: false,
    diff: lineDiff(expectedNormalized, actualNormalized),
    format: "csv",
  };
}

/**
 * Exact text comparison after trimming both sides.
 */
export function compareText(actual: string, expected: string): CompareResult {
  const actualTrimmed = actual.trim();
  const expectedTrimmed = expected.trim();

  if (actualTrimmed === expectedTrimmed) {
    return { match: true, format: "text" };
  }

  return {
    match: false,
    diff: lineDiff(expectedTrimmed, actualTrimmed),
    format: "text",
  };
}

/**
 * Detect format from file extension (.json, .csv, .txt) and dispatch
 * to the appropriate compare function. Reads the expected file from disk.
 */
export async function autoCompare(
  actual: string,
  expectedFilePath: string,
): Promise<CompareResult> {
  const expectedContent = await readFile(expectedFilePath, "utf-8");
  const ext = extname(expectedFilePath).toLowerCase();

  switch (ext) {
    case ".json":
      return compareJson(actual, expectedContent);
    case ".csv":
      return compareCsv(actual, expectedContent);
    case ".txt":
    default:
      return compareText(actual, expectedContent);
  }
}
