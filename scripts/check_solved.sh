#!/usr/bin/env sh

# Ensure a chapter number is provided
if [ -z "$1" ]; then
  echo "🚨 Usage: $0 <chapter_number>"
  exit 1
fi

CHAPTER="chapter $1"
SOLUTION="solution $1"
CHAPTER_PATH="./apps/chapter$1"
SOLUTION_PATH="./apps/solution$1"
SOLVED_PATH="./_solved/chapter$1"
INDEX_FILE="$SOLVED_PATH/index.ts"
EXPECTED_FILE="$SOLUTION_PATH/expected.txt"

# Check if the necessary files exist
if [ ! -f "$INDEX_FILE" ]; then
  echo "❌ Error: $INDEX_FILE does not exist."
  exit 1
fi

if [ ! -f "$EXPECTED_FILE" ]; then
  echo "❌ Error: $EXPECTED_FILE does not exist."
  exit 1
fi

set -a # automatically export all variables
source .env
set +a

# Run the TypeScript file and capture output
OUTPUT=$(deno --allow-net --allow-env "$INDEX_FILE")

# Compare output with expected result
diff_output=$(echo "$OUTPUT" | diff --color=always -u "$EXPECTED_FILE" -)

if [ $? -eq 0 ]; then
  echo "🎉 Test passed! Output matches expected. 🎯"
else
  echo "💥 Test failed! Output differs from expected. Here's what went wrong:"
  echo "$diff_output"
  echo "⚡ Try fixing the errors and run again! 🚀"
fi
