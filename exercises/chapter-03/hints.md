# Chapter 3: AI-Assisted Scraping with OpenAI

## Hint 1
The HTML on this page uses inconsistent formatting — products are structured differently from each other. This is intentional! Traditional CSS selectors won't work reliably here. That's why we use an LLM.

## Hint 2
Create a detailed prompt that tells the LLM exactly what to extract: Product ID, Name, Price, SKU, Size, Color, Material, and Stock. Specify the output format as CSV with a header row.

## Hint 3
Use `client.chat.completions.create()` with the `gpt-4o` model. Pass the entire HTML body as part of the prompt so the model can parse it.

## Hint 4
Be explicit in your prompt about the output format — tell the model to output ONLY the CSV data without markdown code fences or any other formatting. This ensures clean output for comparison.

## Hint 5
Make sure to handle the case where the completion might be null. Check `chatCompletion.choices[0].message.content` and throw an error if it's empty.
