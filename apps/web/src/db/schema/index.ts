import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

// === ORIGINAL APP TABLES ===
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
  name: text('name').notNull(),
  image: text('image'),
  role: text('role').notNull().default('student'),
  regNo: text('reg_no'),
  passwordHash: text('password_hash'),
  googleId: text('google_id').unique(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  token: text('token').notNull().unique(),
  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
});

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  providerId: text('provider_id').notNull(),
  accountId: text('account_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp_ms' }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp_ms' }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
});

export const verificationCodes = sqliteTable('verification_codes', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
});

export const communities = sqliteTable('communities', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  description: text('description'),
  metadata: text('metadata'),
  totalMembers: integer('total_members').default(0),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
});

export const groups = sqliteTable('groups', {
  id: text('id').primaryKey(),
  communityId: text('community_id').notNull().references(() => communities.id),
  name: text('name').notNull(),
  requiresApproval: integer('requires_approval', { mode: 'boolean' }).default(false),
  memberCount: integer('member_count').default(0),
});

export const campusLocations = sqliteTable('campus_locations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  coordinates: text('coordinates'),
  category: text('category'),
  description: text('description'),
  metadata: text('metadata'),
});

// === SOCIAL FEED TABLES (MERGED) ===
export const userProfiles = sqliteTable('user_profiles', {
  id: text('id').primaryKey(), // Matches users.id
  username: text('username').notNull().unique(),
  displayName: text('display_name'),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  bannerUrl: text('banner_url'),
  followersCount: integer('followers_count').default(0),
  followingCount: integer('following_count').default(0),
  postsCount: integer('posts_count').default(0),
});

export const follows = sqliteTable('follows', {
  followerId: text('follower_id').notNull().references(() => userProfiles.id),
  followingId: text('following_id').notNull().references(() => userProfiles.id),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({ pk: primaryKey({ columns: [table.followerId, table.followingId] }) }));

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  authorId: text('author_id').notNull().references(() => userProfiles.id),
  content: text('content').notNull(),
  type: text('type').notNull().default('text'),
  mediaUrls: text('media_urls'),
  linkPreview: text('link_preview'),
  likeCount: integer('like_count').default(0),
  commentCount: integer('comment_count').default(0),
  repostCount: integer('repost_count').default(0),
  viewCount: integer('view_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
});

export const likes = sqliteTable('likes', {
  userId: text('user_id').notNull().references(() => userProfiles.id),
  postId: text('post_id').notNull().references(() => posts.id),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({ pk: primaryKey({ columns: [table.userId, table.postId] }) }));

export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => posts.id),
  authorId: text('author_id').notNull().references(() => userProfiles.id),
  content: text('content').notNull(),
  parentId: text('parent_id'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
});

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  recipientId: text('recipient_id').notNull().references(() => userProfiles.id),
  actorId: text('actor_id').notNull().references(() => userProfiles.id),
  type: text('type').notNull(),
  postId: text('post_id'),
  read: integer('read', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
});

export const announcements = sqliteTable('announcements', {
id: text('id').primaryKey(),
  targetId: text('target_id').notNull(),
  targetType: text('target_type').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  authorId: text('author_id').notNull(),
  priority: text('priority').notNull().default('normal'),
  createdAt: integer('created_at').notNull()
});
