#!/usr/bin/env sh

# Help message
show_help() {
  echo "Usage: $0 [-s|--solved] <chapter_number>"
  echo "Options:"
  echo "  -s, --solved    Check solutions in _solved directory instead of apps directory"
  echo "  -h, --help      Show this help message"
}

# Parse command line arguments
CHECK_SOLVED=false
CHAPTER_NUM=""

while [ "$1" != "" ]; do
  case $1 in
    -s | --solved )    CHECK_SOLVED=true
                       ;;
    -h | --help )      show_help
                       exit 0
                       ;;
    * )                CHAPTER_NUM=$1
                       ;;
  esac
  shift
done

# Ensure a chapter number is provided
if [ -z "$CHAPTER_NUM" ]; then
  echo "🚨 Missing chapter number"
  show_help
  exit 1
fi

SOLUTION_PATH="./apps/solution$CHAPTER_NUM"

# Find the expected file with any extension
if [ "$CHECK_SOLVED" = true ]; then
  BASE_PATH="./_solved/chapter$CHAPTER_NUM"
else
  BASE_PATH="./apps/solution$CHAPTER_NUM"
fi

# Find the expected file (could be any extension)
EXPECTED_FILE=""
for ext in txt json csv yaml xml; do
  if [ -f "$SOLUTION_PATH/expected.$ext" ]; then
    EXPECTED_FILE="$SOLUTION_PATH/expected.$ext"
    break
  fi
done

# If no expected file is found, try to find any file that starts with "expected."
if [ -z "$EXPECTED_FILE" ]; then
  EXPECTED_FILE=$(find "$SOLUTION_PATH" -name "expected.*" -type f | head -n 1)
fi

INDEX_FILE="$BASE_PATH/index.ts"

# Check if the necessary files exist
if [ ! -f "$INDEX_FILE" ]; then
  echo "❌ Error: $INDEX_FILE does not exist."
  exit 1
fi

if [ -z "$EXPECTED_FILE" ] || [ ! -f "$EXPECTED_FILE" ]; then
  echo "❌ Error: No expected file found in $SOLUTION_PATH"
  exit 1
fi

set -a # automatically export all variables
source .env
set +a

# Run the TypeScript file and capture output
OUTPUT=$(deno --allow-net --allow-env --allow-sys --allow-read --allow-write --allow-run "$INDEX_FILE")

# Compare output with expected result
diff_output=$(echo "$OUTPUT" | diff --color=always -u "$EXPECTED_FILE" -)

if [ $? -eq 0 ]; then
  echo "🎉 Test passed! Output matches expected. 🎯"
else
  echo "💥 Test failed! Output differs from expected. Here's what went wrong:"
  echo "$diff_output"
  echo "⚡ Try fixing the errors and run again! 🚀"
fi
