#!/usr/bin/env node

/**
 * housefly — CLI for the Housefly web-scraping curriculum.
 *
 * Usage:
 *   housefly run <chapter>        Run a chapter's starter code
 *   housefly validate <chapter>   Run + compare against expected output
 *   housefly validate --all       Validate all chapters
 *   housefly watch <chapter>      Re-run validation on file changes
 *   housefly hint <chapter>       Show the next progressive hint
 *   housefly reset <chapter>      Restore starter files to original
 *   housefly open <chapter>       Open exercise folder
 *   housefly help                 Show this message
 */

import { color } from "./utils.js";
import { runChapter } from "./commands/run.js";
import { validateChapter, validateAllChapters } from "./commands/validate.js";
import { watchChapter } from "./commands/watch.js";
import { showHint } from "./commands/hint.js";
import { resetChapter } from "./commands/reset.js";
import { openChapter } from "./commands/open.js";

// ── Help text ────────────────────────────────────────────────────────

function printHelp(): void {
  console.log(`
${color.bold("housefly")} — CLI for the Housefly web-scraping curriculum

${color.bold("USAGE")}
  housefly ${color.cyan("<command>")} ${color.gray("[options]")}

${color.bold("COMMANDS")}
  ${color.cyan("run")} ${color.gray("<chapter>")}          Run a chapter's starter code
  ${color.cyan("validate")} ${color.gray("<chapter>")}     Run + compare against expected output
  ${color.cyan("validate")} ${color.gray("--all")}         Validate every chapter
  ${color.cyan("watch")} ${color.gray("<chapter>")}        Re-run validation on file changes
  ${color.cyan("hint")} ${color.gray("<chapter>")}         Show the next progressive hint
  ${color.cyan("reset")} ${color.gray("<chapter>")}        Restore starter files to original state
  ${color.cyan("open")} ${color.gray("<chapter>")}         Open exercise folder in file manager
  ${color.cyan("help")}                    Show this message

${color.bold("OPTIONS")}
  ${color.gray("--all")}        With ${color.cyan("validate")}: run all chapters
  ${color.gray("--explain")}    With ${color.cyan("validate")}: show structured error detail

${color.bold("EXAMPLES")}
  housefly run 2
  housefly validate 3 --explain
  housefly watch 5
  housefly validate --all
`);
}

// ── Argument parsing ─────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printHelp();
    process.exit(0);
  }

  const command = args[0];

  switch (command) {
    case "run": {
      const chapter = args[1];
      if (!chapter) {
        console.error(color.red("Error: missing chapter number."));
        console.error("Usage: housefly run <chapter>");
        process.exit(1);
      }
      await runChapter(chapter);
      break;
    }

    case "validate": {
      const hasAll = args.includes("--all");
      const hasExplain = args.includes("--explain");

      if (hasAll) {
        await validateAllChapters({ explain: hasExplain });
      } else {
        const chapter = args.find((a) => !a.startsWith("--") && a !== command);
        if (!chapter) {
          console.error(color.red("Error: missing chapter number or --all."));
          console.error("Usage: housefly validate <chapter> | --all");
          process.exit(1);
        }
        await validateChapter(chapter, { explain: hasExplain });
      }
      break;
    }

    case "watch": {
      const chapter = args[1];
      if (!chapter) {
        console.error(color.red("Error: missing chapter number."));
        console.error("Usage: housefly watch <chapter>");
        process.exit(1);
      }
      await watchChapter(chapter);
      break;
    }

    case "hint": {
      const chapter = args[1];
      if (!chapter) {
        console.error(color.red("Error: missing chapter number."));
        console.error("Usage: housefly hint <chapter>");
        process.exit(1);
      }
      await showHint(chapter);
      break;
    }

    case "reset": {
      const chapter = args[1];
      if (!chapter) {
        console.error(color.red("Error: missing chapter number."));
        console.error("Usage: housefly reset <chapter>");
        process.exit(1);
      }
      await resetChapter(chapter);
      break;
    }

    case "open": {
      const chapter = args[1];
      if (!chapter) {
        console.error(color.red("Error: missing chapter number."));
        console.error("Usage: housefly open <chapter>");
        process.exit(1);
      }
      await openChapter(chapter);
      break;
    }

    case "help":
    case "--help":
    case "-h":
      printHelp();
      break;

    default:
      console.error(color.red(`Unknown command: ${command}`));
      printHelp();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(color.red(`Fatal: ${err.message}`));
  process.exit(1);
});
