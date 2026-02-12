import * as cheerio from "cheerio";
import pdfParse from "pdf-parse";
import * as path from "node:path";
import { Buffer } from "node:buffer";

const BASE_URL = "http://localhost:3010";

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
  // TODO: Implement image extraction logic
  return [];
}

async function extractDocumentData(): Promise<Document[]> {
  // TODO: Implement document extraction logic
  return [];
}

async function extractVideoData(): Promise<Video[]> {
  // TODO: Implement video extraction logic
  return [];
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
