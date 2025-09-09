import { storage } from '../storage';
import { newsService } from './newsService';
import { openaiService } from './openaiService';

interface AutomationConfig {
  userId: string;
  isActive: boolean;
  autoPublish: boolean;
  targetLanguages: string[];
  maxVideosPerDay: number;
  contentFilters: {
    categories: string[];
    keywords: string[];
    minViralScore: number;
  };
  publishingSchedule: {
    timezone: string;
    publishTimes: string[]; // HH:MM format
    enabled: boolean;
  };
}

class AutomationService {
  private runningPipelines: Set<string> = new Set();

  async startAutomationPipeline(userId: string, config: AutomationConfig): Promise<void> {
    try {
      if (this.runningPipelines.has(userId)) {
        console.log(`Automation pipeline already running for user ${userId}`);
        return;
      }

      this.runningPipelines.add(userId);
      console.log(`Starting automation pipeline for user ${userId}`);

      // Step 1: Fetch and filter news
      await this.fetchAndFilterNews(userId, config);
      
      // Step 2: Generate videos for filtered articles
      await this.generateVideosFromNews(userId, config);
      
      // Step 3: Auto-publish if enabled
      if (config.autoPublish) {
        await this.autoPublishReadyVideos(userId, config);
      }

      this.runningPipelines.delete(userId);
      console.log(`Completed automation pipeline for user ${userId}`);
      
    } catch (error) {
      console.error(`Error in automation pipeline for user ${userId}:`, error);
      this.runningPipelines.delete(userId);
      throw error;
    }
  }

  async fetchAndFilterNews(userId: string, config: AutomationConfig): Promise<void> {
    try {
      console.log(`Fetching news for user ${userId}`);

      // Get fresh news from multiple sources
      const newsResults = await Promise.allSettled([
        newsService.fetchTopHeadlines(),
        newsService.fetchBreakingNews(),
        newsService.fetchCategoryNews('general'),
        newsService.fetchCategoryNews('technology'),
      ]);

      const allArticles = newsResults
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => (result as PromiseFulfilledResult<any>).value || []);

      if (allArticles.length === 0) {
        console.log('No news articles found');
        return;
      }

      // Filter articles for dark/mystery potential
      const filteredArticles = await this.filterArticlesForDarkContent(allArticles, config);
      
      // Save filtered articles to database
      for (const article of filteredArticles) {
        try {
          await storage.createNewsArticle({
            title: article.title,
            content: article.content || article.description,
            source: article.source?.name || 'Unknown',
            url: article.url,
            publishedAt: new Date(article.publishedAt),
            imageUrl: article.urlToImage,
            status: 'discovered',
            viralScore: article.viralScore || 0.5,
            category: this.categorizeArticle(article)
          });
        } catch (error) {
          // Article might already exist, continue
          console.log('Article already exists or error saving:', error);
        }
      }

      console.log(`Filtered and saved ${filteredArticles.length} articles for user ${userId}`);
      
    } catch (error) {
      console.error('Error in fetchAndFilterNews:', error);
      throw error;
    }
  }

  async filterArticlesForDarkContent(articles: any[], config: AutomationConfig): Promise<any[]> {
    const filtered = [];
    
    for (const article of articles) {
      try {
        // Use AI to score article for dark/mystery potential
        const prompt = `
Rate this news article from 0.0 to 1.0 for its potential to be turned into a compelling dark mystery video:

Title: ${article.title}
Content: ${article.description || article.content || ''}

Consider:
- Mysterious or unexplained elements
- Potential for dramatic storytelling
- Public interest and viral potential
- Dark or suspenseful themes
- Investigation potential

Return only a number between 0.0 and 1.0
        `;

        const scoreResponse = await openaiService.generateScript(
          'Score Article',
          prompt,
          config.userId
        );
        
        const viralScore = parseFloat(scoreResponse) || 0.0;
        
        // Apply content filters
        if (viralScore >= config.contentFilters.minViralScore) {
          const hasKeywords = config.contentFilters.keywords.length === 0 || 
            config.contentFilters.keywords.some(keyword => 
              article.title.toLowerCase().includes(keyword.toLowerCase()) ||
              (article.description && article.description.toLowerCase().includes(keyword.toLowerCase()))
            );

          if (hasKeywords) {
            filtered.push({
              ...article,
              viralScore
            });
          }
        }
        
        // Rate limiting to avoid API abuse
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.log('Error scoring article:', error);
        // Include article with default score if scoring fails
        filtered.push({
          ...article,
          viralScore: 0.5
        });
      }
    }

    // Sort by viral score and limit results
    return filtered
      .sort((a, b) => b.viralScore - a.viralScore)
      .slice(0, config.maxVideosPerDay * 2); // Get extra for processing buffer
  }

  async generateVideosFromNews(userId: string, config: AutomationConfig): Promise<void> {
    try {
      // Get top unprocessed articles
      const articles = await storage.getNewsArticlesByStatus('discovered', config.maxVideosPerDay);
      
      console.log(`Generating videos for ${articles.length} articles`);

      for (const article of articles) {
        // Update article status to processing
        await storage.updateNewsArticleStatus(article.id, 'processed');

        // Create video generation jobs for each target language
        for (const language of config.targetLanguages) {
          try {
            const job = await storage.createJob({
              type: 'video_generation',
              status: 'pending',
              data: {
                newsArticleId: article.id,
                userId: userId,
                language: language
              },
              progress: 0
            });

            console.log(`Created video generation job ${job.id} for article ${article.id} in ${language}`);
          } catch (error) {
            console.error(`Error creating job for article ${article.id} in ${language}:`, error);
          }
        }
      }

    } catch (error) {
      console.error('Error in generateVideosFromNews:', error);
      throw error;
    }
  }

  async autoPublishReadyVideos(userId: string, config: AutomationConfig): Promise<void> {
    try {
      // Get videos that are ready for publishing
      const readyVideos = await storage.getVideosByStatus('ready');
      const userVideos = readyVideos.filter((video: any) => video.userId === userId);

      if (userVideos.length === 0) {
        console.log('No ready videos to publish');
        return;
      }

      // Check if we're in a scheduled publishing window
      if (config.publishingSchedule.enabled && !this.isInPublishingWindow(config.publishingSchedule)) {
        console.log('Outside of publishing schedule window');
        return;
      }

      // Get available YouTube channels
      const channels = await storage.getYoutubeChannels();
      const activeChannels = channels.filter((c: any) => c.isActive);

      for (const video of userVideos.slice(0, config.maxVideosPerDay)) {
        try {
          // Find appropriate channel for video language
          const targetChannel = activeChannels.find((c: any) => c.language === video.language) || 
                               activeChannels[0];

          if (targetChannel) {
            // Create publish job
            const publishJob = await storage.createJob({
              type: 'publish',
              status: 'pending',
              data: {
                videoId: video.id,
                channelId: targetChannel.id,
                userId: userId
              },
              progress: 0
            });

            // Update video status
            await storage.updateVideoStatus(video.id, 'approved');

            console.log(`Created publish job ${publishJob.id} for video ${video.id}`);
          }
        } catch (error) {
          console.error(`Error auto-publishing video ${video.id}:`, error);
        }
      }

    } catch (error) {
      console.error('Error in autoPublishReadyVideos:', error);
      throw error;
    }
  }

  private isInPublishingWindow(schedule: AutomationConfig['publishingSchedule']): boolean {
    if (!schedule.enabled || schedule.publishTimes.length === 0) {
      return true; // Always publish if no schedule set
    }

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

    // Check if current time is within any of the publishing windows (±30 minutes)
    return schedule.publishTimes.some(publishTime => {
      const [publishHour, publishMinute] = publishTime.split(':').map(Number);
      const publishDateTime = new Date(now);
      publishDateTime.setHours(publishHour, publishMinute, 0, 0);

      const timeDiff = Math.abs(now.getTime() - publishDateTime.getTime());
      const thirtyMinutes = 30 * 60 * 1000;

      return timeDiff <= thirtyMinutes;
    });
  }

  private categorizeArticle(article: any): string {
    const title = article.title.toLowerCase();
    const description = (article.description || '').toLowerCase();
    const content = title + ' ' + description;

    if (content.includes('murder') || content.includes('crime') || content.includes('investigation')) {
      return 'crime';
    }
    if (content.includes('mystery') || content.includes('unexplained') || content.includes('strange')) {
      return 'mystery';
    }
    if (content.includes('conspiracy') || content.includes('secret') || content.includes('hidden')) {
      return 'conspiracy';
    }
    if (content.includes('technology') || content.includes('ai') || content.includes('cyber')) {
      return 'technology';
    }

    return 'general';
  }

  async getAutomationStatus(userId: string): Promise<{
    isRunning: boolean;
    lastRun?: Date;
    nextRun?: Date;
    stats: {
      articlesProcessed: number;
      videosGenerated: number;
      videosPublished: number;
    };
  }> {
    const isRunning = this.runningPipelines.has(userId);
    
    // Get pipeline statistics
    const stats = {
      articlesProcessed: await storage.getNewsArticlesByStatus('processed').then(a => a.length),
      videosGenerated: await storage.getVideosByStatus('ready').then(v => v.length),
      videosPublished: await storage.getVideosByStatus('published').then(v => v.length)
    };

    return {
      isRunning,
      stats
    };
  }

  stopAutomationPipeline(userId: string): void {
    this.runningPipelines.delete(userId);
    console.log(`Stopped automation pipeline for user ${userId}`);
  }

  async runFullAutomationCycle(userId: string): Promise<void> {
    // Default automation config - would typically be user-configurable
    const config: AutomationConfig = {
      userId,
      isActive: true,
      autoPublish: true,
      targetLanguages: ['en', 'es', 'pt'],
      maxVideosPerDay: 5,
      contentFilters: {
        categories: ['general', 'technology', 'health'],
        keywords: ['mysterious', 'unexplained', 'investigation', 'discovery', 'secret'],
        minViralScore: 0.6
      },
      publishingSchedule: {
        timezone: 'UTC',
        publishTimes: ['09:00', '15:00', '21:00'],
        enabled: false // Disable scheduled publishing for now
      }
    };

    await this.startAutomationPipeline(userId, config);
  }
}

export const automationService = new AutomationService();