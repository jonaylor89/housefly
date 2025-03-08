export type NewsItem = {
  id: number;
  title: string;
  content: string;
  author: string;
  timestamp: string;
};

export const getNewsFeed = (): NewsItem[] => [
  {
    id: 1,
    title: "Breaking: Web Scraping Getting Easier",
    content: "Recent developments in web scraping technology...",
    author: "John Doe",
    timestamp: "2024-02-23T10:30:00Z",
  },
  {
    id: 2,
    title: "AI Revolutionizes Data Collection",
    content:
      "Machine learning algorithms are transforming how we gather data...",
    author: "Jane Smith",
    timestamp: "2024-02-23T09:15:00Z",
  },
  {
    id: 3,
    title: "New Python Library Released",
    content:
      "A groundbreaking library for web automation has been published...",
    author: "Mike Johnson",
    timestamp: "2024-02-23T08:45:00Z",
  },
  {
    id: 4,
    title: "Ethics in Web Scraping",
    content:
      "Industry experts discuss the importance of responsible data collection...",
    author: "Sarah Williams",
    timestamp: "2024-02-23T07:30:00Z",
  },
  {
    id: 5,
    title: "Performance Optimization Tips",
    content: "Best practices for building efficient web scrapers...",
    author: "Alex Chen",
    timestamp: "2024-02-23T06:20:00Z",
  },
  {
    id: 6,
    title: "Web Scraping Security Measures",
    content: "Important security considerations for web scraping projects...",
    author: "David Brown",
    timestamp: "2024-02-23T05:45:00Z",
  },
  {
    id: 7,
    title: "Data Processing Techniques",
    content: "Advanced methods for processing scraped data effectively...",
    author: "Emily Wilson",
    timestamp: "2024-02-23T04:30:00Z",
  },
  {
    id: 8,
    title: "Scraping Framework Comparison",
    content: "An in-depth analysis of popular web scraping frameworks...",
    author: "Tom Anderson",
    timestamp: "2024-02-23T03:15:00Z",
  },
  {
    id: 9,
    title: "Legal Aspects of Web Scraping",
    content: "Understanding the legal framework surrounding web scraping...",
    author: "Lisa Taylor",
    timestamp: "2024-02-23T02:00:00Z",
  },
  {
    id: 10,
    title: "Automated Testing Strategies",
    content: "Best practices for testing web scraping applications...",
    author: "Ryan Martinez",
    timestamp: "2024-02-23T01:30:00Z",
  },
  {
    id: 11,
    title: "Scaling Web Scrapers",
    content: "Techniques for scaling web scraping operations effectively...",
    author: "Kate Wilson",
    timestamp: "2024-02-23T00:45:00Z",
  },
  {
    id: 12,
    title: "Error Handling in Web Scraping",
    content: "Comprehensive guide to handling errors in web scrapers...",
    author: "Chris Davis",
    timestamp: "2024-02-22T23:30:00Z",
  },
  {
    id: 13,
    title: "Web Scraping with JavaScript",
    content: "Advanced techniques for scraping JavaScript-heavy websites...",
    author: "Mark Thompson",
    timestamp: "2024-02-22T22:15:00Z",
  },
  {
    id: 14,
    title: "Data Quality Assurance",
    content: "Ensuring data quality in web scraping projects...",
    author: "Anna Lopez",
    timestamp: "2024-02-22T21:00:00Z",
  },
  {
    id: 15,
    title: "Proxy Management Strategies",
    content: "Effective methods for managing proxy servers in web scraping...",
    author: "Peter Chang",
    timestamp: "2024-02-22T20:30:00Z",
  },
  {
    id: 16,
    title: "Web Scraping Architecture",
    content: "Designing robust architectures for web scraping systems...",
    author: "Sophie Martin",
    timestamp: "2024-02-22T19:45:00Z",
  },
  {
    id: 17,
    title: "Rate Limiting Implementation",
    content: "Implementing effective rate limiting in web scrapers...",
    author: "James Wilson",
    timestamp: "2024-02-22T18:30:00Z",
  },
  {
    id: 18,
    title: "Database Integration",
    content: "Best practices for storing scraped data in databases...",
    author: "Maria Garcia",
    timestamp: "2024-02-22T17:15:00Z",
  },
  {
    id: 19,
    title: "Cloud-Based Web Scraping",
    content: "Leveraging cloud services for web scraping operations...",
    author: "Daniel Lee",
    timestamp: "2024-02-22T16:00:00Z",
  },
  {
    id: 20,
    title: "Web Scraping Monitoring",
    content: "Tools and techniques for monitoring web scraping systems...",
    author: "Rachel Kim",
    timestamp: "2024-02-22T15:30:00Z",
  },
];
