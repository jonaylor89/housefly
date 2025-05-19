import * as cheerio from "cheerio";

const URI = "housefly-chapter1.netlify.app";

async function main() {
  const response = await fetch(URI);
  const body = await response.text();
  const $ = cheerio.load(body);
  const text = $("p").text();
  console.log(text);
}

main().catch((e) => console.error(e));
