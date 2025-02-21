import * as cheerio from "cheerio";

const URI = "https://chapter2.housefly.cc";

async function parseProducts($: cheerio.CheerioAPI): Promise<string> {
  // TODO: Implement the solution
}

async function main() {
  const response = await fetch(URI);
  const body = await response.text();
  const $ = cheerio.load(body);
  const output = await parseProducts($);
  console.log(output);
}

main().catch((e) => console.error(e));
