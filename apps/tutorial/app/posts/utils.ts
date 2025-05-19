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

export async function getPosts(locale: string = "en") {
  const postsDir = path.join(process.cwd(), "app", "[locale]", "posts", "posts", locale);
  const posts = await getMDXData(postsDir);
  
  // Format the posts for display
  return posts.map(post => ({
    title: post.metadata.title,
    summary: post.metadata.summary,
    publishedAt: post.metadata.publishedAt,
    slug: post.slug,
    content: post.content,
    image: post.metadata.image,
  }));
}

export function formatDate(date: string, includeRelative = false, locale = 'en') {
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
    formattedDate = locale === 'ru' ? `${yearsAgo} г. назад` : `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = locale === 'ru' ? `${monthsAgo} мес. назад` : `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = locale === 'ru' ? `${daysAgo} д. назад` : `${daysAgo}d ago`;
  } else {
    formattedDate = locale === 'ru' ? "Сегодня" : "Today";
  }

  // Use appropriate locale formatting
  const localeString = locale === 'ru' ? 'ru-RU' : 'en-US';
  let fullDate = targetDate.toLocaleString(localeString, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}
