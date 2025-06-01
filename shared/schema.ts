import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
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
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Paintings table for the gallery
export const paintings = pgTable("paintings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  year: integer("year").notNull(),
  medium: text("medium").notNull(),
  size: text("size").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  availability: varchar("availability", { enum: ["available", "sold", "not-for-sale"] }).notNull().default("available"),
  tags: text("tags").array().default([]),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact messages table
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  paintingId: integer("painting_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const paintingsRelations = relations(paintings, ({ many }) => ({
  contactMessages: many(contactMessages),
}));

export const contactMessagesRelations = relations(contactMessages, ({ one }) => ({
  painting: one(paintings, {
    fields: [contactMessages.paintingId],
    references: [paintings.id],
  }),
}));

// Zod schemas
export const insertPaintingSchema = createInsertSchema(paintings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectPaintingSchema = createSelectSchema(paintings);

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

export const selectContactMessageSchema = createSelectSchema(contactMessages);

export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const selectUserSchema = createSelectSchema(users);

// Types
export type InsertPainting = z.infer<typeof insertPaintingSchema>;
export type Painting = z.infer<typeof selectPaintingSchema>;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = z.infer<typeof selectContactMessageSchema>;
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;
