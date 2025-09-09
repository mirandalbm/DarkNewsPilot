import { storage } from '../storage';

interface VideoPerformanceMetrics {
  videoId: string;
  title: string;
  language: string;
  publishDate: Date;
  views: number;
  likes: number;
  dislikes: number;
  comments: number;
  shares: number;
  watchTime: number;
  impressions: number;
  clickThroughRate: number;
  engagementRate: number;
  revenue: number;
}

interface LanguagePerformance {
  language: string;
  totalVideos: number;
  averageViews: number;
  averageEngagement: number;
  totalRevenue: number;
  topPerformingVideo: string;
}

interface PipelineMetrics {
  period: string;
  newsArticlesProcessed: number;
  videosGenerated: number;
  videosPublished: number;
  successRate: number;
  averageProcessingTime: number;
  automationUptime: number;
  apiCallsUsed: number;
  costPerVideo: number;
}

interface AnalyticsDashboard {
  overview: {
    totalVideos: number;
    totalViews: number;
    totalRevenue: number;
    averageEngagement: number;
    topPerformingLanguage: string;
    automationSuccessRate: number;
  };
  performance: {
    videoMetrics: VideoPerformanceMetrics[];
    languageBreakdown: LanguagePerformance[];
    monthlyTrends: Array<{
      month: string;
      videos: number;
      views: number;
      revenue: number;
    }>;
  };
  pipeline: {
    currentStatus: string;
    weeklyMetrics: PipelineMetrics[];
    bottlenecks: Array<{
      stage: string;
      averageTime: number;
      failureRate: number;
    }>;
  };
  costs: {
    apiUsage: Array<{
      service: string;
      calls: number;
      cost: number;
      costPerCall: number;
    }>;
    totalMonthlyCost: number;
    costPerVideo: number;
    roi: number;
  };
}

class AnalyticsService {
  async getDashboard(userId: string, timeframe: string = '30d'): Promise<AnalyticsDashboard> {
    try {
      const [overview, performance, pipeline, costs] = await Promise.all([
        this.getOverviewMetrics(userId, timeframe),
        this.getPerformanceMetrics(userId, timeframe),
        this.getPipelineMetrics(userId, timeframe),
        this.getCostMetrics(userId, timeframe)
      ]);

      return {
        overview,
        performance,
        pipeline,
        costs
      };
    } catch (error) {
      console.error('Error generating analytics dashboard:', error);
      throw error;
    }
  }

  private async getOverviewMetrics(userId: string, timeframe: string) {
    try {
      const videos = await storage.getVideos(1000);
      const userVideos = videos.filter((v: any) => v.userId === userId);
      
      // Mock data for demonstration - in real implementation would pull from YouTube Analytics API
      const totalVideos = userVideos.length;
      const totalViews = this.calculateTotalViews(userVideos);
      const totalRevenue = this.calculateTotalRevenue(userVideos);
      const averageEngagement = this.calculateAverageEngagement(userVideos);
      const languagePerformance = this.getLanguagePerformance(userVideos);
      const topPerformingLanguage = languagePerformance[0]?.language || 'en';
      const automationSuccessRate = await this.getAutomationSuccessRate(userId);

      return {
        totalVideos,
        totalViews,
        totalRevenue,
        averageEngagement,
        topPerformingLanguage,
        automationSuccessRate
      };
    } catch (error) {
      console.error('Error getting overview metrics:', error);
      return {
        totalVideos: 0,
        totalViews: 0,
        totalRevenue: 0,
        averageEngagement: 0,
        topPerformingLanguage: 'en',
        automationSuccessRate: 0
      };
    }
  }

  private async getPerformanceMetrics(userId: string, timeframe: string) {
    try {
      const videos = await storage.getVideos(1000);
      const userVideos = videos.filter((v: any) => v.userId === userId);

      const videoMetrics = userVideos.map((video: any) => this.generateVideoMetrics(video));
      const languageBreakdown = this.getLanguagePerformance(userVideos);
      const monthlyTrends = this.generateMonthlyTrends(userVideos);

      return {
        videoMetrics: videoMetrics.slice(0, 10), // Top 10 videos
        languageBreakdown,
        monthlyTrends
      };
    } catch (error) {
      console.error('Error getting performance metrics:', error);
      return {
        videoMetrics: [],
        languageBreakdown: [],
        monthlyTrends: []
      };
    }
  }

  private async getPipelineMetrics(userId: string, timeframe: string) {
    try {
      const jobs = await storage.getActiveJobs();
      const userJobs = jobs.filter((j: any) => j.data?.userId === userId);

      const currentStatus = userJobs.length > 0 ? 'active' : 'idle';
      const weeklyMetrics = this.generatePipelineMetrics(userJobs);
      const bottlenecks = this.identifyBottlenecks(userJobs);

      return {
        currentStatus,
        weeklyMetrics,
        bottlenecks
      };
    } catch (error) {
      console.error('Error getting pipeline metrics:', error);
      return {
        currentStatus: 'idle',
        weeklyMetrics: [],
        bottlenecks: []
      };
    }
  }

  private async getCostMetrics(userId: string, timeframe: string) {
    try {
      // Mock API usage data - in real implementation would track actual API calls
      const apiUsage = [
        { service: 'OpenAI GPT', calls: 150, cost: 45.0, costPerCall: 0.3 },
        { service: 'ElevenLabs Voice', calls: 75, cost: 37.5, costPerCall: 0.5 },
        { service: 'HeyGen Avatar', calls: 25, cost: 125.0, costPerCall: 5.0 },
        { service: 'YouTube API', calls: 100, cost: 5.0, costPerCall: 0.05 },
        { service: 'NewsAPI', calls: 500, cost: 10.0, costPerCall: 0.02 }
      ];

      const totalMonthlyCost = apiUsage.reduce((sum, api) => sum + api.cost, 0);
      const videos = await storage.getVideos(100);
      const userVideos = videos.filter((v: any) => v.userId === userId);
      const costPerVideo = userVideos.length > 0 ? totalMonthlyCost / userVideos.length : 0;
      const totalRevenue = this.calculateTotalRevenue(userVideos);
      const roi = totalRevenue > 0 ? ((totalRevenue - totalMonthlyCost) / totalMonthlyCost) * 100 : 0;

      return {
        apiUsage,
        totalMonthlyCost,
        costPerVideo,
        roi
      };
    } catch (error) {
      console.error('Error getting cost metrics:', error);
      return {
        apiUsage: [],
        totalMonthlyCost: 0,
        costPerVideo: 0,
        roi: 0
      };
    }
  }

  private generateVideoMetrics(video: any): VideoPerformanceMetrics {
    // Mock performance data - in real implementation would integrate with YouTube Analytics
    const baseViews = Math.floor(Math.random() * 50000) + 1000;
    const engagementRate = Math.random() * 0.1 + 0.02; // 2-12% engagement
    
    return {
      videoId: video.id,
      title: video.title,
      language: video.language,
      publishDate: video.createdAt,
      views: baseViews,
      likes: Math.floor(baseViews * engagementRate * 0.8),
      dislikes: Math.floor(baseViews * engagementRate * 0.2),
      comments: Math.floor(baseViews * engagementRate * 0.1),
      shares: Math.floor(baseViews * engagementRate * 0.05),
      watchTime: Math.floor(baseViews * 45), // Average 45 seconds
      impressions: Math.floor(baseViews * 5),
      clickThroughRate: Math.random() * 0.08 + 0.02, // 2-10%
      engagementRate,
      revenue: baseViews * 0.001 * Math.random() * 2 // $0.001-0.002 per view
    };
  }

  private getLanguagePerformance(videos: any[]): LanguagePerformance[] {
    const languageStats = new Map<string, any>();

    videos.forEach(video => {
      const metrics = this.generateVideoMetrics(video);
      const lang = video.language || 'en';
      
      if (!languageStats.has(lang)) {
        languageStats.set(lang, {
          language: lang,
          totalVideos: 0,
          totalViews: 0,
          totalRevenue: 0,
          totalEngagement: 0,
          topVideo: { title: '', views: 0 }
        });
      }

      const stats = languageStats.get(lang);
      stats.totalVideos++;
      stats.totalViews += metrics.views;
      stats.totalRevenue += metrics.revenue;
      stats.totalEngagement += metrics.engagementRate;

      if (metrics.views > stats.topVideo.views) {
        stats.topVideo = { title: video.title, views: metrics.views };
      }
    });

    return Array.from(languageStats.values()).map(stats => ({
      language: stats.language,
      totalVideos: stats.totalVideos,
      averageViews: Math.floor(stats.totalViews / stats.totalVideos),
      averageEngagement: stats.totalEngagement / stats.totalVideos,
      totalRevenue: stats.totalRevenue,
      topPerformingVideo: stats.topVideo.title
    })).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  private generateMonthlyTrends(videos: any[]) {
    const monthlyData = new Map<string, any>();
    const now = new Date();

    // Generate data for last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      const monthVideos = videos.filter(v => {
        const videoDate = new Date(v.createdAt);
        return videoDate.getMonth() === date.getMonth() && 
               videoDate.getFullYear() === date.getFullYear();
      });

      monthlyData.set(monthKey, {
        month: monthKey,
        videos: monthVideos.length,
        views: monthVideos.reduce((sum, v) => sum + this.generateVideoMetrics(v).views, 0),
        revenue: monthVideos.reduce((sum, v) => sum + this.generateVideoMetrics(v).revenue, 0)
      });
    }

    return Array.from(monthlyData.values());
  }

  private generatePipelineMetrics(jobs: any[]): PipelineMetrics[] {
    // Mock pipeline metrics for the last 4 weeks
    const weeks = [];
    const now = new Date();

    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekJobs = jobs.filter(job => {
        const jobDate = new Date(job.createdAt);
        return jobDate >= weekStart && jobDate < new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      });

      const completedJobs = weekJobs.filter(j => j.status === 'completed');
      const successRate = weekJobs.length > 0 ? (completedJobs.length / weekJobs.length) * 100 : 0;

      weeks.push({
        period: `Week of ${weekStart.toLocaleDateString()}`,
        newsArticlesProcessed: Math.floor(Math.random() * 50) + 10,
        videosGenerated: weekJobs.filter(j => j.type === 'video_generation').length,
        videosPublished: weekJobs.filter(j => j.type === 'publish' && j.status === 'completed').length,
        successRate,
        averageProcessingTime: Math.floor(Math.random() * 300) + 120, // 2-7 minutes
        automationUptime: Math.random() * 10 + 90, // 90-100%
        apiCallsUsed: Math.floor(Math.random() * 500) + 100,
        costPerVideo: Math.random() * 3 + 2 // $2-5 per video
      });
    }

    return weeks;
  }

  private identifyBottlenecks(jobs: any[]) {
    return [
      {
        stage: 'Script Generation',
        averageTime: 45, // seconds
        failureRate: 2.5 // percentage
      },
      {
        stage: 'Voice Synthesis',
        averageTime: 30,
        failureRate: 1.2
      },
      {
        stage: 'Video Rendering',
        averageTime: 120,
        failureRate: 5.8
      },
      {
        stage: 'YouTube Upload',
        averageTime: 90,
        failureRate: 3.1
      }
    ];
  }

  private calculateTotalViews(videos: any[]): number {
    return videos.reduce((sum, video) => sum + this.generateVideoMetrics(video).views, 0);
  }

  private calculateTotalRevenue(videos: any[]): number {
    return videos.reduce((sum, video) => sum + this.generateVideoMetrics(video).revenue, 0);
  }

  private calculateAverageEngagement(videos: any[]): number {
    if (videos.length === 0) return 0;
    const totalEngagement = videos.reduce((sum, video) => sum + this.generateVideoMetrics(video).engagementRate, 0);
    return totalEngagement / videos.length;
  }

  private async getAutomationSuccessRate(userId: string): Promise<number> {
    try {
      const jobs = await storage.getActiveJobs();
      const userJobs = jobs.filter((j: any) => j.data?.userId === userId);
      
      if (userJobs.length === 0) return 0;
      
      const completedJobs = userJobs.filter(j => j.status === 'completed');
      return (completedJobs.length / userJobs.length) * 100;
    } catch (error) {
      console.error('Error calculating automation success rate:', error);
      return 0;
    }
  }

  // Real-time metrics methods
  async getRealtimeMetrics(userId: string) {
    try {
      const jobs = await storage.getActiveJobs();
      const videos = await storage.getVideos(100);
      const userJobs = jobs.filter((j: any) => j.data?.userId === userId);
      const userVideos = videos.filter((v: any) => v.userId === userId);

      return {
        activeJobs: userJobs.filter(j => j.status === 'processing').length,
        queuedJobs: userJobs.filter(j => j.status === 'pending').length,
        videosReady: userVideos.filter(v => v.status === 'ready').length,
        videosPublished: userVideos.filter(v => v.status === 'published').length,
        systemHealth: this.calculateSystemHealth(userJobs)
      };
    } catch (error) {
      console.error('Error getting realtime metrics:', error);
      return {
        activeJobs: 0,
        queuedJobs: 0,
        videosReady: 0,
        videosPublished: 0,
        systemHealth: 'unknown'
      };
    }
  }

  private calculateSystemHealth(jobs: any[]): string {
    const recentJobs = jobs.filter(job => {
      const jobDate = new Date(job.createdAt);
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
      return jobDate >= hourAgo;
    });

    if (recentJobs.length === 0) return 'idle';
    
    const failedJobs = recentJobs.filter(j => j.status === 'failed');
    const failureRate = failedJobs.length / recentJobs.length;

    if (failureRate === 0) return 'excellent';
    if (failureRate < 0.1) return 'good';
    if (failureRate < 0.3) return 'warning';
    return 'critical';
  }

  async generateReport(userId: string, type: 'weekly' | 'monthly' | 'quarterly'): Promise<string> {
    try {
      const dashboard = await this.getDashboard(userId, type === 'weekly' ? '7d' : type === 'monthly' ? '30d' : '90d');
      
      // Generate a formatted report
      const report = `
# DarkNews Autopilot - ${type.charAt(0).toUpperCase() + type.slice(1)} Performance Report

## Overview
- Total Videos: ${dashboard.overview.totalVideos}
- Total Views: ${dashboard.overview.totalViews.toLocaleString()}
- Total Revenue: $${dashboard.overview.totalRevenue.toFixed(2)}
- Average Engagement: ${(dashboard.overview.averageEngagement * 100).toFixed(2)}%
- Automation Success Rate: ${dashboard.overview.automationSuccessRate.toFixed(1)}%

## Top Performing Content
${dashboard.performance.videoMetrics.slice(0, 3).map((video, index) => 
  `${index + 1}. ${video.title} - ${video.views.toLocaleString()} views (${video.language})`
).join('\n')}

## Language Performance
${dashboard.performance.languageBreakdown.map(lang => 
  `- ${lang.language.toUpperCase()}: ${lang.totalVideos} videos, avg ${lang.averageViews} views, $${lang.totalRevenue.toFixed(2)}`
).join('\n')}

## Costs & ROI
- Total Monthly Cost: $${dashboard.costs.totalMonthlyCost.toFixed(2)}
- Cost per Video: $${dashboard.costs.costPerVideo.toFixed(2)}
- ROI: ${dashboard.costs.roi.toFixed(1)}%

## Pipeline Health
- Current Status: ${dashboard.pipeline.currentStatus}
- Processing Bottlenecks: ${dashboard.pipeline.bottlenecks[0]?.stage || 'None identified'}

Generated on ${new Date().toLocaleDateString()}
      `;

      return report;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();