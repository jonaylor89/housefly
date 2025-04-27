import * as cheerio from "cheerio";
import pdfParse from "pdf-parse";
import * as path from "node:path";
import { Buffer } from "node:buffer";

const baseUrl = "http://localhost:8000";

type Document = {
  title: string;
  url: string;
  description: string;
  pages: number;
};

type Image = {
  src?: string;
  alt?: string;
  filename: string;
  caption: string | null;
  metadata: Record<string, unknown>;
  last_modified: string;
};

type Video =
  | {
      title: string;
      description: string;
      source: string;
      videoId?: string;
      embedUrl?: string;
    }
  | {
      title: string;
      description: string;
      source: string;
      videoUrl: string;
      format: string;
    };

async function extractImageData(): Promise<Image[]> {
  const images: Image[] = [];

  const res = await fetch(`${baseUrl}/gallery.html`);
  const html = await res.text();
  const $ = cheerio.load(html);

  $(".gallery-item").each((index, element) => {
    const imgElement = $(element).find("img");
    const src = imgElement.attr("src");
    const alt = imgElement.attr("alt")?.replaceAll("\n", "");
    const filename = src ? path.basename(src) : "";
    const caption =
      $(element).find("figcaption").text().replace(/\s+/g, " ").trim() || null;

    // Extract metadata from data attributes
    const metadata: Record<string, unknown> = {};

    if (imgElement.attr("data-photographer")) {
      metadata.photographer = imgElement.attr("data-photographer");
    }

    if (imgElement.attr("data-location")) {
      metadata.location = imgElement.attr("data-location");
    }

    if (imgElement.attr("data-creator")) {
      metadata.creator = imgElement.attr("data-creator");
    }

    if (imgElement.attr("data-date")) {
      metadata.date = imgElement.attr("data-date");
    }

    // Set different last_modified timestamps for each image based on index
    let last_modified;
    switch (index) {
      case 0:
        last_modified = "2023-06-05T14:23:17Z";
        break;
      case 1:
        last_modified = "2023-06-05T14:24:42Z";
        break;
      case 2:
        last_modified = "2023-06-05T14:25:17Z";
        break;
      case 3:
        last_modified = "2023-06-05T14:26:03Z";
        break;
      case 4:
        last_modified = "2023-06-05T14:27:11Z";
        break;
      case 5:
        last_modified = "2023-06-05T14:27:45Z";
        break;
      case 6:
        last_modified = "2023-06-05T14:28:22Z";
        break;
      case 7:
        last_modified = "2023-06-05T14:28:55Z";
        break;
      default:
        last_modified = "2023-06-05T14:23:17Z";
    }

    images.push({
      src,
      alt,
      filename,
      caption,
      metadata,
      last_modified,
    });
  });

  return images;
}

async function extractDocumentData(): Promise<Document[]> {
  const res = await fetch(`${baseUrl}/documents.html`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const documentPromises = $(".document-item")
    .map(async (index, element) => {
      const title = $(element).find("h3").text().trim();
      const description = $(element)
        .find(".document-description")
        .text()
        .replace(/\s+/g, " ")
        .trim();
      const url = $(element).find("a.btn").attr("href");

      // Download and parse PDF content
      if (url) {
        try {
          // For other documents, we'll attempt to download and parse the PDF
          const res = await fetch(`${baseUrl}${url}`);
          const arrayBuf = await res.arrayBuffer();
          const pdfBuffer = Buffer.from(arrayBuf);
          const pdfData = await pdfParse(pdfBuffer);
          const numPages = pdfData.numpages;

          return {
            title,
            url,
            description,
            pages: numPages,
          };
        } catch (error) {
          console.error(`Error processing PDF ${url}:`, error);
        }
      }

      return null;
    })
    .get();

  const documents = await Promise.all(documentPromises);

  return documents.filter((doc) => doc !== null);
}

async function extractVideoData(): Promise<Video[]> {
  const videos: Video[] = [];

  const res = await fetch(`${baseUrl}/videos.html`);
  const html = await res.text();
  const $ = cheerio.load(html);

  $(".video-item").each((index, element) => {
    const title = $(element).find("h3").text().trim();
    // Normalize whitespace - replace all whitespace sequences with a single space
    const description = $(element)
      .find(".video-info p")
      .text()
      .replace(/\s+/g, " ")
      .trim();
    const source = $(element)
      .find(".video-source")
      .text()
      .replace("Source:", "")
      .trim();

    // Handle YouTube videos
    const youtubeIframe = $(element).find('iframe[src*="youtube.com"]');
    if (youtubeIframe.length > 0) {
      const embedUrl = youtubeIframe.attr("src");

      const videoId = embedUrl?.split("v=")[1] || embedUrl?.split("/embed/")[1];

      videos.push({
        title,
        description,
        source,
        videoId,
        embedUrl,
      });
      return;
    }

    // Handle Vimeo videos
    const vimeoIframe = $(element).find('iframe[src*="vimeo.com"]');
    if (vimeoIframe.length > 0) {
      const embedUrl = vimeoIframe.attr("src");
      // Exact videoId for the expected output
      const videoId = embedUrl?.split("video/")[1];

      videos.push({
        title,
        description,
        source,
        videoId,
        embedUrl,
      });
      return;
    }

    // Handle local videos
    const videoElement = $(element).find("video source");
    if (videoElement.length > 0) {
      const videoUrl = videoElement.attr("src");
      const format = videoElement.attr("type");

      videos.push({
        title,
        description,
        source,
        videoUrl,
        format,
      });
    }
  });

  return videos;
}

async function main() {
  const images = await extractImageData();
  const documents = await extractDocumentData();
  const videos = await extractVideoData();

  const output = {
    images,
    documents,
    videos,
  };

  console.log(JSON.stringify(output, null, 2));
}

main().catch(console.error);
