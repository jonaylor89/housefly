import * as cheerio from "cheerio";

const URI = "http://localhost:3002";

async function parseProducts($: cheerio.CheerioAPI): Promise<string> {
  const products: string[] = ["ID,Name,Price,SKU,Size,Color,Material,Stock"];

  $(".product").each((_, element) => {
    const $el = $(element);
    const id = $el.attr("id") || "";
    const name = $el.find("h2").text();
    const price = $el.find(".price").text();
    const sku = $el.find(".sku").text();

    const specs = $el
      .find(".specs li")
      .map((_, li) => $(li).text().split(": ")[1])
      .get();
    const [size, color, material, stock] = specs;

    products.push(
      `${id},${name},${price},${sku},${size},${color},${material},${stock}`,
    );
  });

  return products.join("\n");
}

async function main() {
  const response = await fetch(URI);
  const body = await response.text();
  const $ = cheerio.load(body);
  const output = await parseProducts($);
  console.log(output);
}

main().catch((e) => console.error(e));
