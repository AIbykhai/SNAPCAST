import { pgTable, serial, text, timestamp, integer, json, uuid } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  company: text("company"),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Brand profiles table
export const brandProfiles = pgTable("brand_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  brandVoice: text("brand_voice").notNull(),
  vocabulary: json("vocabulary").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Content posts table
export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  content: text("content").notNull(),
  platform: text("platform").notNull(),
  scheduledFor: timestamp("scheduled_for"),
  publishedAt: timestamp("published_at"),
  image: text("image"),
  status: text("status").notNull().default("draft"), // draft, scheduled, published, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Analytics data table
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  postId: uuid("post_id")
    .references(() => posts.id)
    .notNull(),
  reach: integer("reach").default(0),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  engagementRate: text("engagement_rate").default("0"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// AI analysis results table
export const accountAnalysis = pgTable("account_analysis", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  accountUrl: text("account_url").notNull(),
  results: json("results").$type<any[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Define relations
export const userRelations = relations(users, ({ many }) => ({
  brandProfiles: many(brandProfiles),
  posts: many(posts),
  accountAnalyses: many(accountAnalysis),
}))

export const postRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  analytics: one(analytics, {
    fields: [posts.id],
    references: [analytics.postId],
  }),
}))
