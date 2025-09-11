import { storage } from "../storage";
import { newsService } from "../services/newsService";
import { videoService } from "../services/videoService";

class NewsProcessor {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;

  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log("News processor started");
    
    // Process immediately
    this.processNews();
    
    // Then every hour
    this.intervalId = setInterval(() => {
      this.processNews();
    }, 60 * 60 * 1000); // 1 hour
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log("News processor stopped");
  }

  private async processNews(): Promise<void> {
    try {
      console.log("Processing news fetch jobs...");
      
      // Check for pending news fetch jobs
      const jobs = await storage.getActiveJobs();
      const newsFetchJobs = jobs.filter(job => job.type === 'news_fetch' && job.status === 'pending');
      
      for (const job of newsFetchJobs) {
        await this.processNewsFetchJob(job.id);
      }
      
      // Also run daily news fetch at 6 AM UTC
      const now = new Date();
      if (now.getUTCHours() === 6 && now.getUTCMinutes() < 5) {
        await this.dailyNewsFetch();
      }
    } catch (error) {
      console.error("Error in news processor:", error);
    }
  }

  private async processNewsFetchJob(jobId: string): Promise<void> {
    try {
      console.log(`Processing news fetch job: ${jobId}`);
      
      // Update job status
      await storage.updateJobProgress(jobId, 0);
      
      // Fetch news
      const newsItems = await newsService.fetchNews();
      await storage.updateJobProgress(jobId, 50);
      
      // Generate videos for each news item
      for (let i = 0; i < newsItems.length; i++) {
        const news = newsItems[i];
        
        // Update news status to processed
        await storage.updateNewsArticleStatus(news.id!, 'processed');
        
        // Generate video in multiple languages
        const languages = ['en-US', 'pt-BR', 'es-ES', 'de-DE', 'fr-FR'];
        
        for (const language of languages) {
          await videoService.generateVideo(news.id!, language);
        }
        
        // Update progress
        const progress = 50 + ((i + 1) / newsItems.length) * 50;
        await storage.updateJobProgress(jobId, Math.round(progress));
      }
      
      // Complete job
      await storage.completeJob(jobId, 'completed');
      console.log(`Completed news fetch job: ${jobId}`);
      
    } catch (error) {
      console.error(`Error processing news fetch job ${jobId}:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      await storage.completeJob(jobId, 'failed', errorMessage);
    }
  }

  private async dailyNewsFetch(): Promise<void> {
    try {
      console.log("Running daily news fetch...");
      
      const job = await storage.createJob({
        type: 'news_fetch',
        status: 'pending',
        data: { automatic: true },
      });
      
      await this.processNewsFetchJob(job.id);
    } catch (error) {
      console.error("Error in daily news fetch:", error);
    }
  }

  // Force immediate news fetch for testing
  async forceNewsFetch(): Promise<void> {
    try {
      console.log("🔥 FORCING IMMEDIATE NEWS FETCH FOR TESTING...");
      
      const job = await storage.createJob({
        type: 'news_fetch',
        status: 'pending',
        data: { manual: true, testing: true },
      });
      
      await this.processNewsFetchJob(job.id);
      console.log("✅ FORCED NEWS FETCH COMPLETED");
    } catch (error) {
      console.error("❌ Error in forced news fetch:", error);
    }
  }
}

const newsProcessor = new NewsProcessor();

export function startNewsProcessor(): void {
  newsProcessor.start();
}

export function stopNewsProcessor(): void {
  newsProcessor.stop();
}

export function forceNewsProcessorTest(): void {
  newsProcessor.forceNewsFetch();
}
