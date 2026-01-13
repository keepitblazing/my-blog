import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  serial,
  date,
  varchar,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Posts table
export const posts = pgTable('post', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category', { enum: ['dev', 'diary'] }).notNull(),
  isPrivate: boolean('is_private').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
});

// Tags table
export const tags = pgTable('tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name').notNull().unique(),
  slug: varchar('slug').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Post-Tags junction table
export const postTags = pgTable(
  'post_tags',
  {
    postId: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.tagId] }),
  }),
);

// Daily visitors table
export const dailyVisitors = pgTable('daily_visitors', {
  id: serial('id').primaryKey(),
  date: date('date').notNull().unique(),
  count: integer('count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Visitor logs table
export const visitorLogs = pgTable('visitor_logs', {
  id: serial('id').primaryKey(),
  visitorHash: text('visitor_hash').notNull(),
  sessionId: text('session_id').notNull(),
  cookieId: text('cookie_id').notNull(),
  ipAddress: text('ip_address').notNull(),
  userAgent: text('user_agent').notNull(),
  visitedAt: timestamp('visited_at', { withTimezone: true }).defaultNow(),
  pagePath: text('page_path').notNull(),
  isNewVisitor: boolean('is_new_visitor').default(true),
});

// Relations
export const postsRelations = relations(posts, ({ many }) => ({
  postTags: many(postTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
}));

// Types
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type PostTag = typeof postTags.$inferSelect;
export type DailyVisitor = typeof dailyVisitors.$inferSelect;
export type VisitorLog = typeof visitorLogs.$inferSelect;
