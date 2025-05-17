import * as cheerio from "cheerio";

const URI = "http://chapter1.housefly.cc";

async function main() {
  const response = await fetch(URI);
  const body = await response.text();
  const $ = cheerio.load(body);
  const text = $("p").text();
  console.log(text);
}

main().catch((e) => console.error(e));
