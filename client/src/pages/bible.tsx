import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppNavbar } from "@/components/app-navbar";
import { ChevronLeft } from "lucide-react";
import bibleImg from "@assets/IMG_2026_1763791961456.jpeg";

const BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
  "Nehemiah", "Esther", "Job", "Psalm", "Proverbs",
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations",
  "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
  "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts",
  "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy",
  "2 Timothy", "Titus", "Philemon", "Hebrews", "James",
  "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
  "Jude", "Revelation"
];

export default function Bible() {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getChapterCount = (book: string): number => {
    const counts: { [key: string]: number } = {
      "Genesis": 50, "Exodus": 40, "Leviticus": 27, "Numbers": 36, "Deuteronomy": 34,
      "Joshua": 24, "Judges": 21, "Ruth": 4, "1 Samuel": 31, "2 Samuel": 24,
      "1 Kings": 22, "2 Kings": 25, "1 Chronicles": 29, "2 Chronicles": 36, "Ezra": 10,
      "Nehemiah": 13, "Esther": 10, "Job": 42, "Psalm": 150, "Proverbs": 31,
      "Ecclesiastes": 12, "Song of Solomon": 8, "Isaiah": 66, "Jeremiah": 52, "Lamentations": 5,
      "Ezekiel": 48, "Daniel": 12, "Hosea": 14, "Joel": 3, "Amos": 9,
      "Obadiah": 1, "Jonah": 4, "Micah": 7, "Nahum": 3, "Habakkuk": 3,
      "Zephaniah": 3, "Haggai": 2, "Zechariah": 14, "Malachi": 4,
      "Matthew": 28, "Mark": 16, "Luke": 24, "John": 21, "Acts": 28,
      "Romans": 16, "1 Corinthians": 16, "2 Corinthians": 13, "Galatians": 6, "Ephesians": 6,
      "Philippians": 4, "Colossians": 4, "1 Thessalonians": 5, "2 Thessalonians": 3, "1 Timothy": 6,
      "2 Timothy": 4, "Titus": 3, "Philemon": 1, "Hebrews": 13, "James": 5,
      "1 Peter": 5, "2 Peter": 3, "1 John": 5, "2 John": 1, "3 John": 1,
      "Jude": 1, "Revelation": 22
    };
    return counts[book] || 1;
  };

  const loadChapter = async (chapter: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/bible-verses?book=${encodeURIComponent(selectedBook!)}&chapter=${chapter}`);
      const data = await response.json();
      setVerses(data.verses || []);
    } catch (error) {
      setVerses([]);
    }
    setLoading(false);
  };

  const handleChapterSelect = (chapter: number) => {
    setSelectedChapter(chapter);
    loadChapter(chapter);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pb-32">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Bible
          </h1>
          <p className="text-gray-600 text-lg">
            American Standard Version (ASV) - Complete Bible
          </p>
        </div>

        {/* Banner Island - Seamless with Image */}
        <div className="mb-8 animate-fade-in">
          <Card className="bg-white border-purple-100 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="h-56 bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center overflow-hidden relative">
                <img 
                  src={bibleImg} 
                  alt="Bible" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="p-6 bg-gradient-to-br from-white to-purple-50">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Sacred Scripture</h2>
                <p className="text-sm text-gray-600">Explore all 66 books with all chapters and verses. American Standard Version - Your complete Bible reference.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {!selectedBook ? (
          <div className="space-y-2 max-h-96 overflow-y-auto border border-purple-200 rounded-lg bg-white p-4">
            {BOOKS.map((book) => (
              <button
                key={book}
                onClick={() => {
                  setSelectedBook(book);
                  setSelectedChapter(null);
                  setVerses([]);
                }}
                className="w-full p-3 text-left rounded-lg border border-purple-100 hover:border-purple-400 hover:bg-purple-50 transition-all group"
                data-testid={`button-book-${book}`}
              >
                <p className="font-semibold text-gray-900 group-hover:text-purple-700">{book}</p>
              </button>
            ))}
          </div>
        ) : !selectedChapter ? (
          <div>
            <Button
              onClick={() => setSelectedBook(null)}
              variant="ghost"
              className="mb-6 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back to Books
            </Button>

            <div className="mb-8 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-lg">
              <h2 className="text-3xl font-serif font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                {selectedBook}
              </h2>
              <p className="text-purple-100 mt-2">American Standard Version (ASV)</p>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto border border-purple-200 rounded-lg bg-white p-4">
              {Array.from({ length: getChapterCount(selectedBook) }, (_, i) => i + 1).map((chapter) => (
                <button
                  key={chapter}
                  onClick={() => handleChapterSelect(chapter)}
                  className="w-full p-3 text-left rounded-lg border border-purple-100 hover:border-purple-400 hover:bg-purple-50 transition-all"
                  data-testid={`button-chapter-${chapter}`}
                >
                  <p className="font-semibold text-gray-900">Chapter {chapter}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <Button
              onClick={() => setSelectedChapter(null)}
              variant="ghost"
              className="mb-6 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back to Chapters
            </Button>

            <div className="mb-8 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-lg">
              <h2 className="text-3xl font-serif font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                {selectedBook} {selectedChapter}
              </h2>
              <p className="text-purple-100 mt-2">American Standard Version (ASV)</p>
            </div>

            {loading ? (
              <Card className="py-12 bg-purple-50 border-purple-200">
                <CardContent className="text-center">
                  <p className="text-gray-500">Loading verses...</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto border border-purple-200 rounded-lg bg-white p-4">
                {verses.length > 0 ? (
                  verses.map((verse: any, idx: number) => (
                    <Card key={idx} className="bg-white border-purple-100">
                      <CardContent className="pt-4 pb-4">
                        <p className="text-xs font-bold text-purple-600 mb-2 uppercase tracking-wider">
                          Verse {verse.verse}
                        </p>
                        <p className="text-sm leading-relaxed text-gray-900">{verse.text}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="pt-6 pb-6 text-center">
                      <p className="text-gray-500">No verses found</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <AppNavbar />
    </div>
  );
}
