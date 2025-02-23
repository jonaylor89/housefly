import fs from "fs";
import path from "path";

export type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
};

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  let match = frontmatterRegex.exec(fileContent);
  let frontMatterBlock = match![1];
  let content = fileContent.replace(frontmatterRegex, "").trim();
  let frontMatterLines = frontMatterBlock.trim().split("\n");
  let metadata: Partial<Metadata> = {};

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
    metadata[key.trim() as keyof Metadata] = value;
  });

  return { metadata: metadata as Metadata, content };
}

async function getMDXFiles(dir: string) {
  const files = await fs.promises.readdir(dir);
  return files.filter((file) => path.extname(file) === ".mdx");
}

async function readMDXFile(filePath: string) {
  let rawContent = await fs.promises.readFile(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

async function getMDXData(dir: string) {
  let mdxFiles = await getMDXFiles(dir);
  return Promise.all(
    mdxFiles.map(async (file) => {
      let { metadata, content } = await readMDXFile(path.join(dir, file));
      let slug = path.basename(file, path.extname(file));

      return {
        metadata,
        slug,
        content,
      };
    }),
  );
}

export async function getPosts() {
  return await getMDXData(path.join(process.cwd(), "app", "posts", "posts"));
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date);

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  let daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = "";

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = "Today";
  }

  let fullDate = targetDate.toLocaleString("en-us", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}
