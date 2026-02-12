export default {
  id: "chapter-03",
  title: "AI-Assisted Scraping",
  targetUrl: "http://localhost:3003",
  output: { kind: "csv" },
  hints: [
    "The HTML on this page uses inconsistent formatting — products are structured differently from each other. This is intentional! Traditional CSS selectors won't work reliably here. That's why we use an LLM.",
    "Create a detailed prompt that tells the LLM exactly what to extract: Product ID, Name, Price, SKU, Size, Color, Material, and Stock. Specify the output format as CSV with a header row.",
    "Use `client.chat.completions.create()` with the `gpt-4o` model. Pass the entire HTML body as part of the prompt so the model can parse it.",
    "Be explicit in your prompt about the output format — tell the model to output ONLY the CSV data without markdown code fences or any other formatting. This ensures clean output for comparison.",
    "Make sure to handle the case where the completion might be null. Check `chatCompletion.choices[0].message.content` and throw an error if it's empty.",
  ],
  checkpoints: [
    { id: "prompt", description: "Craft extraction prompt" },
    { id: "api-call", description: "Call OpenAI API with HTML" },
    { id: "parse", description: "Parse and return CSV result" },
  ],
} as const;
