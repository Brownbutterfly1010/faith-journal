import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const bibleBooks = pgTable("bible_books", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  abbreviation: varchar("abbreviation", { length: 10 }).notNull(),
  testament: varchar("testament", { length: 20 }).notNull(),
  chapters: integer("chapters").notNull(),
});

export const bibleChapters = pgTable("bible_chapters", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id").notNull(),
  chapter: integer("chapter").notNull(),
});

export const bibleVerses = pgTable("bible_verses", {
  id: serial("id").primaryKey(),
  chapterId: integer("chapter_id").notNull(),
  verse: integer("verse").notNull(),
  text: text("text").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type BibleBook = typeof bibleBooks.$inferSelect;
export type BibleChapter = typeof bibleChapters.$inferSelect;
export type BibleVerse = typeof bibleVerses.$inferSelect;
