import * as fs from 'fs/promises';
import * as readline from 'readline';

interface IndexEntry {
  url: string;
  title: string;
  content: string;
  keywords: string[];
  chapterNumber: number;
  extractedData?: any;
}

async function loadSearchIndex(): Promise<IndexEntry[]> {
  try {
    const data = await fs.readFile('./data/search_index.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading search index:', error);
    console.log('\nRun "npm start -- crawl" first to build the search index.');
    process.exit(1);
  }
}

async function searchIndex(index: IndexEntry[], query: string, limit = 5) {
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
}

async function startInteractiveSearch() {
  console.log('Loading search index...');
  const index = await loadSearchIndex();
  console.log(`Index loaded with ${index.length} pages.\n`);
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  console.log('🔍 Housefly MetaScraper Search CLI');
  console.log('Type your search query or "exit" to quit.\n');
  
  const promptSearch = () => {
    rl.question('Search > ', async (query) => {
      if (query.toLowerCase() === 'exit') {
        rl.close();
        return;
      }
      
      if (query.trim()) {
        const results = await searchIndex(index, query);
        
        if (results.length === 0) {
          console.log('No results found.\n');
        } else {
          console.log(`\nFound ${results.length} results:\n`);
          results.forEach((result, i) => {
            console.log(`${i + 1}. ${result.title} (Chapter ${result.chapterNumber})`);
            console.log(`   URL: ${result.url}`);
            console.log(`   ${result.preview}`);
            console.log();
          });
        }
      }
      
      promptSearch();
    });
  };
  
  promptSearch();
}

startInteractiveSearch().catch(error => console.error('Error:', error));