import {
  users,
  newsArticles,
  videos,
  youtubeChannels,
  processingJobs,
  systemMetrics,
  apiStatus,
  apiConfigurations,
  type User,
  type UpsertUser,
  type NewsArticle,
  type InsertNewsArticle,
  type Video,
  type InsertVideo,
  type YoutubeChannel,
  type InsertYoutubeChannel,
  type ProcessingJob,
  type InsertProcessingJob,
  type SystemMetric,
  type InsertSystemMetric,
  type ApiStatus,
  type InsertApiStatus,
  type ApiConfiguration,
  type InsertApiConfiguration,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // News operations
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  getNewsArticles(limit?: number): Promise<NewsArticle[]>;
  getNewsArticleById(id: string): Promise<NewsArticle | null>;
  updateNewsArticleStatus(id: string, status: 'discovered' | 'processed' | 'approved' | 'rejected'): Promise<void>;

  // Video operations
  createVideo(video: InsertVideo): Promise<Video>;
  getVideos(limit?: number): Promise<Video[]>;
  getVideosByStatus(status: string): Promise<Video[]>;
  updateVideoStatus(id: string, status: string): Promise<void>;
  updateVideoYoutubeId(id: string, youtubeId: string): Promise<void>;
  getVideoStats(): Promise<{
    totalVideos: number;
    todayVideos: number;
    processingVideos: number;
    successRate: number;
  }>;
  updateVideoProgress(id: string, progress: number): Promise<void>;

  // Channel operations
  getYoutubeChannels(): Promise<YoutubeChannel[]>;
  createYoutubeChannel(channel: InsertYoutubeChannel): Promise<YoutubeChannel>;

  // Job operations
  createJob(job: InsertProcessingJob): Promise<ProcessingJob>;
  getActiveJobs(): Promise<ProcessingJob[]>;
  updateJobProgress(id: string, progress: number): Promise<void>;
  completeJob(id: string, status: 'completed' | 'failed', error?: string): Promise<void>;
  updateJob(id: string, updates: Partial<any>): Promise<any>;

  // Metrics operations
  recordMetric(metric: InsertSystemMetric): Promise<void>;
  getMetrics(metricName: string, hours?: number): Promise<SystemMetric[]>;

  // API status operations
  updateApiStatus(status: InsertApiStatus): Promise<void>;
  getApiStatuses(): Promise<ApiStatus[]>;

  // API Configuration operations
  getApiConfiguration(userId: string, serviceId: string): Promise<ApiConfiguration | undefined>;
  getAllApiConfigurations(userId: string): Promise<ApiConfiguration[]>;
  upsertApiConfiguration(userId: string, serviceId: string, config: {
    serviceName: string;
    isActive: boolean;
    encryptedConfig: string;
    status: 'active' | 'inactive' | 'error';
  }): Promise<ApiConfiguration>;
  updateApiConfigStatus(userId: string, serviceId: string, status: 'active' | 'inactive' | 'error'): Promise<void>;

  // Dashboard data
  getDashboardStats(): Promise<{
    totalVideos: number;
    videosToday: number;
    totalViews: number;
    totalSubscribers: number;
    activeChannels: number;
    successRate: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // News operations
  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const [newArticle] = await db.insert(newsArticles).values(article).returning();
    return newArticle;
  }

  async getNewsArticles(limit = 50): Promise<NewsArticle[]> {
    return await db
      .select()
      .from(newsArticles)
      .orderBy(desc(newsArticles.createdAt))
      .limit(limit);
  }

  async getNewsArticleById(id: string): Promise<NewsArticle | null> {
    const [article] = await db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.id, id));
    return article || null;
  }

  async updateNewsArticleStatus(id: string, status: 'discovered' | 'processed' | 'approved' | 'rejected'): Promise<void> {
    await db
      .update(newsArticles)
      .set({ status, updatedAt: new Date() })
      .where(eq(newsArticles.id, id));
  }

  // Video operations
  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db.insert(videos).values(video).returning();
    return newVideo;
  }

  async getVideos(limit = 50): Promise<Video[]> {
    return await db
      .select()
      .from(videos)
      .orderBy(desc(videos.createdAt))
      .limit(limit);
  }

  async getVideosByStatus(status: string): Promise<Video[]> {
    return await db
      .select()
      .from(videos)
      .where(eq(videos.status, status as any))
      .orderBy(desc(videos.createdAt));
  }

  async updateVideoStatus(id: string, status: string): Promise<void> {
    await db
      .update(videos)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(videos.id, id));
  }

  async updateVideoYoutubeId(id: string, youtubeId: string): Promise<void> {
    await db
      .update(videos)
      .set({ youtubeVideoId: youtubeId, updatedAt: new Date() })
      .where(eq(videos.id, id));
  }

  async updateJob(id: string, updates: Partial<any>): Promise<any> {
    const [job] = await db
      .update(processingJobs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(processingJobs.id, id))
      .returning();
    return job;
  }

  // Channel operations
  async getYoutubeChannels(): Promise<YoutubeChannel[]> {
    return await db.select().from(youtubeChannels).where(eq(youtubeChannels.isActive, true));
  }

  async createYoutubeChannel(channel: InsertYoutubeChannel): Promise<YoutubeChannel> {
    const [newChannel] = await db.insert(youtubeChannels).values(channel).returning();
    return newChannel;
  }

  // Job operations
  async createJob(job: InsertProcessingJob): Promise<ProcessingJob> {
    const [newJob] = await db.insert(processingJobs).values(job).returning();
    return newJob;
  }

  async getActiveJobs(): Promise<ProcessingJob[]> {
    return await db
      .select()
      .from(processingJobs)
      .where(eq(processingJobs.status, 'processing'))
      .orderBy(desc(processingJobs.createdAt));
  }

  async updateJobProgress(id: string, progress: number): Promise<void> {
    await db
      .update(processingJobs)
      .set({ progress })
      .where(eq(processingJobs.id, id));
  }

  async completeJob(id: string, status: 'completed' | 'failed', error?: string): Promise<void> {
    await db
      .update(processingJobs)
      .set({ 
        status: status as any, 
        completedAt: new Date(),
        error: error || null
      })
      .where(eq(processingJobs.id, id));
  }

  // Metrics operations
  async recordMetric(metric: InsertSystemMetric): Promise<void> {
    await db.insert(systemMetrics).values(metric);
  }

  async getMetrics(metricName: string, hours = 24): Promise<SystemMetric[]> {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    return await db
      .select()
      .from(systemMetrics)
      .where(and(
        eq(systemMetrics.metricName, metricName),
        sql`${systemMetrics.timestamp} >= ${since}`
      ))
      .orderBy(desc(systemMetrics.timestamp));
  }

  // API status operations
  async updateApiStatus(status: InsertApiStatus): Promise<void> {
    await db
      .insert(apiStatus)
      .values(status)
      .onConflictDoUpdate({
        target: apiStatus.serviceName,
        set: {
          status: status.status,
          responseTime: status.responseTime,
          lastChecked: new Date(),
        },
      });
  }

  async getApiStatuses(): Promise<ApiStatus[]> {
    return await db.select().from(apiStatus).orderBy(apiStatus.serviceName);
  }

  // Dashboard data
  async getDashboardStats(): Promise<{
    totalVideos: number;
    videosToday: number;
    totalViews: number;
    totalSubscribers: number;
    activeChannels: number;
    successRate: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalVideosResult] = await db.select({ count: count() }).from(videos);
    const [videosTodayResult] = await db
      .select({ count: count() })
      .from(videos)
      .where(sql`${videos.createdAt} >= ${today}`);

    const [totalViewsResult] = await db
      .select({ sum: sql<number>`COALESCE(SUM(${videos.views}), 0)` })
      .from(videos);

    const [totalSubscribersResult] = await db
      .select({ sum: sql<number>`COALESCE(SUM(${youtubeChannels.subscriberCount}), 0)` })
      .from(youtubeChannels);

    const [activeChannelsResult] = await db
      .select({ count: count() })
      .from(youtubeChannels)
      .where(eq(youtubeChannels.isActive, true));

    const [successfulJobs] = await db
      .select({ count: count() })
      .from(processingJobs)
      .where(eq(processingJobs.status, 'completed'));

    const [totalJobs] = await db.select({ count: count() }).from(processingJobs);

    const successRate = totalJobs.count > 0 ? Math.round((successfulJobs.count / totalJobs.count) * 100) : 100;

    return {
      totalVideos: totalVideosResult.count,
      videosToday: videosTodayResult.count,
      totalViews: totalViewsResult.sum || 0,
      totalSubscribers: totalSubscribersResult.sum || 0,
      activeChannels: activeChannelsResult.count,
      successRate,
    };
  }

  // News statistics
  async getNewsStats(): Promise<any> {
    const [newsStats] = await db
      .select({
        totalNews: count(),
        todayNews: count(sql`case when DATE(${newsArticles.createdAt}) = DATE(NOW()) then 1 end`),
        approvedNews: count(sql`case when ${newsArticles.status} = 'approved' then 1 end`),
        averageScore: sql<number>`CAST(AVG(${newsArticles.viralScore}) AS INTEGER)`,
      })
      .from(newsArticles);

    return newsStats;
  }

  // News sources
  async getNewsSources(): Promise<string[]> {
    const sources = await db
      .selectDistinct({ source: newsArticles.source })
      .from(newsArticles)
      .where(sql`${newsArticles.source} IS NOT NULL`);
    
    return sources.map(s => s.source).filter(Boolean);
  }

  // API Configuration operations
  async getApiConfiguration(userId: string, serviceId: string): Promise<ApiConfiguration | undefined> {
    const [config] = await db
      .select()
      .from(apiConfigurations)
      .where(and(
        eq(apiConfigurations.userId, userId),
        eq(apiConfigurations.serviceId, serviceId)
      ));
    return config;
  }

  async getAllApiConfigurations(userId: string): Promise<ApiConfiguration[]> {
    return await db
      .select()
      .from(apiConfigurations)
      .where(eq(apiConfigurations.userId, userId))
      .orderBy(apiConfigurations.serviceName);
  }

  async upsertApiConfiguration(userId: string, serviceId: string, config: {
    serviceName: string;
    isActive: boolean;
    encryptedConfig: string;
    status: 'active' | 'inactive' | 'error';
  }): Promise<ApiConfiguration> {
    const [result] = await db
      .insert(apiConfigurations)
      .values({
        userId,
        serviceId,
        serviceName: config.serviceName,
        isActive: config.isActive,
        encryptedConfig: config.encryptedConfig,
        status: config.status,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [apiConfigurations.userId, apiConfigurations.serviceId],
        set: {
          serviceName: config.serviceName,
          isActive: config.isActive,
          encryptedConfig: config.encryptedConfig,
          status: config.status,
          updatedAt: new Date(),
        },
      })
      .returning();
    
    return result;
  }

  async updateApiConfigStatus(userId: string, serviceId: string, status: 'active' | 'inactive' | 'error'): Promise<void> {
    await db
      .update(apiConfigurations)
      .set({ 
        status,
        lastTested: new Date(),
        updatedAt: new Date()
      })
      .where(and(
        eq(apiConfigurations.userId, userId),
        eq(apiConfigurations.serviceId, serviceId)
      ));
  }

  // Video statistics
  async getVideoStats(): Promise<{
    totalVideos: number;
    todayVideos: number;
    processingVideos: number;
    successRate: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalVideosResult] = await db.select({ count: count() }).from(videos);
    const [videosTodayResult] = await db
      .select({ count: count() })
      .from(videos)
      .where(sql`${videos.createdAt} >= ${today}`);
    
    const [processingVideosResult] = await db
      .select({ count: count() })
      .from(videos)
      .where(sql`${videos.status} IN ('generating', 'processing')`);
    
    const [completedVideos] = await db
      .select({ count: count() })
      .from(videos)
      .where(sql`${videos.status} IN ('ready', 'approved', 'published')`);
    
    const [failedVideos] = await db
      .select({ count: count() })
      .from(videos)
      .where(eq(videos.status, 'failed'));
    
    const total = completedVideos.count + failedVideos.count;
    const successRate = total > 0 ? Math.round((completedVideos.count / total) * 100) : 100;

    return {
      totalVideos: totalVideosResult.count,
      todayVideos: videosTodayResult.count,
      processingVideos: processingVideosResult.count,
      successRate
    };
  }

  // Update video progress
  async updateVideoProgress(id: string, progress: number): Promise<void> {
    await db
      .update(videos)
      .set({ 
        progress,
        updatedAt: new Date() 
      })
      .where(eq(videos.id, id));
  }
}

export const storage = new DatabaseStorage();
