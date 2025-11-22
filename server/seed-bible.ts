import { db } from "./db";
import { bibleBooks, bibleChapters, bibleVerses } from "../shared/schema";
import { bibleBooks as bookData, bibleVerses as verseData } from "../shared/bible-kjv";

export async function seedBible() {
  try {
    // Check if already seeded
    const existing = await db.select().from(bibleBooks).limit(1);
    if (existing.length > 0) {
      console.log("Bible already seeded");
      return;
    }

    console.log("Seeding Bible database...");

    // Insert books
    const insertedBooks = await db.insert(bibleBooks).values(
      bookData.map(b => ({
        name: b.name,
        abbreviation: b.abbreviation,
        testament: b.testament,
        chapters: b.chapters,
      }))
    ).returning({ id: bibleBooks.id, name: bibleBooks.name });

    console.log(`Inserted ${insertedBooks.length} books`);

    // Create book map for quick lookup
    const bookMap = new Map(insertedBooks.map(b => [b.name, b.id]));

    // Get all unique chapters from verse data
    const uniqueChapters = new Map<string, Set<number>>();
    for (const verse of verseData) {
      if (!uniqueChapters.has(verse.book)) {
        uniqueChapters.set(verse.book, new Set());
      }
      uniqueChapters.get(verse.book)!.add(verse.chapter);
    }

    // Insert chapters and build chapter map
    const chapterMap = new Map<string, Map<number, number>>();
    for (const [bookName, chapters] of uniqueChapters) {
      const bookId = bookMap.get(bookName);
      if (!bookId) continue;

      const chaptersData = Array.from(chapters).map(ch => ({
        bookId,
        chapter: ch,
      }));

      const insertedChapters = await db.insert(bibleChapters).values(chaptersData).returning();
      
      if (!chapterMap.has(bookName)) {
        chapterMap.set(bookName, new Map());
      }
      for (const ch of insertedChapters) {
        chapterMap.get(bookName)!.set(ch.chapter, ch.id);
      }
    }

    console.log(`Inserted chapters for all books`);

    // Insert verses in batches
    const verseBatches = [];
    for (const verse of verseData) {
      const chapterId = chapterMap.get(verse.book)?.get(verse.chapter);
      if (!chapterId) continue;

      verseBatches.push({
        chapterId,
        verse: verse.verse,
        text: verse.text,
      });
    }

    // Insert in batches of 100
    for (let i = 0; i < verseBatches.length; i += 100) {
      const batch = verseBatches.slice(i, i + 100);
      await db.insert(bibleVerses).values(batch);
    }

    console.log(`Inserted ${verseBatches.length} verses`);
    console.log("Bible database seeded successfully!");
  } catch (error) {
    console.error("Error seeding Bible:", error);
    throw error;
  }
}
