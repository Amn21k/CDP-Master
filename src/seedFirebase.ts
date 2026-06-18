import { collection, doc, setDoc, getDocs, query, limit } from 'firebase/firestore';
import { db } from './firebase';
import { 
  SEED_SUBJECTS, 
  SEED_CHAPTERS, 
  SEED_MOCK_QUESTIONS,
  Subject,
  Chapter,
  Mcq
} from './chaptersData';

export async function isDatabaseSeeded(): Promise<boolean> {
  try {
    const q = query(collection(db, 'chapters'), limit(1));
    const snap = await getDocs(q);
    return !snap.empty;
  } catch (err) {
    console.error("Error checking db seed status:", err);
    return false;
  }
}

export async function seedFirestoreDatabase(onProgress?: (msg: string) => void): Promise<void> {
  try {
    if (onProgress) onProgress("Seeding Subjects...");
    for (const sub of SEED_SUBJECTS) {
      await setDoc(doc(db, 'subjects', sub.id), sub);
    }

    if (onProgress) onProgress("Seeding Chapters...");
    for (const chap of SEED_CHAPTERS) {
      await setDoc(doc(db, 'chapters', chap.id), chap);
      
      // Seed notes (using summaries as base notes)
      await setDoc(doc(db, 'notes', `note-${chap.id}`), {
        id: `note-${chap.id}`,
        chapterId: chap.id,
        title: `${chap.chapterHindiTitle} Revision Notes`,
        content: chap.importantPoints.join("\n")
      });
    }

    if (onProgress) onProgress("Seeding active Recall Flashcards...");
    for (const chap of SEED_CHAPTERS) {
      for (let i = 0; i < chap.oneLinerRevision.length; i++) {
        const line = chap.oneLinerRevision[i];
        const parts = line.split("? - ");
        const question = parts[0] + "?";
        const answer = parts[1] || "";
        await setDoc(doc(db, 'flashcards', `flash-${chap.id}-${i}`), {
          id: `flash-${chap.id}-${i}`,
          chapterId: chap.id,
          question,
          answer
        });
      }
    }

    if (onProgress) onProgress("Seeding Question Database (MCQs & PYQs)...");
    for (const q of SEED_MOCK_QUESTIONS) {
      await setDoc(doc(db, 'mcqs', q.id), q);
    }

    // Seed exemplary chapter tests
    if (onProgress) onProgress("Seeding Chapter Tests...");
    for (const chap of SEED_CHAPTERS) {
      const chapQ = SEED_MOCK_QUESTIONS.filter(q => q.chapterId === chap.id);
      if (chapQ.length > 0) {
        await setDoc(doc(db, 'chapter_tests', `test-${chap.id}`), {
          id: `test-${chap.id}`,
          chapterId: chap.id,
          testTitle: `${chap.chapterHindiTitle} Mock Test`,
          questions: chapQ
        });
      }
    }

    // Seed exemplary Daily Quiz
    if (onProgress) onProgress("Seeding Daily Quiz...");
    await setDoc(doc(db, 'daily_quiz', 'quiz-today'), {
      id: 'quiz-today',
      date: new Date().toISOString().split('T')[0],
      questions: SEED_MOCK_QUESTIONS.slice(0, 5)
    });

    // Seed exemplary Pyq Bank
    if (onProgress) onProgress("Seeding Previous Year Question (PYQ) Bank...");
    for (let i = 0; i < SEED_MOCK_QUESTIONS.length; i++) {
      const q = SEED_MOCK_QUESTIONS[i];
      await setDoc(doc(db, 'pyq_bank', `pyq-${q.id}`), {
        id: `pyq-${q.id}`,
        chapterId: q.chapterId,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        examYear: i % 2 === 0 ? "2021" : "2022",
        examType: i % 2 === 0 ? "UPTET Paper-I" : "UPTET Paper-II"
      });
    }

    if (onProgress) onProgress("Database successfully seeded into Cloud Firestore!");
  } catch (err: any) {
    console.error("Failed to seed database:", err);
    if (onProgress) onProgress(`Error during seeding: ${err.message}`);
    throw err;
  }
}
