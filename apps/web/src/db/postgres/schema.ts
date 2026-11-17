import { 
  boolean, integer, jsonb, pgTable, real, text, timestamp, uuid, varchar, numeric 
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users Table
export const mutSaUsers = pgTable('mut_sa_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  displayName: text('display_name').notNull(),
  role: varchar('role', { length: 16 }).notNull().default('student'),
  passwordHash: text('password_hash'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Sessions Table (Required for Lucia Auth)
export const mutSaSessions = pgTable('mut_sa_sessions', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => mutSaUsers.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});

// Communities Table
export const mutSaCommunities = pgTable('mut_sa_communities', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: text('type').notNull(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Posts Table
export const mutSaPosts = pgTable('mut_sa_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  authorId: uuid('author_id').notNull().references(() => mutSaUsers.id),
  communityId: uuid('community_id').references(() => mutSaCommunities.id),
  body: text('body').notNull().default(''),
  mediaType: text('media_type').notNull().default('text'),
  mediaUrls: jsonb('media_urls').$type<string[]>().notNull().default([]),
  likeCount: integer('like_count').notNull().default(0),
  commentCount: integer('comment_count').notNull().default(0),
  repostCount: integer('repost_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// Profiles Table
export const mutSaProfiles = pgTable('mut_sa_profiles', {
  userId: uuid('user_id').primaryKey().references(() => mutSaUsers.id, { onDelete: 'cascade' }),
  username: text('username').notNull().unique(),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  followersCount: integer('followers_count').notNull().default(0),
  followingCount: integer('following_count').notNull().default(0),
});

// Reports Table
export const mutSaReports = pgTable('mut_sa_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  reporterId: uuid('reporter_id').references(() => mutSaUsers.id, { onDelete: 'set null' }),
  anonymous: boolean('anonymous').notNull().default(false),
  entityType: text('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(),
  category: text('category').notNull(),
  details: text('details'),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Marketplace Listings Table
export const mutSaMarketplaceListings = pgTable('mut_sa_marketplace_listings', {
  id: uuid('id').primaryKey().defaultRandom(),
  sellerId: uuid('seller_id').notNull().references(() => mutSaUsers.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  priceKes: numeric('price_kes', { precision: 12, scale: 2 }).notNull(),
  category: text('category').notNull(),
  imageUrls: jsonb('image_urls').$type<string[]>().notNull().default([]),
  campusZone: text('campus_zone'),
  verifiedSeller: boolean('verified_seller').notNull().default(false),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Documents Table (For RAG)
export const mutSaDocuments = pgTable('mut_sa_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  sourceUrl: text('source_url'),
  content: text('content').notNull(),
  schoolId: uuid('school_id').references(() => mutSaCommunities.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Timeline Entries Table
export const mutSaTimelineEntries = pgTable('mut_sa_timeline_entries', {
  userId: uuid('user_id').notNull().references(() => mutSaUsers.id, { onDelete: 'cascade' }),
  postId: uuid('post_id').notNull().references(() => mutSaPosts.id, { onDelete: 'cascade' }),
  score: real('score').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Relations (Required for Drizzle .with() queries)
export const mutSaPostsRelations = relations(mutSaPosts, ({ one }) => ({
  author: one(mutSaUsers, { fields: [mutSaPosts.authorId], references: [mutSaUsers.id] }),
  community: one(mutSaCommunities, { fields: [mutSaPosts.communityId], references: [mutSaCommunities.id] }),
}));

export const mutSaUsersRelations = relations(mutSaUsers, ({ many }) => ({
  posts: many(mutSaPosts),
}));
