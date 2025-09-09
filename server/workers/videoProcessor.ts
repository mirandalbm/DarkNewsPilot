import { storage } from "../storage";
import { videoService } from "../services/videoService";
import { youtubeService } from "../services/youtubeService";

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
      // Process video render jobs
      const jobs = await storage.getActiveJobs();
      const videoJobs = jobs.filter(job => 
        (job.type === 'video_render' || job.type === 'publish') && 
        job.status === 'pending'
      );
      
      for (const job of videoJobs) {
        if (job.type === 'video_render') {
          await this.processVideoRenderJob(job.id);
        } else if (job.type === 'publish') {
          await this.processPublishJob(job.id);
        }
      }
    } catch (error) {
      console.error("Error in video processor:", error);
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

      const { videoId } = job.data as any;
      
      await storage.updateJobProgress(jobId, 10);
      
      // Upload to YouTube
      const youtubeVideoId = await youtubeService.uploadVideo(videoId);
      
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
