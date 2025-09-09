import { storage } from "../storage";
import { videoService } from "../services/videoService";
import { youtubeService } from "../services/youtubeService";
import { openaiService } from "../services/openaiService";
import { elevenlabsService } from "../services/elevenlabsService";
import { heygenService } from "../services/heygenService";
import fs from 'fs/promises';
import path from 'path';

class VideoProcessor {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;

  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log("Video processor started");
    
    // Process immediately
    this.processVideos();
    
    // Then every 30 seconds
    this.intervalId = setInterval(() => {
      this.processVideos();
    }, 30 * 1000); // 30 seconds
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log("Video processor stopped");
  }

  private async processVideos(): Promise<void> {
    try {
      // Ensure temp directory exists
      await fs.mkdir('./temp', { recursive: true }).catch(() => {});
      
      // Process video generation jobs
      const jobs = await storage.getActiveJobs();
      const pendingJobs = jobs.filter(job => 
        (job.type === 'video_generation' || job.type === 'video_render' || job.type === 'publish') && 
        job.status === 'pending'
      );
      
      const processingJobs = jobs.filter(job => 
        job.type === 'video_generation' && 
        job.status === 'processing'
      );
      
      for (const job of pendingJobs) {
        if (job.type === 'video_generation') {
          await this.processVideoGenerationJob(job.id);
        } else if (job.type === 'video_render') {
          await this.processVideoRenderJob(job.id);
        } else if (job.type === 'publish') {
          await this.processPublishJob(job.id);
        }
      }
      
      // Check external video status for processing jobs
      for (const job of processingJobs) {
        await this.checkExternalVideoStatus(job.id);
      }
    } catch (error) {
      console.error("Error in video processor:", error);
    }
  }

  private async processVideoGenerationJob(jobId: string): Promise<void> {
    try {
      console.log(`Processing video generation job: ${jobId}`);
      
      const jobs = await storage.getActiveJobs();
      const job = jobs.find(j => j.id === jobId);
      
      if (!job || !job.data) {
        throw new Error("Job data not found");
      }

      const { newsArticleId, userId, language = 'en' } = job.data as any;
      
      if (!newsArticleId || !userId) {
        throw new Error('Missing required job data: newsArticleId or userId');
      }
      
      await storage.updateJobProgress(jobId, 10);
      
      // Get news article
      const article = await storage.getNewsArticleById(newsArticleId);
      if (!article) {
        throw new Error('News article not found');
      }
      
      // Step 1: Generate script using OpenAI
      console.log(`Generating script for job ${jobId}`);
      const scriptData = await openaiService.generateScript(
        article.title,
        article.content,
        userId
      );
      
      if (!scriptData) {
        throw new Error('Failed to generate script');
      }
      
      await storage.updateJobProgress(jobId, 30);
      
      // Step 2: Generate audio using ElevenLabs
      console.log(`Generating audio for job ${jobId}`);
      const audioBuffer = await elevenlabsService.generateSpeechMultilingual(
        userId,
        scriptData,
        language
      );
      
      // Save audio to temp file
      const audioPath = path.join('./temp', `audio_${jobId}.mp3`);
      await fs.writeFile(audioPath, audioBuffer);
      
      await storage.updateJobProgress(jobId, 60);
      
      // Step 3: Create video with HeyGen
      console.log(`Creating video for job ${jobId}`);
      const videoId = await heygenService.createVideo(
        userId,
        scriptData,
        {
          language: language,
          background: '#1a1a1a' // Dark theme for mystery content
        }
      );
      
      // Store external video ID for polling
      await storage.updateJobProgress(jobId, 70);
      const updatedJobData = { ...job.data, videoId, audioPath, script: scriptData };
      await storage.updateJob(jobId, {
        status: 'processing',
        data: updatedJobData
      });
      
      console.log(`Video creation initiated for job ${jobId}, HeyGen video ID: ${videoId}`);
      
    } catch (error) {
      console.error(`Error processing video generation job ${jobId}:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      await storage.completeJob(jobId, 'failed', errorMessage);
    }
  }

  private async checkExternalVideoStatus(jobId: string): Promise<void> {
    try {
      const jobs = await storage.getActiveJobs();
      const job = jobs.find(j => j.id === jobId);
      
      if (!job || !job.data) {
        return;
      }
      
      const jobData = job.data as any;
      const { videoId, userId, newsArticleId, audioPath, script } = jobData;
      
      if (!videoId || !userId) {
        return;
      }
      
      // Check video status with HeyGen
      const videoStatus = await heygenService.getVideoStatus(userId, videoId);
      
      if (videoStatus.status === 'completed' && videoStatus.video_url) {
        console.log(`Video completed for job ${jobId}`);
        
        // Download the completed video
        const videoBuffer = await heygenService.downloadVideo(userId, videoStatus.video_url);
        const videoPath = path.join('./temp', `video_${jobId}.mp4`);
        await fs.writeFile(videoPath, videoBuffer);
        
        // Create video record
        const video = await storage.createVideo({
          newsArticleId,
          title: `Dark News: ${script.substring(0, 50)}...`,
          script,
          language: jobData.language || 'en',
          status: 'ready',
          duration: 60, // Estimate - would get from actual video metadata
          thumbnailUrl: videoStatus.thumbnail_url,
          videoPath,
          audioPath,
        });
        
        // Complete the job
        await storage.updateJobProgress(jobId, 100);
        await storage.completeJob(jobId, 'completed');
        
        console.log(`Completed video generation job: ${jobId}, created video: ${video.id}`);
        
      } else if (videoStatus.status === 'failed') {
        console.error(`Video generation failed for job ${jobId}: ${videoStatus.error}`);
        await storage.completeJob(jobId, 'failed', videoStatus.error || 'Video generation failed');
        
        // Clean up temp files
        if (audioPath) {
          try {
            await fs.unlink(audioPath);
          } catch (error) {
            console.error('Error cleaning up audio file:', error);
          }
        }
      }
      // If still processing, we continue polling
      
    } catch (error) {
      console.error(`Error checking external video status for job ${jobId}:`, error);
    }
  }

  private async processVideoRenderJob(jobId: string): Promise<void> {
    try {
      console.log(`Processing video render job: ${jobId}`);
      
      const jobs = await storage.getActiveJobs();
      const job = jobs.find(j => j.id === jobId);
      
      if (!job || !job.data) {
        throw new Error("Job data not found");
      }

      const { videoId, script, language, avatarTemplate } = job.data as any;
      
      await storage.updateJobProgress(jobId, 10);
      
      // Start video rendering with HeyGen
      const heygenVideoId = await videoService.renderWithHeyGen(
        script, 
        language, 
        avatarTemplate
      );
      
      await storage.updateJobProgress(jobId, 30);
      
      // Poll for video completion
      let attempts = 0;
      const maxAttempts = 60; // 30 minutes max
      
      while (attempts < maxAttempts) {
        const status = await videoService.checkVideoStatus(heygenVideoId);
        
        if (status.status === 'complete') {
          // Update video record
          await storage.updateVideoStatus(videoId, 'ready');
          
          // Store video URL (would need proper implementation)
          // await storage.updateVideoUrl(videoId, status.downloadUrl);
          
          await storage.updateJobProgress(jobId, 100);
          await storage.completeJob(jobId, 'completed');
          
          console.log(`Video render job completed: ${jobId}`);
          return;
        } else if (status.status === 'failed') {
          throw new Error("Video rendering failed");
        }
        
        // Update progress based on typical rendering time
        const progress = Math.min(90, 30 + (attempts * 2));
        await storage.updateJobProgress(jobId, progress);
        
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
      }
      
      throw new Error("Video rendering timeout");
      
    } catch (error) {
      console.error(`Error processing video render job ${jobId}:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      await storage.completeJob(jobId, 'failed', errorMessage);
    }
  }

  private async processPublishJob(jobId: string): Promise<void> {
    try {
      console.log(`Processing publish job: ${jobId}`);
      
      const jobs = await storage.getActiveJobs();
      const job = jobs.find(j => j.id === jobId);
      
      if (!job || !job.data) {
        throw new Error("Job data not found");
      }

      const { videoId, userId } = job.data as any;
      
      if (!userId) {
        throw new Error('User ID required for publishing');
      }
      
      await storage.updateJobProgress(jobId, 10);
      
      // Upload to YouTube
      const youtubeVideoId = await youtubeService.uploadVideo(videoId, userId);
      
      await storage.updateJobProgress(jobId, 80);
      
      // Update video status
      await storage.updateVideoStatus(videoId, 'published');
      
      await storage.updateJobProgress(jobId, 100);
      await storage.completeJob(jobId, 'completed');
      
      console.log(`Publish job completed: ${jobId}, YouTube ID: ${youtubeVideoId}`);
      
    } catch (error) {
      console.error(`Error processing publish job ${jobId}:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      await storage.completeJob(jobId, 'failed', errorMessage);
    }
  }
}

const videoProcessor = new VideoProcessor();

export function startVideoProcessor(): void {
  videoProcessor.start();
}

export function stopVideoProcessor(): void {
  videoProcessor.stop();
}
