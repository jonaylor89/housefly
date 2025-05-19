import { PlaywrightCrawler } from 'crawlee';
import * as cheerio from 'cheerio';
import * as fs from 'node:fs/promises';
import OpenAI from 'openai';

// Initialize OpenAI client for AI-assisted parsing
const openai = new OpenAI();

// Define the chapters to crawl
const chapters = [
  'https://housefly-chapter1.netlify.app',
  'https://chapter2.housefly.cc',
  'https://chapter3.housefly.cc',
  'https://chapter4.housefly.cc',
  'https://chapter5.housefly.cc',
  'https://chapter6.housefly.cc',
  'https://chapter7.housefly.cc',
  'https://chapter8.housefly.cc',
  'https://chapter9.housefly.cc',
  'http://chapter10.housefly.cc',
  'https://chapter11.housefly.cc',
];

interface IndexEntry {
  url: string;
  title: string;
  content: string;
  keywords: string[];
  chapterNumber: number;
  extractedData?: any;
}

const searchIndex: IndexEntry[] = [];

// Function to extract structured data from unstructured content using OpenAI
async function extractStructuredData(title: string, content: string): Promise<any> {
  try {
    // Prepare the request to OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      max_tokens: 1000,
      messages: [
        {
          role: 'system',
          content: 'You extract structured data from webpages and return it as JSON.'
        },
        {
          role: 'user',
          content: `Extract structured data from this webpage content. Return a JSON object with the key information.

Title: ${title}
Content: ${content.substring(0, 4000)}` // Limit content length
        }
      ],
      response_format: { type: 'json_object' },
    });

    // Extract the response content
    const responseText = response.choices[0]?.message?.content || '{}';
    
    // Parse the JSON response
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      return {};
    }
  } catch (error) {
    console.error('Error using OpenAI:', error);
    return {};
  }
}

async function runCrawler() {
  await fs.mkdir('./apps/metascraper/data', { recursive: true });
  
  const crawler = new PlaywrightCrawler({
    maxConcurrency: 2,
    launchContext: {
      launchOptions: {
        headless: true,
      },
    },
    
    // Main processing function
    async requestHandler({ request, page, enqueueLinks, log }) {
      const url = request.url;
      log.info(`Processing: ${url}`);

      // Extract chapter number from URL
      const chapterMatch = url.match(/chapter(\d+)\.housefly\.cc/);
      const chapterNumber = chapterMatch ? parseInt(chapterMatch[1]) : 0;

      // Wait for the content to load
      await page.waitForLoadState('networkidle');
      
      // Get page content
      const title = await page.title();
      const content = await page.content();
      
      // Use Cheerio to parse content and extract text
      const $ = cheerio.load(content);
      const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
      
      // Basic keyword extraction
      const keywords = bodyText
        .toLowerCase()
        .split(/\W+/)
        .filter(word => word.length > 3)
        .filter((word, i, arr) => arr.indexOf(word) === i)
        .slice(0, 20);
        
      // Use AI to extract structured data from the content
      const extractedData = await extractStructuredData(title, bodyText);
      
      // Add to search index
      searchIndex.push({
        url,
        title,
        content: bodyText.substring(0, 1000), // Store preview
        keywords,
        chapterNumber,
        extractedData,
      });
      
      // Discover and enqueue links only if we're on a chapter site
      // and the URL is not already in our index
      if (chapterNumber > 0) {
        // Find all links on the page
        await enqueueLinks({
          strategy: 'same-hostname',
          transformRequestFunction: (req) => {
            // Avoid enqueuing URLs that have already been processed
            if (searchIndex.some(entry => entry.url === req.url)) {
              return false;
            }
            return req;
          },
        });
      }
    },
    
    // Handle errors
    async failedRequestHandler({ request, log }) {
      log.error(`Request failed: ${request.url}`);
    },
  });

  // Start the crawler with our initial URLs
  await crawler.run(chapters);
  
  // Save the search index to disk
  await fs.writeFile(
    './apps/metascraper/data/search_index.json', 
    JSON.stringify(searchIndex, null, 2)
  );
  
  // Generate stats
  const stats = {
    totalPages: searchIndex.length,
    pagesPerChapter: {} as Record<number, number>,
    totalKeywords: searchIndex.reduce((sum, entry) => sum + entry.keywords.length, 0),
    dataCaptured: new Date().toISOString(),
  };
  
  // Count pages per chapter
  searchIndex.forEach(entry => {
    if (!stats.pagesPerChapter[entry.chapterNumber]) {
      stats.pagesPerChapter[entry.chapterNumber] = 0;
    }
    stats.pagesPerChapter[entry.chapterNumber]++;
  });
  
  await fs.writeFile(
    './apps/metascraper/data/stats.json', 
    JSON.stringify(stats, null, 2)
  );
  
  console.log('Crawling complete!');
  console.log(`Processed ${searchIndex.length} pages across the Housefly chapters.`);
  console.log('Search index saved to ./apps/metascraper/data/search_index.json');
  console.log('Stats saved to ./apps/metascraper/data/stats.json');
}

// Simple search function to query the index
async function searchFunction(query: string, limit = 5) {
  try {
    // Load the search index
    const indexData = await fs.readFile('./apps/metascraper/data/search_index.json', 'utf-8');
    const index: IndexEntry[] = JSON.parse(indexData);
    
    // Split query into terms
    const terms = query.toLowerCase().split(/\W+/).filter(term => term.length > 2);
    
    // Score each document based on term frequency
    const results = index
      .map(entry => {
        const score = terms.reduce((sum, term) => {
          // Check title (high weight)
          if (entry.title.toLowerCase().includes(term)) sum += 5;
          
          // Check content
          if (entry.content.toLowerCase().includes(term)) sum += 3;
          
          // Check keywords
          if (entry.keywords.includes(term)) sum += 2;
          
          return sum;
        }, 0);
        
        return { entry, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
      
    return results.map(item => ({
      url: item.entry.url,
      title: item.entry.title,
      preview: item.entry.content.substring(0, 150) + '...',
      score: item.score,
      chapterNumber: item.entry.chapterNumber,
    }));
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

// CLI interaction
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === 'crawl') {
    console.log('Starting crawler...');
    await runCrawler();
  } else if (command === 'search') {
    const query = args.slice(1).join(' ');
    if (!query) {
      console.log('Please provide a search query.');
      return;
    }
    
    console.log(`Searching for: "${query}"...`);
    const results = await searchFunction(query);
    
    if (results.length === 0) {
      console.log('No results found.');
    } else {
      console.log(`Found ${results.length} results:\n`);
      results.forEach((result, i) => {
        console.log(`${i + 1}. ${result.title} (Chapter ${result.chapterNumber})`);
        console.log(`   URL: ${result.url}`);
        console.log(`   ${result.preview}`);
        console.log();
      });
    }
  } else {
    console.log(`
Housefly MetaScraper - Chapter 7: Large-Scale & Unstructured Web Crawling
`);
    console.log('Usage:');
    console.log('  npm start -- crawl      # Crawl all chapter websites and build search index');
    console.log('  npm start -- search <query>  # Search the index for specific terms');
  }
}

main().catch(console.error);