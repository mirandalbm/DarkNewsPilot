import { storage } from "../storage";
import type { InsertNewsArticle } from "@shared/schema";

interface NewsSource {
  name: string;
  url: string;
  apiKey?: string;
}

class NewsService {
  private sources: NewsSource[] = [
    {
      name: "NewsAPI",
      url: "https://newsapi.org/v2/everything",
      apiKey: process.env.NEWS_API_KEY,
    },
    // Add more news sources as needed
  ];

  async fetchNews(): Promise<InsertNewsArticle[]> {
    try {
      const allNews: InsertNewsArticle[] = [];

      for (const source of this.sources) {
        try {
          const news = await this.fetchFromSource(source);
          allNews.push(...news);
        } catch (error) {
          console.error(`Error fetching from ${source.name}:`, error);
          await storage.updateApiStatus({
            serviceName: source.name,
            status: 'down',
            lastChecked: new Date(),
          });
        }
      }

      // Filter and rank news based on dark/mystery criteria
      const filteredNews = await this.filterAndRankNews(allNews);
      
      // Store top 10 news items
      const topNews = filteredNews.slice(0, 10);
      for (const news of topNews) {
        await storage.createNewsArticle(news);
      }

      return topNews;
    } catch (error) {
      console.error("Error in fetchNews:", error);
      throw error;
    }
  }

  private async fetchFromSource(source: NewsSource): Promise<InsertNewsArticle[]> {
    if (!source.apiKey) {
      throw new Error(`API key not provided for ${source.name}`);
    }

    // Keywords for dark/mystery content
    const darkKeywords = [
      "secret", "leaked", "revealed", "exposed", "hidden", "classified",
      "conspiracy", "scandal", "cover-up", "whistleblower", "breach",
      "investigation", "confidential", "exclusive", "alert", "warning"
    ];

    const query = darkKeywords.join(" OR ");
    const url = `${source.url}?q=${encodeURIComponent(query)}&apiKey=${source.apiKey}&sortBy=popularity&pageSize=20`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Update API status
    await storage.updateApiStatus({
      serviceName: source.name,
      status: 'operational',
      responseTime: Date.now() - performance.now(),
      lastChecked: new Date(),
    });

    return data.articles?.map((article: any) => ({
      title: article.title,
      content: article.description || article.content,
      url: article.url,
      source: source.name,
      viralScore: this.calculateViralScore(article),
      publishedAt: new Date(article.publishedAt),
    })) || [];
  }

  private calculateViralScore(article: any): number {
    let score = 50; // Base score

    const darkKeywords = [
      "secret", "leaked", "revealed", "exposed", "hidden", "classified",
      "conspiracy", "scandal", "cover-up", "whistleblower", "breach"
    ];

    const title = article.title?.toLowerCase() || "";
    const description = article.description?.toLowerCase() || "";

    // Check for dark keywords
    darkKeywords.forEach(keyword => {
      if (title.includes(keyword)) score += 15;
      if (description.includes(keyword)) score += 10;
    });

    // Source reputation boost
    const highQualitySources = ["reuters", "bbc", "ap", "bloomberg"];
    const source = article.source?.name?.toLowerCase() || "";
    if (highQualitySources.some(s => source.includes(s))) {
      score += 10;
    }

    // Recency boost
    const publishedAt = new Date(article.publishedAt);
    const hoursAgo = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60);
    if (hoursAgo < 6) score += 15;
    else if (hoursAgo < 24) score += 10;

    return Math.min(100, Math.max(0, score));
  }

  private async filterAndRankNews(news: InsertNewsArticle[]): Promise<InsertNewsArticle[]> {
    // Filter news with viral score >= 70
    const filteredNews = news.filter(item => item.viralScore >= 70);
    
    // Sort by viral score descending
    return filteredNews.sort((a, b) => b.viralScore - a.viralScore);
  }

  async triggerNewsFetch(sources?: string[], keywords?: string): Promise<void> {
    await storage.createJob({
      type: 'news_fetch',
      status: 'pending',
      data: { sources, keywords },
    });
  }
}

export const newsService = new NewsService();
