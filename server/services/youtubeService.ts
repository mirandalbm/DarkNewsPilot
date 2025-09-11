import { google } from 'googleapis';
import { storage } from "../storage";
import { openaiService } from "./openaiService";
import { cryptoService } from "./cryptoService";

class YouTubeService {
  private clients: Map<string, any> = new Map();
  
  // DarkNews channel configuration mapping
  private channelConfigs: Record<string, { channelId: string; name: string; configKey: string }> = {
    'en-US': { channelId: 'UC_DarkNews_EN', name: 'DarkNews English', configKey: 'youtube_en' },
    'pt-BR': { channelId: 'UC_DarkNews_BR', name: 'DarkNews Brasil', configKey: 'youtube_br' },
    'es-ES': { channelId: 'UC_DarkNews_ES', name: 'DarkNews España', configKey: 'youtube_es' },
    'es-MX': { channelId: 'UC_DarkNews_MX', name: 'DarkNews México', configKey: 'youtube_mx' },
    'de-DE': { channelId: 'UC_DarkNews_DE', name: 'DarkNews Deutsch', configKey: 'youtube_de' },
    'fr-FR': { channelId: 'UC_DarkNews_FR', name: 'DarkNews France', configKey: 'youtube_fr' },
    'hi-IN': { channelId: 'UC_DarkNews_IN', name: 'DarkNews India', configKey: 'youtube_in' },
    'ja-JP': { channelId: 'UC_DarkNews_JP', name: 'DarkNews Japan', configKey: 'youtube_jp' }
  };

  async getClient(userId: string): Promise<any> {
    // Fallback to default client for backwards compatibility
    return this.getChannelClient('en-US', userId);
  }

  async getChannelClient(language: string, userId: string): Promise<any> {
    try {
      const cacheKey = `${userId}:${language}`;
      
      // Check cache first
      if (this.clients.has(cacheKey)) {
        return this.clients.get(cacheKey);
      }

      const channelConfig = this.channelConfigs[language];
      if (!channelConfig) {
        console.warn(`No channel config for language: ${language}, using default`);
        return this.getChannelClient('en-US', userId);
      }

      // Try to get channel-specific configuration
      let config = await storage.getApiConfiguration(userId, channelConfig.configKey);
      
      // Fallback to general YouTube config if channel-specific not found
      if (!config || !config.encryptedConfig || !config.isActive) {
        config = await storage.getApiConfiguration(userId, 'youtube');
      }
      
      // Final fallback to global credentials
      if (!config || !config.encryptedConfig || !config.isActive) {
        if (process.env.YOUTUBE_CLIENT_ID && process.env.YOUTUBE_CLIENT_SECRET) {
          return this.createGlobalClient(cacheKey);
        }
        return null;
      }

      const decryptedConfig = JSON.parse(cryptoService.simpleDecrypt(config.encryptedConfig));
      
      if (!decryptedConfig.client_id || !decryptedConfig.client_secret) {
        return this.createGlobalClient(cacheKey);
      }

      const oauth2Client = new google.auth.OAuth2(
        decryptedConfig.client_id,
        decryptedConfig.client_secret,
        'http://localhost:5000/auth/youtube/callback'
      );

      // Set refresh token if available
      if (decryptedConfig.refresh_token) {
        oauth2Client.setCredentials({
          refresh_token: decryptedConfig.refresh_token,
          access_token: decryptedConfig.access_token
        });
      }

      const client = google.youtube({ version: 'v3', auth: oauth2Client });
      
      // Cache the client with language-specific key
      this.clients.set(cacheKey, client);
      
      console.log(`🔑 Created YouTube client for ${channelConfig.name} (${language})`);
      
      return client;
    } catch (error) {
      console.error(`Error creating YouTube client for ${language}:`, error);
      return this.createGlobalClient(`${userId}:${language}`);
    }
  }

  private createGlobalClient(cacheKey?: string): any {
    try {
      if (process.env.YOUTUBE_CLIENT_ID && process.env.YOUTUBE_CLIENT_SECRET) {
        const oauth2Client = new google.auth.OAuth2(
          process.env.YOUTUBE_CLIENT_ID,
          process.env.YOUTUBE_CLIENT_SECRET,
          'http://localhost:5000/auth/youtube/callback'
        );
        
        const client = google.youtube({ version: 'v3', auth: oauth2Client });
        
        // Cache the global client if a cache key is provided
        if (cacheKey) {
          this.clients.set(cacheKey, client);
          console.log(`🔑 Created global YouTube client (cached as: ${cacheKey})`);
        }
        
        return client;
      }
      return null;
    } catch (error) {
      console.error('Error creating global YouTube client:', error);
      return null;
    }
  }

  async uploadVideo(videoId: string, userId: string): Promise<string> {
    try {
      const videos = await storage.getVideos(1000);
      const video = videos.find(v => v.id === videoId);
      
      if (!video || !video.videoUrl) {
        throw new Error("Video not found or not ready");
      }

      // Get language-specific YouTube client for proper channel targeting
      const youtubeClient = await this.getChannelClient(video.language || 'en-US', userId);
      if (!youtubeClient) {
        throw new Error('YouTube API not configured for user');
      }

      // Generate metadata
      const metadata = await openaiService.generateVideoMetadata(
        video.script, 
        video.language,
        userId
      );
      
      // Apply SEO optimization
      const optimizedTitle = this.optimizeTitle(metadata.title, video.language);
      const optimizedDescription = this.optimizeDescription(metadata.description, video.language);
      const optimizedTags = this.optimizeTags(metadata.tags, video.language);

      // Get appropriate channel for language
      const channels = await storage.getYoutubeChannels();
      const targetChannel = channels.find(c => c.language === video.language) || channels[0];
      
      if (!targetChannel) {
        throw new Error("No YouTube channel configured");
      }

      // Download video file (would need actual implementation)
      const videoBuffer = await this.downloadVideo(video.videoUrl);

      const requestBody = {
        snippet: {
          title: optimizedTitle,
          description: optimizedDescription,
          tags: optimizedTags,
          categoryId: '25', // News & Politics
          defaultLanguage: video.language,
        },
        status: {
          privacyStatus: 'public',
          selfDeclaredMadeForKids: false,
        },
      };
      
      console.log(`📺 Uploading video with optimized metadata:`);
      console.log(`   Title: ${optimizedTitle}`);
      console.log(`   Tags: ${optimizedTags.join(', ')}`);
      console.log(`   Language: ${video.language}`);

      const media = {
        mimeType: 'video/mp4',
        body: videoBuffer,
      };

      const response = await youtubeClient.videos.insert({
        part: 'snippet,status',
        requestBody,
        media,
      });

      const youtubeVideoId = response.data.id;
      
      // Validate YouTube ID before updating database
      if (!youtubeVideoId || typeof youtubeVideoId !== 'string') {
        await storage.updateVideoStatus(videoId, 'failed');
        throw new Error('YouTube upload failed: Invalid video ID returned');
      }
      
      // Update video record
      await storage.updateVideoYoutubeId(videoId, youtubeVideoId);
      await storage.updateVideoStatus(videoId, 'published');

      return youtubeVideoId;
    } catch (error) {
      console.error("Error uploading video:", error);
      await storage.updateApiStatus({
        serviceName: "YouTube API",
        status: "down", 
        lastChecked: new Date(),
      });
      throw error;
    }
  }

  private async downloadVideo(url: string): Promise<Buffer> {
    try {
      console.log(`📥 Downloading video from: ${url}`);
      
      // Handle different types of video URLs
      if (url.startsWith('http://') || url.startsWith('https://')) {
        // External URL - download from web
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to download video: ${response.status} ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('video/')) {
          throw new Error(`Invalid content type: ${contentType}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        console.log(`✅ Downloaded video: ${buffer.length} bytes`);
        return buffer;
      } else if (url.startsWith('/') || url.startsWith('./temp/')) {
        // Local file path
        const fs = await import('fs/promises');
        const path = await import('path');
        
        let filePath = url;
        if (!filePath.startsWith('/')) {
          filePath = path.resolve(process.cwd(), filePath);
        }
        
        console.log(`📁 Reading local video file: ${filePath}`);
        const buffer = await fs.readFile(filePath);
        console.log(`✅ Read video file: ${buffer.length} bytes`);
        return buffer;
      } else {
        throw new Error(`Unsupported video URL format: ${url}`);
      }
    } catch (error) {
      console.error('❌ Error downloading video:', error);
      throw new Error(`Failed to download video: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getChannelStats(channelId: string, userId: string): Promise<{
    subscriberCount: number;
    viewCount: number;
    videoCount: number;
  }> {
    try {
      const client = await this.getClient(userId);
      if (!client) {
        throw new Error('YouTube client not available');
      }
      
      const response = await client.channels.list({
        part: 'statistics',
        id: channelId,
      });

      const stats = response.data.items[0]?.statistics;
      
      return {
        subscriberCount: parseInt(stats?.subscriberCount || '0'),
        viewCount: parseInt(stats?.viewCount || '0'),
        videoCount: parseInt(stats?.videoCount || '0'),
      };
    } catch (error) {
      console.error("Error getting channel stats:", error);
      throw error;
    }
  }

  async updateChannelStats(userId: string): Promise<void> {
    try {
      const channels = await storage.getYoutubeChannels();
      
      for (const channel of channels) {
        const stats = await this.getChannelStats(channel.channelId, userId);
        
        // Update channel stats in database
        // (would need additional storage method)
      }
    } catch (error) {
      console.error("Error updating channel stats:", error);
    }
  }

  // Get all supported languages for DarkNews channels
  getSupportedLanguages(): string[] {
    return Object.keys(this.channelConfigs);
  }

  // Get channel info for a specific language
  getChannelInfo(language: string): { channelId: string; name: string; configKey: string } | null {
    return this.channelConfigs[language] || null;
  }

  // Enhanced DarkNews YouTube automation methods
  async publishVideoToMultipleChannels(videoId: string, userId: string): Promise<Record<string, string>> {
    const results: Record<string, string> = {};
    
    try {
      console.log('🌐 Publishing to multiple YouTube channels...');
      
      const videos = await storage.getVideos(1000);
      const video = videos.find(v => v.id === videoId);
      
      if (!video) {
        throw new Error("Video not found");
      }

      // Get all language versions of this video (including the original)
      const allVideoVersions = videos.filter(v => 
        v.newsArticleId === video.newsArticleId && v.status === 'ready'
      );

      console.log(`📺 Found ${allVideoVersions.length} video versions to publish:`);
      allVideoVersions.forEach(v => console.log(`   - ${v.language}: ${v.id}`));

      // Publish each language version to its respective channel
      const publishPromises = allVideoVersions.map(async (videoVersion) => {
        try {
          const channelConfig = this.channelConfigs[videoVersion.language];
          if (!channelConfig) {
            console.warn(`⚠️ No channel config for language: ${videoVersion.language}`);
            return;
          }

          console.log(`📺 Publishing ${videoVersion.language} version to ${channelConfig.name}...`);
          
          const youtubeVideoId = await this.uploadVideoToChannel(
            videoVersion.id, 
            videoVersion.language, 
            userId
          );
          
          results[videoVersion.language] = youtubeVideoId;
          console.log(`✅ ${videoVersion.language}: ${youtubeVideoId}`);
          
        } catch (error) {
          console.error(`❌ Failed to publish to ${videoVersion.language} channel:`, error);
          results[videoVersion.language] = `ERROR: ${error instanceof Error ? error.message : String(error)}`;
        }
      });

      // Wait for all uploads to complete
      await Promise.all(publishPromises);

      // Update API status based on results
      const successCount = Object.values(results).filter(result => !result.startsWith('ERROR')).length;
      const totalCount = Object.keys(results).length;
      
      if (successCount > 0) {
        await storage.updateApiStatus({
          serviceName: "YouTube",
          status: successCount === totalCount ? "operational" : "degraded",
          lastChecked: new Date(),
        });
      } else {
        await storage.updateApiStatus({
          serviceName: "YouTube", 
          status: "down",
          lastChecked: new Date(),
        });
      }

      console.log(`🎯 Multi-channel publishing completed: ${successCount}/${totalCount} successful`);
      return results;
      
    } catch (error) {
      console.error('Error in multi-channel publishing:', error);
      
      await storage.updateApiStatus({
        serviceName: "YouTube",
        status: "down",
        lastChecked: new Date(),
      });
      
      throw error;
    }
  }

  private async uploadVideoToChannel(videoId: string, language: string, userId: string): Promise<string> {
    try {
      const videos = await storage.getVideos(1000);
      const video = videos.find(v => v.id === videoId);
      
      if (!video || !video.videoUrl) {
        throw new Error("Video not found or not ready");
      }

      // Get language-specific YouTube client
      const youtubeClient = await this.getChannelClient(language, userId);
      if (!youtubeClient) {
        throw new Error(`YouTube API not configured for language: ${language}`);
      }

      // Generate metadata for this language
      const metadata = await openaiService.generateVideoMetadata(
        video.script, 
        video.language,
        userId
      );
      
      // Apply language-specific SEO optimization
      const optimizedTitle = this.optimizeTitle(metadata.title, language);
      const optimizedDescription = this.optimizeDescription(metadata.description, language);
      const optimizedTags = this.optimizeTags(metadata.tags, language);

      // Download video file
      const videoBuffer = await this.downloadVideo(video.videoUrl);

      const requestBody = {
        snippet: {
          title: optimizedTitle,
          description: optimizedDescription,
          tags: optimizedTags,
          categoryId: '25', // News & Politics
          defaultLanguage: language,
        },
        status: {
          privacyStatus: 'public',
          selfDeclaredMadeForKids: false,
        },
      };
      
      console.log(`📺 Uploading ${language} video with optimized metadata:`);
      console.log(`   Title: ${optimizedTitle}`);
      console.log(`   Tags: ${optimizedTags.join(', ')}`);

      const media = {
        mimeType: 'video/mp4',
        body: videoBuffer,
      };

      const response = await youtubeClient.videos.insert({
        part: 'snippet,status',
        requestBody,
        media,
      });

      const youtubeVideoId = response.data.id;
      
      // Validate YouTube ID before updating database
      if (!youtubeVideoId || typeof youtubeVideoId !== 'string') {
        await storage.updateVideoStatus(videoId, 'failed');
        throw new Error('YouTube upload failed: Invalid video ID returned');
      }
      
      // Update video record with YouTube ID
      await storage.updateVideoYoutubeId(videoId, youtubeVideoId);
      await storage.updateVideoStatus(videoId, 'published');

      return youtubeVideoId;
      
    } catch (error) {
      console.error(`Error uploading video to ${language} channel:`, error);
      throw error;
    }
  }

  private optimizeTitle(title: string, language: string): string {
    // Dark mystery optimization by language
    const darkPrefixes: Record<string, string[]> = {
      'en-US': ['LEAKED:', 'EXPOSED:', 'BREAKING:', 'CLASSIFIED:', 'DARK TRUTH:'],
      'pt-BR': ['VAZOU:', 'EXPOSTO:', 'ÚLTIMA HORA:', 'CLASSIFICADO:', 'VERDADE SOMBRIA:'],
      'es-ES': ['FILTRADO:', 'EXPUESTO:', 'ÚLTIMA HORA:', 'CLASIFICADO:', 'VERDAD OSCURA:'],
      'es-MX': ['FILTRADO:', 'EXPUESTO:', 'ÚLTIMA HORA:', 'CLASIFICADO:', 'VERDAD OSCURA:'],
      'de-DE': ['GELEAKT:', 'ENTHÜLLT:', 'EILMELDUNG:', 'GEHEIM:', 'DUNKLE WAHRHEIT:'],
      'fr-FR': ['FUITE:', 'EXPOSÉ:', 'DERNIÈRE HEURE:', 'CLASSIFIÉ:', 'VÉRITÉ SOMBRE:'],
      'hi-IN': ['लीक:', 'खुलासा:', 'ब्रेकिंग:', 'गुप्त:', 'काला सच:'],
      'ja-JP': ['リーク:', '暴露:', '速報:', '機密:', 'ダークトゥルース:']
    };

    const prefixes = darkPrefixes[language] || darkPrefixes['en-US'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    
    return `${randomPrefix} ${title}`.slice(0, 100); // YouTube title limit
  }

  private optimizeDescription(description: string, language: string): string {
    const seoEndings: Record<string, string> = {
      'en-US': '\n\n🔍 Subscribe for more dark investigations\n⚡ Ring the bell for breaking conspiracies\n💀 Like if this shocked you\n\n#DarkNews #Conspiracy #Leaked #Breaking #Investigation',
      'pt-BR': '\n\n🔍 Inscreva-se para mais investigações sombrias\n⚡ Ative o sino para conspirações urgentes\n💀 Curta se isso te chocou\n\n#NoticiasSombrias #Conspiracao #Vazamentos #UltimaHora #Investigacao',
      'es-ES': '\n\n🔍 Suscríbete para más investigaciones oscuras\n⚡ Activa la campana para conspiraciones urgentes\n💀 Dale like si te impactó\n\n#NoticiasOscuras #Conspiracion #Filtrados #UltimaHora #Investigacion',
      'es-MX': '\n\n🔍 Suscríbete para más investigaciones oscuras\n⚡ Activa la campana para conspiraciones urgentes\n💀 Dale like si te impactó\n\n#NoticiasOscuras #Conspiracion #Filtrados #UltimaHora #Investigacion',
      'de-DE': '\n\n🔍 Abonniere für mehr dunkle Ermittlungen\n⚡ Glocke an für brisante Verschwörungen\n💀 Like wenn dich das schockiert hat\n\n#DunkleNachrichten #Verschwoerung #Geleakt #Eilmeldung #Ermittlung',
      'fr-FR': '\n\n🔍 Abonnez-vous pour plus d\'enquêtes sombres\n⚡ Activez la cloche pour les conspirations urgentes\n💀 Likez si cela vous a choqué\n\n#ActualitesSombres #Conspiration #Fuites #DerniereHeure #Enquete',
      'hi-IN': '\n\n🔍 अधिक डार्क जांच के लिए सब्सक्राइब करें\n⚡ तत्काल षड्यंत्रों के लिए बेल दबाएं\n💀 लाइक करें अगर यह आपको हैरान करता है\n\n#DarkNewsHindi #Conspiracy #Leaked #Breaking #Investigation',
      'ja-JP': '\n\n🔍 ダーク調査でチャンネル登録\n⚡ 緊急陰謀のためにベルをクリック\n💀 衝撃を受けたらいいねを\n\n#ダークニュース #陰謀 #リーク #速報 #調査'
    };

    const ending = seoEndings[language] || seoEndings['en-US'];
    return (description + ending).slice(0, 5000); // YouTube description limit
  }

  private optimizeTags(baseTags: string[], language: string): string[] {
    const darkTags: Record<string, string[]> = {
      'en-US': ['dark news', 'conspiracy', 'leaked', 'classified', 'investigation', 'breaking news', 'exposed', 'cover up'],
      'pt-BR': ['noticias sombrias', 'conspiracao', 'vazamentos', 'classificado', 'investigacao', 'ultima hora', 'exposto', 'encobrimento'],
      'es-ES': ['noticias oscuras', 'conspiracion', 'filtrado', 'clasificado', 'investigacion', 'ultima hora', 'expuesto', 'encubrimiento'],
      'es-MX': ['noticias oscuras', 'conspiracion', 'filtrado', 'clasificado', 'investigacion', 'ultima hora', 'expuesto', 'encubrimiento'],
      'de-DE': ['dunkle nachrichten', 'verschwoerung', 'geleakt', 'geheim', 'ermittlung', 'eilmeldung', 'enthuellt', 'vertuschung'],
      'fr-FR': ['actualites sombres', 'conspiration', 'fuite', 'classifie', 'enquete', 'derniere heure', 'expose', 'dissimulation'],
      'hi-IN': ['dark news hindi', 'conspiracy', 'leaked', 'classified', 'investigation', 'breaking', 'exposed', 'cover up'],
      'ja-JP': ['ダークニュース', '陰謀', 'リーク', '機密', '調査', '速報', '暴露', '隠蔽']
    };

    const languageTags = darkTags[language] || darkTags['en-US'];
    return [...baseTags, ...languageTags].slice(0, 15); // YouTube tag limit
  }

  async scheduleVideo(videoId: string, publishTime: Date, userId: string): Promise<void> {
    try {
      console.log(`⏰ Scheduling video ${videoId} for ${publishTime.toISOString()}`);
      
      // Get the video from our storage to find the YouTube video ID
      const videos = await storage.getVideos(1000);
      const video = videos.find(v => v.id === videoId);
      
      if (!video) {
        throw new Error(`Video not found: ${videoId}`);
      }
      
      if (!video.youtubeVideoId) {
        throw new Error(`Video has not been uploaded to YouTube yet: ${videoId}`);
      }
      
      // Use channel-specific client for the video's language
      const client = await this.getChannelClient(video.language, userId);
      if (!client) {
        throw new Error(`YouTube client not available for language: ${video.language}`);
      }

      console.log(`📺 Scheduling YouTube video ${video.youtubeVideoId} (${video.language}, internal ID: ${videoId})`);

      const response = await client.videos.update({
        part: 'status',
        requestBody: {
          id: video.youtubeVideoId, // Use the actual YouTube video ID
          status: {
            privacyStatus: 'private',
            publishAt: publishTime.toISOString()
          }
        }
      });

      if (!response.data) {
        throw new Error('Failed to schedule video');
      }

      console.log('✅ Video scheduled successfully');
      
      // Update our video record to track the scheduled publish time
      await storage.updateVideoStatus(videoId, 'scheduled');
      
    } catch (error) {
      console.error('Error scheduling video:', error);
      
      // Update API status on error
      await storage.updateApiStatus({
        serviceName: "YouTube",
        status: "down",
        lastChecked: new Date(),
      });
      
      throw error;
    }
  }

  async scheduleMultiChannelVideos(newsId: string, publishTime: Date, userId: string): Promise<Record<string, string>> {
    const results: Record<string, string> = {};
    
    try {
      console.log(`⏰ Scheduling multi-channel videos for news ${newsId} at ${publishTime.toISOString()}`);
      
      // Get all video versions for this news article
      const videos = await storage.getVideos(1000);
      const newsVideos = videos.filter(v => 
        v.newsArticleId === newsId && v.status === 'published' && v.youtubeVideoId
      );

      if (newsVideos.length === 0) {
        throw new Error(`No published videos found for news: ${newsId}`);
      }

      console.log(`📺 Found ${newsVideos.length} videos to schedule:`);
      newsVideos.forEach(v => console.log(`   - ${v.language}: ${v.youtubeVideoId}`));

      // Schedule each video in its respective channel
      const schedulePromises = newsVideos.map(async (video) => {
        try {
          const channelConfig = this.channelConfigs[video.language];
          if (!channelConfig) {
            console.warn(`⚠️ No channel config for language: ${video.language}`);
            return;
          }

          console.log(`⏰ Scheduling ${video.language} video in ${channelConfig.name}...`);
          
          const client = await this.getChannelClient(video.language, userId);
          if (!client) {
            throw new Error(`YouTube client not available for language: ${video.language}`);
          }

          const response = await client.videos.update({
            part: 'status',
            requestBody: {
              id: video.youtubeVideoId,
              status: {
                privacyStatus: 'private',
                publishAt: publishTime.toISOString()
              }
            }
          });

          if (!response.data) {
            throw new Error(`Failed to schedule ${video.language} video`);
          }

          // Update video status in our database
          await storage.updateVideoStatus(video.id, 'scheduled');
          
          results[video.language] = video.youtubeVideoId || 'NO_YOUTUBE_ID';
          console.log(`✅ ${video.language}: ${video.youtubeVideoId} scheduled`);
          
        } catch (error) {
          console.error(`❌ Failed to schedule ${video.language} video:`, error);
          results[video.language] = `ERROR: ${error instanceof Error ? error.message : String(error)}`;
        }
      });

      // Wait for all scheduling to complete
      await Promise.all(schedulePromises);

      // Update API status based on results
      const successCount = Object.values(results).filter(result => !result.startsWith('ERROR')).length;
      const totalCount = Object.keys(results).length;
      
      if (successCount > 0) {
        await storage.updateApiStatus({
          serviceName: "YouTube",
          status: successCount === totalCount ? "operational" : "degraded",
          lastChecked: new Date(),
        });
      }

      console.log(`🎯 Multi-channel scheduling completed: ${successCount}/${totalCount} successful`);
      return results;
      
    } catch (error) {
      console.error('Error in multi-channel scheduling:', error);
      
      await storage.updateApiStatus({
        serviceName: "YouTube",
        status: "down",
        lastChecked: new Date(),
      });
      
      throw error;
    }
  }
}

export const youtubeService = new YouTubeService();
