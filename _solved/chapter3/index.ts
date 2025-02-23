import OpenAI from "openai";

const URI = "https://chapter3.housefly.cc";

const client = new OpenAI();

async function parseProducts(body: string): Promise<string> {
  const prompt = `
    You are an expert web scraper. Given an HTML document containing product information in various inconsistent formats, extract and structure the data according to these requirements:

    1. Find all products in the document
    2. For each product extract:
       - Product ID (from container attributes or context)
       - Product Name (usually in h2 tags)
       - Price (in various formats with $ symbol)
       - SKU code (starting with "SKU-")
       - Specifications (Size, Color, Material, Stock) from various structures

    3. Format the output as CSV with these columns:
       ID,Name,Price,SKU,Size,Color,Material,Stock

    4. Include a header row
    5. Values should be extracted exactly as shown, preserving case and format
    6. For all products, ensure consistent ID format (item-N)

    Example output format:
    ID,Name,Price,SKU,Size,Color,Material,Stock
    item-1,Example Product,$99.99,SKU-1234,10,Red,Canvas,23

    HTML to parse:
    ${body}

    Convert this HTML into clean CSV data following the format above. Extract each field carefully, maintaining exact values and formatting.

    ONLY OUTPUT THE CSV DATA without back ticks or any other formatting
`;

  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4o",
  });

  const completion = chatCompletion.choices[0].message.content;
  if (!completion) {
    throw new Error("No completion received");
  }

  return completion;
}

async function main() {
  const response = await fetch(URI);
  const body = await response.text();
  const output = await parseProducts(body);
  console.log(output);
}

main().catch((e) => console.error(e));
