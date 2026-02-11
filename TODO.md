# Housefly Rearchitecture Plan

## Overview

Rearchitect the project to be more efficient, powerful, and better suited for teaching web scraping. The core ideas: treat exercises as curriculum artifacts (not apps), add shared utilities, replace the bash validator with a Deno-native test harness, and improve developer experience with watch mode, hints, and progressive scaffolding.

---

## 1. Restructure the Monorepo

Move from the flat `apps/solutionN` + `apps/chapterN` layout to one that separates curriculum from infrastructure.

```
housefly/
  apps/
    tutorial/                     # Next.js MDX site (make exercise-aware)
    chapter1/                     # Keep as separate servers (different configs)
    chapter2/
    ...
  exercises/                      # Exercises are curriculum, not "apps"
    chapter-01/
      starter/src/index.ts        # Student workspace
      solution/src/index.ts       # Reference answer (currently in _solved/)
      expected/expected.json      # Expected output (currently in apps/solutionN/)
      chapter.config.ts           # Metadata, hints, output format, target URL
      hints.md                    # Progressive hints
    chapter-02/
      ...
  packages/
    scraper-kit/                  # Shared scraping primitives
    test-harness/                 # Deno-native validator replacing bash script
    cli/                          # `housefly validate 3`, `housefly watch 3`
  scripts/
  turbo.json
  deno.json
```

### Why

- Exercises are curriculum artifacts with metadata, not runnable apps
- Reference solutions (`_solved/`) and expected outputs live next to starters
- Chapter target sites stay as separate servers (they have different server configs)
- Clear separation of concerns: targets, tutorial, exercises, tooling

---

## 2. Standardize on Deno

Use Deno as the single runtime for exercises, CLI tooling, and validation.

- [x] Already using Deno to run student solutions
- [ ] Remove Node/tsx as an execution shim — go all-in on Deno
- [ ] Use `deno.json` / import maps per exercise for clean dependency declaration
- [ ] Use Deno's built-in test runner for validation (replaces bash + jq)
- [ ] Use `deno fmt` / `deno lint` for consistent code style
- [ ] Lean into the permissions model pedagogically — teach students why `--allow-net` matters

### Friction to watch for

- **Playwright and Crawlee** are Node-first. Test these chapters early using `npm:` specifiers to confirm Deno compat.

---

## 3. Build `packages/scraper-kit`

A small set of shared Deno-native utilities that reduce boilerplate without hiding the learning.

### Modules

- **`http.ts`** — `fetchText()`, `fetchJson()`, `fetchWithRetry({ retries, backoff, retryOn })`; polite defaults (user-agent, delays)
- **`parse.ts`** — `loadHtml(body)` (wraps cheerio), text/attr/number helpers, trimming utilities
- **`output.ts`** — `printJson(data)` (stable key ordering), `toCsv(rows, columns)`, `normalizeForCompare()`
- **`browser.ts`** — `withPlaywright(fn, { headless, slowMo })` for later chapters
- **`logging.ts`** — `debug()` silenced unless `DEBUG=1`

### Design principles

- Prefer small functions over a `BaseScraper` class hierarchy
- Only abstract HTTP/retry/output — leave selectors, pagination, and session logic to students
- If a single abstraction is needed: `defineScraper({ run(ctx) })` where `ctx` provides `targetUrl`, `http`, `debug`, etc.

---

## 4. Replace Bash Validator with Deno-Native Test Harness

`scripts/check_answers.sh` is brittle (shell edge cases, ad-hoc JSON comparison, no watch mode).

### Build `packages/test-harness`

- **`execute.ts`** — Run an exercise's `index.ts`, capture stdout
- **`compare.ts`** — Semantic JSON comparison (sorted keys), CSV normalization, exact text matching
- **`validate.ts`** — Orchestrate execute + compare, return structured results

### Build `packages/cli`

Commands:

| Command | Description |
|---------|-------------|
| `housefly run 2` | Execute chapter 2's starter code |
| `housefly validate 2` | Run + compare against expected output |
| `housefly watch 2` | Re-run + revalidate on file change |
| `housefly validate 2 --explain` | Structured failure info, not just a diff |
| `housefly hint 2` | Print next progressive hint |
| `housefly reset 2` | Restore starter files to original state |
| `housefly open 2` | Open tutorial page + exercise folder |
| `housefly validate --all` | Run all chapters (CI mode) |

---

## 5. Add Exercise Metadata

Each exercise gets a `chapter.config.ts` with structured metadata:

```ts
export default {
  id: "chapter-02",
  title: "Lists and Selectors",
  targetUrl: "http://localhost:3002",  // fixed local port
  output: { kind: "csv" },
  hints: [
    "Use `.product` to find each product card.",
    "Extract text with `.text().trim()`.",
    "Check expected.csv for the column order.",
  ],
  checkpoints: [
    { id: "selectors", description: "Select all products" },
    { id: "fields", description: "Extract name, price, sku" },
    { id: "format", description: "Output as CSV" },
  ],
} as const;
```

This enables:
- CLI hint/progress commands
- Tutorial site can display progress checklists
- Validation can give checkpoint-specific feedback
- Each exercise declares its own target URL (no hardcoded Netlify URLs)

---

## 6. Exercises Own Their Dependencies

Each exercise's `deno.json` declares only what the student is expected to use:

- Chapters 1-3: `cheerio` only
- Chapters 4-5, 8: `cheerio` + `playwright`
- Chapter 6: `crawlee`
- Chapter 9: just `fetch` (built-in)
- Chapter 10: `pdf-parse`

Shared utilities come from workspace packages (`@housefly/scraper-kit`).

### Why

- Pedagogically clear — students see exactly what tools each chapter introduces
- No "magic globals" from root dependencies
- Smaller mental model per chapter

---

## 7. Local Target Servers with Fixed Ports

Keep chapter target sites as separate servers (they have different configs), but make them deterministic and local-first.

- [ ] Assign each chapter server a fixed port (3001, 3002, ..., 3011)
- [ ] Turbo orchestrates all of them: `turbo dev` starts all targets
- [ ] Exercise configs reference `http://localhost:300X` instead of Netlify URLs
- [ ] Optionally keep Netlify deploys for remote/hosted use, but local is the default

### Benefits

- Deterministic content, no network flakiness
- Offline-friendly
- Students can inspect/debug the target server source code

---

## 8. Make Tutorial Exercise-Aware

The Next.js tutorial site should source metadata from `exercises/chapter-XX/chapter.config.ts`:

- [ ] Display "Open exercise" button linking to local path
- [ ] Show progress checklist from chapter config
- [ ] Embed expected output schema/format
- [ ] Show CLI commands for that chapter (`housefly run 2`, etc.)
- [ ] Optionally track completion state

---

## 9. Starter Code Improvements

Improve the student-facing starter code:

- [ ] Add TODO blocks that match tutorial sections
- [ ] Provide typed function signatures (students fill in implementation)
- [ ] Add `// @checkpoint selectors` markers for targeted validation feedback
- [ ] Include inline links to relevant tutorial sections

---

## Suggested Migration Order

Start small, prove the pattern, then migrate remaining chapters.

1. **Build `packages/cli` + `packages/test-harness`** — this is the highest leverage change; unlocks watch mode, hints, and structured validation
2. **Migrate 3 representative chapters** — pick one static HTML (ch 2), one Playwright (ch 4), one API (ch 7) to prove the exercise structure
3. **Build `packages/scraper-kit`** — extract common patterns from migrated chapters
4. **Assign fixed ports to all chapter servers** — update exercise configs
5. **Migrate remaining 8 chapters**
6. **Make tutorial exercise-aware** — integrate metadata into the MDX site
7. **Add progressive scaffolding** — hints, checkpoints, reset commands
