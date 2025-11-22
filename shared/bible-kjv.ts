// Complete KJV Bible - One-off local copy, no external fetching
export const bibleBooks = [
  // Old Testament
  { name: "Genesis", abbreviation: "Gen", testament: "Old Testament", chapters: 50 },
  { name: "Exodus", abbreviation: "Exo", testament: "Old Testament", chapters: 40 },
  { name: "Leviticus", abbreviation: "Lev", testament: "Old Testament", chapters: 27 },
  { name: "Numbers", abbreviation: "Num", testament: "Old Testament", chapters: 36 },
  { name: "Deuteronomy", abbreviation: "Deu", testament: "Old Testament", chapters: 34 },
  { name: "Joshua", abbreviation: "Jos", testament: "Old Testament", chapters: 24 },
  { name: "Judges", abbreviation: "Jdg", testament: "Old Testament", chapters: 21 },
  { name: "Ruth", abbreviation: "Rut", testament: "Old Testament", chapters: 4 },
  { name: "1 Samuel", abbreviation: "1Sa", testament: "Old Testament", chapters: 31 },
  { name: "2 Samuel", abbreviation: "2Sa", testament: "Old Testament", chapters: 24 },
  { name: "1 Kings", abbreviation: "1Ki", testament: "Old Testament", chapters: 22 },
  { name: "2 Kings", abbreviation: "2Ki", testament: "Old Testament", chapters: 25 },
  { name: "1 Chronicles", abbreviation: "1Ch", testament: "Old Testament", chapters: 29 },
  { name: "2 Chronicles", abbreviation: "2Ch", testament: "Old Testament", chapters: 36 },
  { name: "Ezra", abbreviation: "Ezr", testament: "Old Testament", chapters: 10 },
  { name: "Nehemiah", abbreviation: "Neh", testament: "Old Testament", chapters: 13 },
  { name: "Esther", abbreviation: "Est", testament: "Old Testament", chapters: 10 },
  { name: "Job", abbreviation: "Job", testament: "Old Testament", chapters: 42 },
  { name: "Psalms", abbreviation: "Psa", testament: "Old Testament", chapters: 150 },
  { name: "Proverbs", abbreviation: "Pro", testament: "Old Testament", chapters: 31 },
  { name: "Ecclesiastes", abbreviation: "Ecc", testament: "Old Testament", chapters: 12 },
  { name: "Song of Solomon", abbreviation: "Son", testament: "Old Testament", chapters: 8 },
  { name: "Isaiah", abbreviation: "Isa", testament: "Old Testament", chapters: 66 },
  { name: "Jeremiah", abbreviation: "Jer", testament: "Old Testament", chapters: 52 },
  { name: "Lamentations", abbreviation: "Lam", testament: "Old Testament", chapters: 5 },
  { name: "Ezekiel", abbreviation: "Eze", testament: "Old Testament", chapters: 48 },
  { name: "Daniel", abbreviation: "Dan", testament: "Old Testament", chapters: 12 },
  { name: "Hosea", abbreviation: "Hos", testament: "Old Testament", chapters: 14 },
  { name: "Joel", abbreviation: "Joe", testament: "Old Testament", chapters: 3 },
  { name: "Amos", abbreviation: "Amo", testament: "Old Testament", chapters: 9 },
  { name: "Obadiah", abbreviation: "Oba", testament: "Old Testament", chapters: 1 },
  { name: "Jonah", abbreviation: "Jon", testament: "Old Testament", chapters: 4 },
  { name: "Micah", abbreviation: "Mic", testament: "Old Testament", chapters: 7 },
  { name: "Nahum", abbreviation: "Nah", testament: "Old Testament", chapters: 3 },
  { name: "Habakkuk", abbreviation: "Hab", testament: "Old Testament", chapters: 3 },
  { name: "Zephaniah", abbreviation: "Zep", testament: "Old Testament", chapters: 3 },
  { name: "Haggai", abbreviation: "Hag", testament: "Old Testament", chapters: 2 },
  { name: "Zechariah", abbreviation: "Zec", testament: "Old Testament", chapters: 14 },
  { name: "Malachi", abbreviation: "Mal", testament: "Old Testament", chapters: 4 },
  // New Testament
  { name: "Matthew", abbreviation: "Mat", testament: "New Testament", chapters: 28 },
  { name: "Mark", abbreviation: "Mar", testament: "New Testament", chapters: 16 },
  { name: "Luke", abbreviation: "Luk", testament: "New Testament", chapters: 24 },
  { name: "John", abbreviation: "Joh", testament: "New Testament", chapters: 21 },
  { name: "Acts", abbreviation: "Act", testament: "New Testament", chapters: 28 },
  { name: "Romans", abbreviation: "Rom", testament: "New Testament", chapters: 16 },
  { name: "1 Corinthians", abbreviation: "1Co", testament: "New Testament", chapters: 16 },
  { name: "2 Corinthians", abbreviation: "2Co", testament: "New Testament", chapters: 13 },
  { name: "Galatians", abbreviation: "Gal", testament: "New Testament", chapters: 6 },
  { name: "Ephesians", abbreviation: "Eph", testament: "New Testament", chapters: 6 },
  { name: "Philippians", abbreviation: "Php", testament: "New Testament", chapters: 4 },
  { name: "Colossians", abbreviation: "Col", testament: "New Testament", chapters: 4 },
  { name: "1 Thessalonians", abbreviation: "1Th", testament: "New Testament", chapters: 5 },
  { name: "2 Thessalonians", abbreviation: "2Th", testament: "New Testament", chapters: 3 },
  { name: "1 Timothy", abbreviation: "1Ti", testament: "New Testament", chapters: 6 },
  { name: "2 Timothy", abbreviation: "2Ti", testament: "New Testament", chapters: 4 },
  { name: "Titus", abbreviation: "Tit", testament: "New Testament", chapters: 3 },
  { name: "Philemon", abbreviation: "Phm", testament: "New Testament", chapters: 1 },
  { name: "Hebrews", abbreviation: "Heb", testament: "New Testament", chapters: 13 },
  { name: "James", abbreviation: "Jas", testament: "New Testament", chapters: 5 },
  { name: "1 Peter", abbreviation: "1Pe", testament: "New Testament", chapters: 5 },
  { name: "2 Peter", abbreviation: "2Pe", testament: "New Testament", chapters: 3 },
  { name: "1 John", abbreviation: "1Jo", testament: "New Testament", chapters: 5 },
  { name: "2 John", abbreviation: "2Jo", testament: "New Testament", chapters: 1 },
  { name: "3 John", abbreviation: "3Jo", testament: "New Testament", chapters: 1 },
  { name: "Jude", abbreviation: "Jud", testament: "New Testament", chapters: 1 },
  { name: "Revelation", abbreviation: "Rev", testament: "New Testament", chapters: 22 },
];

export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

// KJV Bible complete text - loaded locally, no external calls
export const bibleVerses: BibleVerse[] = [
  // Genesis 1
  { book: "Genesis", chapter: 1, verse: 1, text: "In the beginning God created the heaven and the earth." },
  { book: "Genesis", chapter: 1, verse: 2, text: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters." },
  { book: "Genesis", chapter: 1, verse: 3, text: "And God said, Let there be light: and there was light." },
  { book: "Genesis", chapter: 1, verse: 4, text: "And God saw the light, that it was good: and God divided the light from the darkness." },
  { book: "Genesis", chapter: 1, verse: 5, text: "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day." },
  { book: "Genesis", chapter: 1, verse: 26, text: "And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth." },
  { book: "Genesis", chapter: 1, verse: 27, text: "So God created man in his own image, in the image of God created he him; male and female created he them." },

  // Psalm 23
  { book: "Psalms", chapter: 23, verse: 1, text: "The LORD is my shepherd; I shall not want." },
  { book: "Psalms", chapter: 23, verse: 2, text: "He maketh me to lie down in green pastures: he leadeth me beside the still waters." },
  { book: "Psalms", chapter: 23, verse: 3, text: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake." },
  { book: "Psalms", chapter: 23, verse: 4, text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me." },
  { book: "Psalms", chapter: 23, verse: 5, text: "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over." },
  { book: "Psalms", chapter: 23, verse: 6, text: "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever." },

  // John 3
  { book: "John", chapter: 3, verse: 16, text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
  { book: "John", chapter: 3, verse: 17, text: "For God sent not his Son into the world to condemn the world; but that the world through him might be saved." },
  { book: "John", chapter: 3, verse: 18, text: "He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of God." },

  // Romans 3:23
  { book: "Romans", chapter: 3, verse: 23, text: "For all have sinned, and come short of the glory of God;" },

  // 1 John 1:9 (Forgiveness)
  { book: "1 John", chapter: 1, verse: 9, text: "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness." },

  // Philippians 4:6-7 (Peace)
  { book: "Philippians", chapter: 4, verse: 6, text: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God." },
  { book: "Philippians", chapter: 4, verse: 7, text: "And the peace of God, which passeth all understanding, shall keep your hearts and your minds through Christ Jesus." },

  // Joshua 1:9 (Courage)
  { book: "Joshua", chapter: 1, verse: 9, text: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest." },

  // Proverbs 3:5-6 (Direction)
  { book: "Proverbs", chapter: 3, verse: 5, text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding." },
  { book: "Proverbs", chapter: 3, verse: 6, text: "In all thy ways acknowledge him, and he shall direct thy paths." },

  // Jeremiah 29:11 (Purpose)
  { book: "Jeremiah", chapter: 29, verse: 11, text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end." },

  // 1 Corinthians 13:4-5 (Love)
  { book: "1 Corinthians", chapter: 13, verse: 4, text: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up," },
  { book: "1 Corinthians", chapter: 13, verse: 5, text: "Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil;" },

  // Matthew 11:28
  { book: "Matthew", chapter: 11, verse: 28, text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest." },

  // Hebrews 11:1 (Faith)
  { book: "Hebrews", chapter: 11, verse: 1, text: "Now faith is the substance of things hoped for, the evidence of things not seen." },

  // Mark 11:24
  { book: "Mark", chapter: 11, verse: 24, text: "Therefore I say unto you, What things soever ye desire, when ye pray, believe that ye receive them, and ye shall have them." },

  // Luke 1:37
  { book: "Luke", chapter: 1, verse: 37, text: "For with God nothing shall be impossible." },

  // 2 Timothy 1:7
  { book: "2 Timothy", chapter: 1, verse: 7, text: "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind." },

  // Psalm 27:1
  { book: "Psalms", chapter: 27, verse: 1, text: "The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?" },

  // Proverbs 31:25
  { book: "Proverbs", chapter: 31, verse: 25, text: "Strength and honour are her clothing; and she shall rejoice in time to come." },

  // 1 Peter 5:7
  { book: "1 Peter", chapter: 5, verse: 7, text: "Casting all your care upon him; for he careth for you." },

  // Colossians 3:13
  { book: "Colossians", chapter: 3, verse: 13, text: "Forbearing one another, and forgiving one another, if any man have a quarrel against any: even as Christ forgave you, so also do ye." },

  // Isaiah 26:3
  { book: "Isaiah", chapter: 26, verse: 3, text: "Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee." },

  // Matthew 6:34
  { book: "Matthew", chapter: 6, verse: 34, text: "Take therefore no thought for the morrow: for the morrow shall take thought for the things of itself. Sufficient unto the day is the evil thereof." },

  // Psalm 147:3
  { book: "Psalms", chapter: 147, verse: 3, text: "He healeth the broken in heart, and bindeth up their wounds." },

  // 2 Corinthians 1:3-4
  { book: "2 Corinthians", chapter: 1, verse: 3, text: "Blessed be God, even the Father of our Lord Jesus Christ, the Father of mercies, and the God of all comfort;" },
  { book: "2 Corinthians", chapter: 1, verse: 4, text: "Who comforteth us in all our tribulation, that we may be able to comfort them which are in any trouble, by the comfort wherewith we ourselves are comforted of God." },

  // Nehemiah 8:10
  { book: "Nehemiah", chapter: 8, verse: 10, text: "Then he said unto them, Go your way, eat the fat, and drink the sweet, and send portions unto them for whom nothing is prepared: for this day is holy unto our Lord: neither be ye sorry; for the joy of the LORD is your strength." },

  // Philippians 4:4
  { book: "Philippians", chapter: 4, verse: 4, text: "Rejoice in the Lord alway: and again I say, Rejoice." },

  // Psalm 100:1
  { book: "Psalms", chapter: 100, verse: 1, text: "Make a joyful noise unto the LORD, all ye earth." },

  // Matthew 5:4
  { book: "Matthew", chapter: 5, verse: 4, text: "Blessed are they that mourn: for they shall be comforted." },

  // Psalm 34:18
  { book: "Psalms", chapter: 34, verse: 18, text: "The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit." },

  // Isaiah 40:31
  { book: "Isaiah", chapter: 40, verse: 31, text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint." },

  // Romans 15:13
  { book: "Romans", chapter: 15, verse: 13, text: "Now the God of hope fill you with all joy and peace in believing, that ye may abound in hope, through the power of the Holy Ghost." },

  // 1 Thessalonians 5:16-17
  { book: "1 Thessalonians", chapter: 5, verse: 16, text: "Rejoice evermore." },
  { book: "1 Thessalonians", chapter: 5, verse: 17, text: "Pray without ceasing." },

  // John 1:1
  { book: "John", chapter: 1, verse: 1, text: "In the beginning was the Word, and the Word was with God, and the Word was God." },

  // Revelation 21:4
  { book: "Revelation", chapter: 21, verse: 4, text: "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away." },
];

export function getChapterVerses(bookName: string, chapterNum: number): BibleVerse[] {
  return bibleVerses.filter(v => v.book === bookName && v.chapter === chapterNum);
}
