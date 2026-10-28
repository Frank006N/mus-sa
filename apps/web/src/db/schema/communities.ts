import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const communities = sqliteTable('communities', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull().default('school'),
  description: text('description'),
  coverImage: text('cover_image'),
  memberCount: integer('member_count').default(0),
  totalMembers: integer('total_members').default(0),
  metadata: text('metadata'),
  createdAt: integer('created_at').notNull(),
});