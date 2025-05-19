
// Type for translated post metadata
export type PostMetadata = {
  title: string;
  summary: string;
};

// Dictionary of post slugs to their translated metadata
export type PostsDictionary = Record<string, Record<string, PostMetadata>>;

// This could be expanded with more posts as needed
export const postsDictionary: PostsDictionary = {
  'section-1': {
    en: {
      title: 'Basic HTML Scraping: The First Steps',
      summary: 'Learn the fundamentals of web scraping through hands-on exercises with static HTML pages',
    },
    ru: {
      title: 'Основы HTML-скрапинга: Первые шаги',
      summary: 'Изучите основы веб-скрапинга через практические упражнения со статическими HTML-страницами',
    },
  },
  // Add more posts as needed
};

// Get post metadata for a specific locale
export function getPostMetadata(slug: string, locale: string): PostMetadata | null {
  if (!postsDictionary[slug]) {
    return null;
  }
  
  // Return metadata for requested locale or fall back to English
  return postsDictionary[slug][locale] || postsDictionary[slug]['en'];
}