import OpenAI from "openai";

const URI = "http://localhost:3003";

const client = new OpenAI();

async function parseProducts(body: string): Promise<string> {
  // TODO: Implement the solution
}

async function main() {
  const response = await fetch(URI);
  const body = await response.text();
  const output = await parseProducts(body);
  console.log(output);
}

main().catch((e) => console.error(e));
