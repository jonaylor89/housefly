#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────
# test_solutions.sh — Run every chapter's reference solution and
# compare its stdout against the expected output file.
#
# Prerequisites:
#   1. npm install                (dependencies)
#   2. turbo dev                  (chapter servers on ports 3001–3011)
#   3. .env at repo root          (OPENAI_API_KEY for chapter 3)
#
# Usage:
#   ./scripts/test_solutions.sh              # run all chapters
#   ./scripts/test_solutions.sh 1 4 7        # run specific chapters
#   ./scripts/test_solutions.sh --skip 3     # skip chapter 3 (needs OpenAI)
#
# Exit codes:
#   0  all solutions matched expected output
#   1  one or more solutions failed
# ─────────────────────────────────────────────────────────────────────
set -uo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
DIM='\033[2m'
BOLD='\033[1m'
NC='\033[0m'

PASS=0
FAIL=0
SKIP=0
ERRORS=()
SKIPPED=()

pass()  { ((PASS++)); echo -e "  ${GREEN}✅ $1${NC}"; }
fail()  { ((FAIL++)); ERRORS+=("$1"); echo -e "  ${RED}❌ $1${NC}"; }
warn()  { echo -e "  ${YELLOW}⚠️  $1${NC}"; }
skip()  { ((SKIP++)); SKIPPED+=("$1"); echo -e "  ${YELLOW}⏭️  $1${NC}"; }
section() { echo -e "\n${BOLD}${CYAN}── $1 ──${NC}"; }

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# ── Parse arguments ──────────────────────────────────────────────────

SKIP_CHAPTERS=()
RUN_CHAPTERS=()
TIMEOUT=120      # per-exercise timeout in seconds

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip)
      shift
      while [[ $# -gt 0 && ! "$1" =~ ^-- ]]; do
        SKIP_CHAPTERS+=("$1")
        shift
      done
      ;;
    --timeout)
      shift
      TIMEOUT="$1"
      shift
      ;;
    *)
      RUN_CHAPTERS+=("$1")
      shift
      ;;
  esac
done

# Default: run all 11 chapters
if [ ${#RUN_CHAPTERS[@]} -eq 0 ]; then
  for i in $(seq 1 11); do
    RUN_CHAPTERS+=("$i")
  done
fi

should_skip() {
  local ch="$1"
  for s in "${SKIP_CHAPTERS[@]+"${SKIP_CHAPTERS[@]}"}"; do
    if [ "$s" = "$ch" ]; then
      return 0
    fi
  done
  return 1
}

# ── Load .env ────────────────────────────────────────────────────────

load_env() {
  local env_file="$ROOT/.env"
  if [ -f "$env_file" ]; then
    while IFS= read -r line || [ -n "$line" ]; do
      line="${line%%#*}"           # strip comments
      line="$(echo "$line" | xargs 2>/dev/null)" # trim
      [ -z "$line" ] && continue
      if [[ "$line" == *=* ]]; then
        local key="${line%%=*}"
        local val="${line#*=}"
        # Strip surrounding quotes from value
        val="${val%\"}"
        val="${val#\"}"
        val="${val%\'}"
        val="${val#\'}"
        export "$key=$val" 2>/dev/null || true
      fi
    done < "$env_file"
  fi
}

load_env

# ── Comparison helpers ───────────────────────────────────────────────

# Normalize JSON: sort keys, consistent formatting
normalize_json() {
  node -e "
    const fs = require('fs');
    const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();
    try {
      const obj = JSON.parse(input);
      const sortDeep = (v) => {
        if (Array.isArray(v)) return v.map(sortDeep);
        if (v !== null && typeof v === 'object') {
          const s = {};
          for (const k of Object.keys(v).sort()) s[k] = sortDeep(v[k]);
          return s;
        }
        return v;
      };
      console.log(JSON.stringify(sortDeep(obj), null, 2));
    } catch (e) {
      console.log(input);
    }
  "
}

# Normalize CSV: trim cells, normalize line endings, remove trailing blanks
normalize_csv() {
  node -e "
    const fs = require('fs');
    const input = fs.readFileSync('/dev/stdin', 'utf-8');
    const lines = input
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n')
      .map(l => l.split(',').map(c => c.trim()).join(','))
      .filter(l => l.length > 0);
    console.log(lines.join('\n'));
  "
}

# Compare two strings, return 0 if match
compare_output() {
  local actual="$1"
  local expected_file="$2"
  local ext="${expected_file##*.}"

  case "$ext" in
    json)
      local norm_actual norm_expected
      norm_actual=$(echo "$actual" | normalize_json)
      norm_expected=$(normalize_json < "$expected_file")
      if [ "$norm_actual" = "$norm_expected" ]; then
        return 0
      else
        echo -e "    ${DIM}Format: JSON (keys sorted)${NC}"
        diff --color=always <(echo "$norm_expected") <(echo "$norm_actual") | head -40 || true
        return 1
      fi
      ;;
    csv)
      local norm_actual norm_expected
      norm_actual=$(echo "$actual" | normalize_csv)
      norm_expected=$(normalize_csv < "$expected_file")
      if [ "$norm_actual" = "$norm_expected" ]; then
        return 0
      else
        echo -e "    ${DIM}Format: CSV (cells trimmed)${NC}"
        diff --color=always <(echo "$norm_expected") <(echo "$norm_actual") | head -40 || true
        return 1
      fi
      ;;
    *)
      local trimmed_actual trimmed_expected
      trimmed_actual=$(echo "$actual" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
      trimmed_expected=$(sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' < "$expected_file")
      if [ "$trimmed_actual" = "$trimmed_expected" ]; then
        return 0
      else
        echo -e "    ${DIM}Format: text (trimmed)${NC}"
        diff --color=always <(echo "$trimmed_expected") <(echo "$trimmed_actual") | head -40 || true
        return 1
      fi
      ;;
  esac
}

# ── Server management ────────────────────────────────────────────────
#
# Start any chapter servers that aren't already listening.
# Static chapters (1,2,3,6,10) use their server.ts.
# Next.js chapters (4,5,7,8,9,11) need the full next binary path
# because the .deno node_modules layout doesn't link binaries.

SPAWNED_PIDS=()

cleanup_servers() {
  for pid in "${SPAWNED_PIDS[@]+"${SPAWNED_PIDS[@]}"}"; do
    kill "$pid" 2>/dev/null || true
    wait "$pid" 2>/dev/null || true
  done
}
trap cleanup_servers EXIT

# Resolve the next binary for a chapter's Next.js version
resolve_next_bin() {
  local ch_dir="$ROOT/apps/chapter$1"
  local next_ver
  next_ver=$(grep '"next":' "$ch_dir/package.json" 2>/dev/null | grep -oP '[\d.]+')
  local bin="$ROOT/node_modules/.deno/next@${next_ver}/node_modules/next/dist/bin/next"
  if [ -f "$bin" ]; then
    echo "$bin"
  else
    # Fallback: try to find any next binary
    find "$ROOT/node_modules/.deno" -path "*/next@*/next/dist/bin/next" 2>/dev/null | head -1
  fi
}

start_chapter_server() {
  local ch="$1"
  local port="$2"
  local ch_dir="$ROOT/apps/chapter$ch"

  # Static chapters: use tsx server.ts
  if [ -f "$ch_dir/server.ts" ] && ! grep -q '"next"' "$ch_dir/package.json" 2>/dev/null; then
    (cd "$ch_dir" && npx tsx server.ts) > /dev/null 2>&1 &
    SPAWNED_PIDS+=($!)
    return 0
  fi

  # Run Prisma setup if the chapter uses Prisma
  if [ -f "$ch_dir/prisma/schema.prisma" ]; then
    rm -rf "$ch_dir/.next"
    (cd "$ch_dir" && npx prisma generate && npx prisma db push --skip-generate && npx prisma db seed) > /dev/null 2>&1
  fi

  # Next.js chapters
  local next_bin
  next_bin=$(resolve_next_bin "$ch")
  if [ -n "$next_bin" ] && [ -f "$next_bin" ]; then
    # The .deno node_modules layout breaks Next.js webpack resolution for
    # internal modules. Setting NODE_PATH to the version-specific directory
    # allows webpack to find them (e.g. '../shared/lib/utils').
    local next_ver
    next_ver=$(grep '"next":' "$ch_dir/package.json" 2>/dev/null | grep -oP '[\d.]+')
    local node_path="$ROOT/node_modules/.deno/next@${next_ver}/node_modules"
    (cd "$ch_dir" && NODE_PATH="$node_path" node "$next_bin" dev --port "$port") > /dev/null 2>&1 &
    SPAWNED_PIDS+=($!)
    return 0
  fi

  return 1
}

is_server_up() {
  local port="$1"
  # Accept any HTTP response (even 500 from Next.js cold start)
  local code
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 "http://localhost:$port" 2>/dev/null)
  [ "$code" != "000" ]
}

# ── Preflight checks ────────────────────────────────────────────────

section "Preflight"

if ! command -v node &>/dev/null; then
  fail "node not found — Node.js >=22 required"
  exit 1
fi
pass "node $(node --version)"

if ! npx tsx --version &>/dev/null 2>&1; then
  fail "tsx not available — run npm install first"
  exit 1
fi
pass "tsx available"

# Start / check chapter servers
section "Chapter servers"
servers_ok=0
servers_started=0
servers_failed=0
for ch_num in "${RUN_CHAPTERS[@]}"; do
  if should_skip "$ch_num"; then continue; fi

  port="300$ch_num"
  if [ "$ch_num" -ge 10 ]; then port="30$ch_num"; fi

  if is_server_up "$port"; then
    pass "Chapter $ch_num already listening on port $port"
    ((servers_ok++))
  else
    # Try to start it ourselves
    if start_chapter_server "$ch_num" "$port"; then
      ((servers_started++))
    else
      warn "Chapter $ch_num could not be started on port $port"
      ((servers_failed++))
    fi
  fi
done

# Wait for started servers to come up
if [ "$servers_started" -gt 0 ]; then
  echo -e "  ${DIM}Waiting for $servers_started server(s) to start...${NC}"
  sleep 8
  for ch_num in "${RUN_CHAPTERS[@]}"; do
    if should_skip "$ch_num"; then continue; fi
    port="300$ch_num"
    if [ "$ch_num" -ge 10 ]; then port="30$ch_num"; fi
    if is_server_up "$port"; then
      pass "Chapter $ch_num ready on port $port"
    fi
  done
fi

# ═══════════════════════════════════════════════════════════════════════
section "Running solutions"
# ═══════════════════════════════════════════════════════════════════════

RESULTS=()   # "chapter:status:duration"

for ch_num in "${RUN_CHAPTERS[@]}"; do
  padded=$(printf "%02d" "$ch_num")
  label="Chapter $padded"
  solution="exercises/chapter-$padded/solution/src/index.ts"
  expected_file=$(find "exercises/chapter-$padded/expected" -type f -name "expected.*" 2>/dev/null | head -1)

  echo ""
  echo -e "${BOLD}  ▶ $label${NC} ${DIM}($solution)${NC}"

  # Skip?
  if should_skip "$ch_num"; then
    skip "$label — skipped by --skip flag"
    RESULTS+=("$padded:SKIP:0")
    continue
  fi

  # Existence checks
  if [ ! -f "$solution" ]; then
    fail "$label — solution file missing: $solution"
    RESULTS+=("$padded:FAIL:0")
    continue
  fi

  if [ -z "$expected_file" ]; then
    fail "$label — no expected output file found"
    RESULTS+=("$padded:FAIL:0")
    continue
  fi

  # Check that the target server is reachable
  port="300$ch_num"
  if [ "$ch_num" -ge 10 ]; then port="30$ch_num"; fi

  if ! is_server_up "$port"; then
    skip "$label — server on port $port not reachable"
    RESULTS+=("$padded:SKIP:0")
    continue
  fi

  # Execute the solution
  start_time=$(date +%s%N 2>/dev/null || python3 -c 'import time; print(int(time.time()*1e9))')

  actual_output=""
  stderr_output=""
  exit_code=0

  # Execute with optional timeout
  tmpstderr="/tmp/housefly_stderr_$$_$padded"
  if command -v timeout &>/dev/null; then
    actual_output=$(timeout "${TIMEOUT}s" npx tsx "$solution" 2>"$tmpstderr")
    exit_code=$?
  else
    actual_output=$(npx tsx "$solution" 2>"$tmpstderr")
    exit_code=$?
  fi
  stderr_output=$(cat "$tmpstderr" 2>/dev/null || true)
  rm -f "$tmpstderr"

  end_time=$(date +%s%N 2>/dev/null || python3 -c 'import time; print(int(time.time()*1e9))')
  duration_ms=$(( (end_time - start_time) / 1000000 ))

  # Timeout exit code is 124
  if [ "$exit_code" -eq 124 ]; then
    fail "$label — timed out after ${TIMEOUT}s"
    RESULTS+=("$padded:FAIL:${duration_ms}")
    continue
  fi

  if [ "$exit_code" -ne 0 ]; then
    fail "$label — process exited with code $exit_code"
    if [ -n "$stderr_output" ]; then
      echo -e "    ${DIM}stderr:${NC}"
      echo "$stderr_output" | head -20 | sed 's/^/    /'
    fi
    RESULTS+=("$padded:FAIL:${duration_ms}")
    continue
  fi

  # Compare output
  if compare_output "$actual_output" "$expected_file"; then
    pass "$label — output matches ✓  ${DIM}(${duration_ms}ms)${NC}"
    RESULTS+=("$padded:PASS:${duration_ms}")
  else
    fail "$label — output differs from expected"
    RESULTS+=("$padded:FAIL:${duration_ms}")
  fi
done

# ═══════════════════════════════════════════════════════════════════════
echo ""
echo -e "${BOLD}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}  RESULTS${NC}"
echo -e "${BOLD}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Summary table
for entry in "${RESULTS[@]}"; do
  IFS=: read -r ch status dur <<< "$entry"
  case "$status" in
    PASS) echo -e "  ${GREEN}✔${NC} Chapter $ch  ${GREEN}PASS${NC}  ${DIM}(${dur}ms)${NC}" ;;
    FAIL) echo -e "  ${RED}✘${NC} Chapter $ch  ${RED}FAIL${NC}  ${DIM}(${dur}ms)${NC}" ;;
    SKIP) echo -e "  ${YELLOW}⏭${NC} Chapter $ch  ${YELLOW}SKIP${NC}" ;;
  esac
done

echo ""
echo -e "${BOLD}──────────────────────────────────────────────────────────${NC}"
echo -e "  ${GREEN}Passed:   $PASS${NC}"
echo -e "  ${RED}Failed:   $FAIL${NC}"
echo -e "  ${YELLOW}Skipped:  $SKIP${NC}"
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo -e "${RED}${BOLD}  FAILURES:${NC}"
  for err in "${ERRORS[@]}"; do
    echo -e "    ${RED}• $err${NC}"
  done
  echo ""
  exit 1
else
  echo -e "${GREEN}${BOLD}  All solutions passed! 🎉${NC}"
  echo ""
  exit 0
fi
