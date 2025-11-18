import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../routes';
import { storage } from '../storage';

// Mock the storage module
vi.mock('../storage', () => ({
  storage: {
    getUser: vi.fn(),
    getDashboardStats: vi.fn(),
    getActiveJobs: vi.fn(),
    getApiStatuses: vi.fn(),
    getNewsArticles: vi.fn(),
    updateNewsArticleStatus: vi.fn(),
    createNewsArticle: vi.fn(),
    getNewsStats: vi.fn(),
    getNewsSources: vi.fn(),
    getVideosByStatus: vi.fn(),
    getVideos: vi.fn(),
    getVideoStats: vi.fn(),
    createJob: vi.fn(),
    updateVideoStatus: vi.fn(),
    getYoutubeChannels: vi.fn(),
    getMetrics: vi.fn(),
    getAllApiConfigurations: vi.fn(),
    upsertApiConfiguration: vi.fn(),
    getApiConfiguration: vi.fn(),
    updateApiConfigStatus: vi.fn(),
    getNewsArticleById: vi.fn(),
    createYoutubeChannel: vi.fn(),
  },
}));

// Mock the replitAuth module
vi.mock('../replitAuth', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    setupAuth: vi.fn().mockResolvedValue(null),
    isAuthenticated: vi.fn((req, res, next) => {
      req.user = { claims: { sub: 'test-user-id' } };
      next();
    }),
  };
});

describe('API Routes', () => {
  let app: express.Express;

  beforeEach(async () => {
    app = express();
    app.use(express.json());

    await registerRoutes(app);

    vi.clearAllMocks();
  });

  describe('POST /api/videos/generate', () => {
    it('should create a video generation job and return a job ID', async () => {
      // Arrange
      const newsArticleId = 'test-article-id';
      const mockArticle = { id: newsArticleId, title: 'Test Article' };
      const mockJob = { id: 'test-job-id', status: 'pending' };

      (storage.getNewsArticleById as vi.Mock).mockResolvedValue(mockArticle);
      (storage.createJob as vi.Mock).mockResolvedValue(mockJob);

      // Act
      const response = await request(app)
        .post('/api/videos/generate')
        .send({ newsArticleId, language: 'en' });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Video generation started');
      expect(response.body.jobId).toBe(mockJob.id);
      expect(storage.getNewsArticleById).toHaveBeenCalledWith(newsArticleId);
      expect(storage.createJob).toHaveBeenCalledWith({
        type: 'video_generation',
        status: 'pending',
        data: {
          newsArticleId,
          userId: 'test-user-id',
          language: 'en',
        },
        progress: 0,
      });
    });

    it('should return 404 if the news article is not found', async () => {
        // Arrange
        const newsArticleId = 'non-existent-article-id';
        (storage.getNewsArticleById as vi.Mock).mockResolvedValue(null);

        // Act
        const response = await request(app)
          .post('/api/videos/generate')
          .send({ newsArticleId, language: 'en' });

        // Assert
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('News article not found');
        expect(storage.createJob).not.toHaveBeenCalled();
      });

      it('should return 400 if newsArticleId is not provided', async () => {
        // Act
        const response = await request(app)
          .post('/api/videos/generate')
          .send({ language: 'en' });

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('News article ID is required');
        expect(storage.createJob).not.toHaveBeenCalled();
      });
  });
});
