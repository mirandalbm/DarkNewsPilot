import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enums
export const newsStatusEnum = pgEnum('news_status', ['discovered', 'processed', 'approved', 'rejected']);
export const videoStatusEnum = pgEnum('video_status', ['pending', 'generating', 'ready', 'approved', 'published', 'failed']);
export const jobStatusEnum = pgEnum('job_status', ['pending', 'processing', 'completed', 'failed']);
export const languageEnum = pgEnum('language', ['en-US', 'pt-BR', 'es-ES', 'es-MX', 'de-DE', 'fr-FR', 'hi-IN', 'ja-JP']);

// News articles table
export const newsArticles = pgTable("news_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  url: varchar("url").notNull(),
  source: varchar("source").notNull(),
  viralScore: integer("viral_score").notNull(),
  status: newsStatusEnum("status").default('discovered'),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Video content table
export const videos = pgTable("videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  newsArticleId: varchar("news_article_id").references(() => newsArticles.id),
  title: text("title").notNull(),
  script: text("script").notNull(),
  language: languageEnum("language").notNull(),
  avatarTemplate: varchar("avatar_template").notNull(),
  status: videoStatusEnum("status").default('pending'),
  videoUrl: varchar("video_url"),
  thumbnailUrl: varchar("thumbnail_url"),
  duration: integer("duration"), // in seconds
  youtubeVideoId: varchar("youtube_video_id"),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// YouTube channels table
export const youtubeChannels = pgTable("youtube_channels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  channelId: varchar("channel_id").notNull().unique(),
  name: varchar("name").notNull(),
  language: languageEnum("language").notNull(),
  subscriberCount: integer("subscriber_count").default(0),
  totalViews: integer("total_views").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Processing jobs table
export const processingJobs = pgTable("processing_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").notNull(), // 'news_fetch', 'script_generation', 'video_render', 'publish'
  status: jobStatusEnum("status").default('pending'),
  progress: integer("progress").default(0), // 0-100
  data: jsonb("data"), // job-specific data
  error: text("error"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// System metrics table
export const systemMetrics = pgTable("system_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metricName: varchar("metric_name").notNull(),
  value: decimal("value").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// API status table
export const apiStatus = pgTable("api_status", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceName: varchar("service_name").notNull().unique(),
  status: varchar("status").notNull(), // 'operational', 'degraded', 'down'
  responseTime: integer("response_time"), // in ms
  lastChecked: timestamp("last_checked").defaultNow(),
});

// Relations
export const newsArticlesRelations = relations(newsArticles, ({ many }) => ({
  videos: many(videos),
}));

export const videosRelations = relations(videos, ({ one }) => ({
  newsArticle: one(newsArticles, {
    fields: [videos.newsArticleId],
    references: [newsArticles.id],
  }),
}));

// Export types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = typeof newsArticles.$inferInsert;
export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;
export type YoutubeChannel = typeof youtubeChannels.$inferSelect;
export type InsertYoutubeChannel = typeof youtubeChannels.$inferInsert;
export type ProcessingJob = typeof processingJobs.$inferSelect;
export type InsertProcessingJob = typeof processingJobs.$inferInsert;
export type SystemMetric = typeof systemMetrics.$inferSelect;
export type InsertSystemMetric = typeof systemMetrics.$inferInsert;
export type ApiStatus = typeof apiStatus.$inferSelect;
export type InsertApiStatus = typeof apiStatus.$inferInsert;

// Insert schemas
export const insertNewsArticleSchema = createInsertSchema(newsArticles);
export const insertVideoSchema = createInsertSchema(videos);
export const insertProcessingJobSchema = createInsertSchema(processingJobs);
