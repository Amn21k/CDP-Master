import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, BookOpen, Award, Compass, User, Sparkles, Send, 
  RefreshCw, CheckCircle2, XCircle, ChevronRight, ChevronLeft, 
  Clock, Search, ChevronDown, ChevronUp, AlertCircle, Shield, Wind, PenTool, GraduationCap, X, MessageCircle, BrainCircuit, Target, Zap, Rocket, Flame, Medal, Calendar, Bell, Check, Bookmark, HelpCircle, Trash, History, Book, Map
} from 'lucide-react';
import { STUDY_TOPICS, MOCK_QUESTIONS, QUICK_DOUBT_CHIPS, Question, FLASHCARDS, get30Questions } from './data';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { isDatabaseSeeded, seedFirestoreDatabase } from './seedFirebase';

const MOTIVATIONAL_QUOTES = [
  "Mock tests solve karein aur mistake notebook review karna na bhulein.",
  "Roz 20 MCQs aapko selection ke aur kareeb le jaate hain.",
  "Weak topics par focus karna hi smart preparation hai.",
  "Consistency beats motivation every time.",
  "Revision ke bina preparation adhuri hai.",
  "Har galti ek naya lesson hai.",
  "Daily challenge complete karna apni habit bana lijiye.",
  "Exam se pehle confidence revision se aata hai."
];

export default function App() {
  // Navigation Tabs: home | practice | mock_test | study_hub | profile
  const [activeTab, setActiveTab] = useState<'home' | 'practice' | 'mock_test' | 'study_hub' | 'profile'>('home');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Authentication Setup
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('cdp_isLoggedIn') === 'true';
  });
  const [authScreen, setAuthScreen] = useState<'login' | 'signup' | 'forgot_password'>('login');
  
  // Login input fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup input fields
  const [signupFullName, setSignupFullName] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupTargetExam, setSignupTargetExam] = useState<'UPTET' | 'CTET' | 'STET'>('UPTET');
  
  // Forgot Password input fields
  const [forgotEmail, setForgotEmail] = useState('');
  
  // Feedback banners
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Registered credentials DB inside localStorage
  const [usersDb, setUsersDb] = useState<Record<string, any>>(() => {
    const saved = localStorage.getItem('cdp_usersDb_rich');
    if (saved) return JSON.parse(saved);
    return {
      "ak2225042@gmail.com": {
        fullName: "Aman Kumar",
        mobileNumber: "7571051611",
        email: "ak2225042@gmail.com",
        password: "password",
        targetExam: "UPTET",
        joinedDate: "2026-06-18",
        streak: 12,
        totalQuestionsSolved: 45,
        accuracy: 85,
        xp: 750,
        rank: "#42"
      }
    };
  });

  const saveUsersDb = (newDb: Record<string, any>) => {
    setUsersDb(newDb);
    localStorage.setItem('cdp_usersDb_rich', JSON.stringify(newDb));
  };

  // User object state
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    fullName: string;
    name: string;
    mobileNumber: string;
    email: string;
    role: string;
    targetExam: string;
    course: string;
    joinedDate: string;
    streak: number;
    totalQuestionsSolved: number;
    accuracy: number;
    xp: number;
    rank: string;
    badges: string[];
    coins: number;
  }>(() => {
    const saved = localStorage.getItem('cdp_currentUser_rich');
    if (saved) return JSON.parse(saved);
    return {
      id: "STU_98765",
      fullName: "Aman Kumar",
      name: "Aman Kumar",
      mobileNumber: "7571051611",
      email: "ak2225042@gmail.com",
      role: "Premium Student",
      targetExam: "UPTET",
      course: "COURSE_UPTET_2026",
      joinedDate: "2026-06-18",
      streak: 12,
      totalQuestionsSolved: 45,
      accuracy: 85,
      xp: 750,
      rank: "#42",
      badges: ["First Quiz Completed", "7 Day Streak"],
      coins: 350
    };
  });

  // Track dynamic gamification stats
  const [questionsSolvedCount, setQuestionsSolvedCount] = useState<number>(() => {
    const savedRich = localStorage.getItem('cdp_currentUser_rich');
    if (savedRich) {
      try {
        const parsed = JSON.parse(savedRich);
        return parsed.totalQuestionsSolved || 45;
      } catch (e) {}
    }
    return Number(localStorage.getItem('cdp_questionsSolved') || '45');
  });
  const [accuracyRate, setAccuracyRate] = useState<number>(() => {
    const savedRich = localStorage.getItem('cdp_currentUser_rich');
    if (savedRich) {
      try {
        const parsed = JSON.parse(savedRich);
        return parsed.accuracy || 85;
      } catch (e) {}
    }
    return Number(localStorage.getItem('cdp_accuracyRate') || '85');
  });
  const [streakDays, setStreakDays] = useState<number>(() => {
    const savedRich = localStorage.getItem('cdp_currentUser_rich');
    if (savedRich) {
      try {
        const parsed = JSON.parse(savedRich);
        return parsed.streak || 12;
      } catch (e) {}
    }
    return 12;
  });
  const [testAttemptsCount, setTestAttemptsCount] = useState<number>(() => {
    return Number(localStorage.getItem('cdp_testAttemptsCount') || '3');
  });

  // Keep state in sync with localStorage and currentUser modifications
  useEffect(() => {
    setCurrentUser(prev => {
      const updated = {
        ...prev,
        totalQuestionsSolved: questionsSolvedCount,
        accuracy: accuracyRate,
        streak: streakDays
      };
      localStorage.setItem('cdp_currentUser_rich', JSON.stringify(updated));
      return updated;
    });
  }, [questionsSolvedCount, accuracyRate, streakDays]);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setAuthError("Email and Password are required.");
      return;
    }
    
    const emailKey = loginEmail.toLowerCase().trim();
    const matched = usersDb[emailKey];
    
    if (matched && matched.password === loginPassword) {
      const nextUser = {
        id: "STU_" + Math.floor(10000 + Math.random() * 90000),
        fullName: matched.fullName,
        name: matched.fullName,
        email: matched.email,
        mobileNumber: matched.mobileNumber,
        targetExam: matched.targetExam,
        course: "COURSE_" + matched.targetExam + "_2026",
        role: "Premium Student",
        joinedDate: matched.joinedDate || "2026-06-18",
        streak: matched.streak || 12,
        coins: 350,
        xp: matched.xp || 750,
        rank: matched.rank || "#42",
        badges: ["First Quiz Completed", "7 Day Streak"]
      };
      
      setCurrentUser(nextUser);
      localStorage.setItem('cdp_currentUser_rich', JSON.stringify(nextUser));
      
      setQuestionsSolvedCount(matched.totalQuestionsSolved || 45);
      setAccuracyRate(matched.accuracy || 85);
      setStreakDays(matched.streak || 12);
      
      setLoginEmail('');
      setLoginPassword('');
      setIsLoggedIn(true);
      localStorage.setItem('cdp_isLoggedIn', 'true');
      setAuthSuccess("Login successful!");
      confetti({ particleCount: 80, spread: 60 });
    } else {
      setAuthError("Kripya sahi Email aur Password enter karein.");
    }
  };

  const handleSignup = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    
    if (!signupFullName.trim() || !signupMobile.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setAuthError("Sabhi fields bharne anivarya hain.");
      return;
    }
    
    if (signupPassword !== signupConfirmPassword) {
      setAuthError("Password aur Confirm Password mismatch hain.");
      return;
    }
    
    const emailKey = signupEmail.toLowerCase().trim();
    if (usersDb[emailKey]) {
      setAuthError("Yeh email user setup mein already registered hai.");
      return;
    }
    
    const newUserRecord = {
      fullName: signupFullName,
      mobileNumber: signupMobile,
      email: signupEmail,
      password: signupPassword,
      targetExam: signupTargetExam,
      joinedDate: "2026-06-18",
      streak: 12,
      totalQuestionsSolved: 45,
      accuracy: 85,
      xp: 750,
      rank: "#42"
    };

    const updatedDb = { ...usersDb, [emailKey]: newUserRecord };
    saveUsersDb(updatedDb);
    
    const nextUser = {
      id: "STU_" + Math.floor(10000 + Math.random() * 90000),
      fullName: newUserRecord.fullName,
      name: newUserRecord.fullName,
      email: newUserRecord.email,
      mobileNumber: newUserRecord.mobileNumber,
      targetExam: newUserRecord.targetExam,
      course: "COURSE_" + newUserRecord.targetExam + "_2026",
      role: "Premium Student",
      joinedDate: newUserRecord.joinedDate,
      streak: 12,
      coins: 350,
      xp: 750,
      rank: "#42",
      badges: ["First Quiz Completed"]
    };
    
    setCurrentUser(nextUser);
    localStorage.setItem('cdp_currentUser_rich', JSON.stringify(nextUser));
    
    setQuestionsSolvedCount(45);
    setAccuracyRate(85);
    setStreakDays(12);
    
    // reset form fields
    setSignupFullName('');
    setSignupMobile('');
    setSignupEmail('');
    setSignupPassword('');
    setSignupConfirmPassword('');
    
    setIsLoggedIn(true);
    localStorage.setItem('cdp_isLoggedIn', 'true');
    setAuthSuccess("Account setup complete!");
    confetti({ particleCount: 100, spread: 80 });
  };

  const handleForgotPassword = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    
    if (!forgotEmail.trim()) {
      setAuthError("Kripya email fill-up karein.");
      return;
    }
    
    setAuthSuccess("Password instructions simulated successfully. WhatsApp manual setup option directly is also active below!");
  };

  const handleGoogleLogin = () => {
    setAuthError(null);
    setAuthSuccess("Simulating Google OAuth verification...");
    
    setTimeout(() => {
      const emailVal = "ak2225042@gmail.com";
      const matched = usersDb[emailVal] || {
        fullName: "Aman Kumar",
        mobileNumber: "7571051611",
        email: emailVal,
        password: "password",
        targetExam: "UPTET",
        joinedDate: "2026-06-18",
        streak: 12,
        totalQuestionsSolved: 45,
        accuracy: 85,
        xp: 750,
        rank: "#42"
      };
      
      const nextUser = {
        id: "STU_GOOGLE",
        fullName: matched.fullName,
        name: matched.fullName,
        email: matched.email,
        mobileNumber: matched.mobileNumber,
        targetExam: matched.targetExam,
        course: "COURSE_" + matched.targetExam + "_2026",
        role: "Premium Student",
        joinedDate: matched.joinedDate || "2026-06-18",
        streak: matched.streak || 12,
        coins: 350,
        xp: matched.xp || 750,
        rank: matched.rank || "#42",
        badges: ["First Quiz Completed", "7 Day Streak"]
      };
      
      setCurrentUser(nextUser);
      localStorage.setItem('cdp_currentUser_rich', JSON.stringify(nextUser));
      
      setQuestionsSolvedCount(matched.totalQuestionsSolved || 45);
      setAccuracyRate(matched.accuracy || 85);
      setStreakDays(matched.streak || 12);
      
      setIsLoggedIn(true);
      localStorage.setItem('cdp_isLoggedIn', 'true');
      setAuthSuccess("Google sign-in successful!");
      confetti({ particleCount: 80, spread: 60 });
    }, 850);
  };

  // Wrong Questions and Bookmarks
  const [wrongQuestions, setWrongQuestions] = useState<number[]>(() => {
    const saved = localStorage.getItem('cdp_wrongQuestions');
    return saved ? JSON.parse(saved) : [4, 12, 27]; // preloaded with some questions for immediate revision
  });
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<number[]>(() => {
    const saved = localStorage.getItem('cdp_bookmarks');
    return saved ? JSON.parse(saved) : [10, 28]; // preloaded
  });

  useEffect(() => {
    localStorage.setItem('cdp_wrongQuestions', JSON.stringify(wrongQuestions));
  }, [wrongQuestions]);

  useEffect(() => {
    localStorage.setItem('cdp_bookmarks', JSON.stringify(bookmarkedQuestions));
  }, [bookmarkedQuestions]);

  // Dynamic Topic Accuracies for Weak Topic Engine (We'll mark < 60% as Weak)
  const [topicAccuracies, setTopicAccuracies] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem('cdp_topicAccuracies');
    if (saved) return JSON.parse(saved);
    return {
      1: 85, // Intro to Psychology
      2: 72, // Child development & Reflexes
      3: 52, // Heredity & Environment (Weak < 60%)
      4: 78, // Piaget, Vygotsky, Kohlberg
      5: 48, // Freud, Bruner, Bloom (Weak < 60%)
      6: 82, // Thorndike, Pavlov, Skinner
      7: 64, // Intelligence & Tests
      8: 45  // RTE / IEP / NEP / NCF (Weak < 60%)
    };
  });

  // Daily Tasks Completion Tracker for Smart Study Plan
  const [questionsSolvedToday, setQuestionsSolvedToday] = useState<number>(() => {
    return Number(localStorage.getItem('cdp_questionsSolvedToday') || '0');
  });
  const [completedRevisionToday, setCompletedRevisionToday] = useState<boolean>(() => {
    return localStorage.getItem('cdp_completedRevisionToday') === 'true';
  });
  const [completedMockToday, setCompletedMockToday] = useState<boolean>(() => {
    return localStorage.getItem('cdp_completedMockToday') === 'true';
  });

  const [aiGuruMessageCount, setAiGuruMessageCount] = useState<number>(() => {
    return Number(localStorage.getItem('cdp_aiGuruMessageCount') || '0');
  });

  useEffect(() => {
    localStorage.setItem('cdp_aiGuruMessageCount', String(aiGuruMessageCount));
  }, [aiGuruMessageCount]);

  useEffect(() => {
    localStorage.setItem('cdp_topicAccuracies', JSON.stringify(topicAccuracies));
  }, [topicAccuracies]);

  useEffect(() => {
    localStorage.setItem('cdp_questionsSolvedToday', String(questionsSolvedToday));
  }, [questionsSolvedToday]);

  useEffect(() => {
    localStorage.setItem('cdp_completedRevisionToday', String(completedRevisionToday));
  }, [completedRevisionToday]);

  useEffect(() => {
    localStorage.setItem('cdp_completedMockToday', String(completedMockToday));
  }, [completedMockToday]);

  const examReadiness = Math.min(100, Math.max(10, Math.round(
    (accuracyRate * 0.5) +                               // 50% from accuracy rate
    (Math.min(12, streakDays) * 2.5) +                   // 30% from streak (max 30 pts)
    (Math.min(5, testAttemptsCount) * 4)                 // 20% from mock attempts (max 20)
  )));

  // Dynamic lowest accuracy topic for Weak Topic card
  const lowestAccuracyTopic = STUDY_TOPICS.reduce((min, topic) => {
    const acc = topicAccuracies[topic.id] ?? 70;
    const minAcc = topicAccuracies[min.id] ?? 70;
    return acc < minAcc ? topic : min;
  }, STUDY_TOPICS[0]);

  const lowestTopicCleanTitle = lowestAccuracyTopic.title.split('(')[1]?.replace(')', '') || lowestAccuracyTopic.title;

  // Weak Topic Engine: Filtering topics with accuracy < 60%
  const getWeakTopics = () => {
    return STUDY_TOPICS.filter(topic => {
      const acc = topicAccuracies[topic.id] ?? 70;
      return acc < 60;
    });
  };

  // General Quotes & Banner
  const [quoteIdx, setQuoteIdx] = useState(() => Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length));
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx(prev => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Expert Mentor: UPTET 2026 exam date announced - Target 25 Oct 2026. Keep revising!", time: "2 hours ago", read: false },
    { id: 2, text: "NEP 2020 MCQ sheet added inside your 'Important Acts' section.", time: "1 day ago", read: true },
    { id: 3, text: "Daily Mock MCQ tracker refreshed. Practice today's high-yield set to gain 50 XP!", time: "2 days ago", read: true }
  ]);

  // Search State for Study Hub
  const [searchQuery, setSearchQuery] = useState('');
  const [studyHubCategoryFilter, setStudyHubCategoryFilter] = useState<'all' | 'text_notes' | 'quick_revision' | 'revision_cards' | 'visual_summary' | 'exam_specific'>('all');
  const [expandedTopicId, setExpandedTopicId] = useState<number | null>(null);
  const [expandedChapterTab, setExpandedChapterTab] = useState<'summary' | 'notes' | 'points' | 'one_liners' | 'flashcards' | 'mindmap' | 'mcq' | 'test'>('summary');

  // Flashcards UI flipping state
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  // Chapter-specific MCQ Practice inside Study Hub Chapter Cards
  const [chapterMcqScore, setChapterMcqScore] = useState<number | null>(null);
  const [currentChapterMcqIdx, setCurrentChapterMcqIdx] = useState<number>(0);
  const [chapterMcqSelected, setChapterMcqSelected] = useState<number | null>(null);
  const [chapterMcqIncorrects, setChapterMcqIncorrects] = useState<number[]>([]);

  // Practice Zone states
  const [selectedPracticeCategory, setSelectedPracticeCategory] = useState<string | null>(null);
  const [selectedPracticeFilter, setSelectedPracticeFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [practiceQuestions, setPracticeQuestions] = useState<Question[]>([]);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState<number>(0);
  const [selectedPracticeAnswers, setSelectedPracticeAnswers] = useState<Record<number, number>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState<boolean>(false);
  const [showPracticeExplanation, setShowPracticeExplanation] = useState<boolean>(false);

  // Mock Test State
  const [mockStatus, setMockStatus] = useState<'config' | 'running' | 'analyzing'>('config');
  const [activeMockType, setActiveMockType] = useState<'daily' | 'full' | 'chapter' | 'subject' | 'pyq'>('daily');
  const [activeMockQuestions, setActiveMockQuestions] = useState<Question[]>([]);
  const [currentMockIndex, setCurrentMockIndex] = useState<number>(0);
  const [selectedMockAnswers, setSelectedMockAnswers] = useState<Record<number, number>>({});
  const [mockTimerRemaining, setMockTimerRemaining] = useState<number>(30); // in seconds
  const [mockTotalDuration, setMockTotalDuration] = useState<number>(30); // in seconds
  const mockTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Result Analysis state
  const [resultAnalysis, setResultAnalysis] = useState<{
    score: number;
    total: number;
    accuracy: number;
    timeTakenFormatted: string;
    weakTopics: string[];
    correctSplit: boolean[];
    showDetailedSolutions: boolean;
  } | null>(null);

  // Floating AI Doubt Solver Drawer State
  const [isDoubtDrawerOpen, setIsDoubtDrawerOpen] = useState<boolean>(false);
  const [doubtInput, setDoubtInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'model'; text: string; timestamp: Date }>>([
    {
      role: 'model',
      text: "👋 Namaste! Main hoon aapka CDP AI Doubts Solver. Koi bhi theory, full_mock exam, ya kanoon ke baare mein puchiye, Learning Guide ke syllabus ke mutabik turant uttar milega!",
      timestamp: new Date()
    }
  ]);
  const [isDoubtLoading, setIsDoubtLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Firestore sync and seeding states
  const [firebaseSyncStatus, setFirebaseSyncStatus] = useState<string>("Initializing...");
  const [isFirebaseSyncing, setIsFirebaseSyncing] = useState<boolean>(false);

  // Auto-seed Firestore if empty
  useEffect(() => {
    async function checkAndSeed() {
      setIsFirebaseSyncing(true);
      setFirebaseSyncStatus("🔍 Connecting with Cloud...");
      try {
        const { signInAnonymously } = await import('firebase/auth');
        const { auth } = await import('./firebase');
        await signInAnonymously(auth);

        const seeded = await isDatabaseSeeded();
        if (!seeded) {
          setFirebaseSyncStatus("🔄 Seeding CDP Database...");
          await seedFirestoreDatabase((msg) => setFirebaseSyncStatus(msg));
          setFirebaseSyncStatus("☁️ Sync Completed (Seeded)");
        } else {
          setFirebaseSyncStatus("☁️ Connected & Synchronized");
        }
      } catch (err: any) {
        console.warn("Firestore connection/seeding not complete yet:", err.message);
        setFirebaseSyncStatus("⚠️ Local Sandbox Mode Active");
      } finally {
        setTimeout(() => setIsFirebaseSyncing(false), 3000);
      }
    }
    checkAndSeed();
  }, []);

  // Back up user profiles and XP stats on Firestore on change
  useEffect(() => {
    async function backupUserProfile() {
      if (!currentUser || !currentUser.id) return;
      try {
        const userRef = doc(db, 'user_profiles', currentUser.id);
        await setDoc(userRef, {
          uid: currentUser.id,
          email: currentUser.email,
          fullName: currentUser.fullName || currentUser.name,
          mobile: currentUser.mobileNumber,
          targetExam: currentUser.targetExam,
          experiencePoints: currentUser.xp,
          createdAt: currentUser.joinedDate
        }, { merge: true });
      } catch (err) {
        // Silently catch fallback
      }
    }
    backupUserProfile();
  }, [currentUser]);

  // Auto-scroll AI doubt chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isDoubtLoading]);

  // Exam Countdown (Oct 25, 2026)
  const [countdownString, setCountdownString] = useState<string>('');
  useEffect(() => {
    const targetDate = new Date('2026-10-25T00:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      if (diff <= 0) {
        setCountdownString('Exam Day has Arrived!');
        clearInterval(interval);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setCountdownString(`${days} Days • ${hours} Hours • ${mins} Mins`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync Timer for Active Mock exam
  useEffect(() => {
    if (mockStatus === 'running' && mockTimerRemaining > 0) {
      mockTimerRef.current = setTimeout(() => {
        setMockTimerRemaining(prev => prev - 1);
      }, 1000);
    } else if (mockStatus === 'running' && mockTimerRemaining === 0) {
      if (activeMockType === 'daily') {
        // Auto-select option if none, then next question
        handleNextMockQuestion();
      } else {
        // Full mock timed out: submit entire test
        handleSubmitMockTest();
      }
    }
    return () => {
      if (mockTimerRef.current) clearTimeout(mockTimerRef.current);
    };
  }, [mockStatus, mockTimerRemaining]);

  // Helper to toggle bookmarks
  const toggleBookmarkId = (qId: number) => {
    setBookmarkedQuestions(prev => {
      const exists = prev.includes(qId);
      const updated = exists ? prev.filter(id => id !== qId) : [...prev, qId];
      if (!exists) {
        // Give small XP/Coins for bookmarking activity
        addRewardXP(5, 0);
      }
      return updated;
    });
  };

  // Helper to hand out coins/XP for gamification
  const addRewardXP = (amountXP: number, amountCoins: number) => {
    setCurrentUser(prev => {
      const nextXP = prev.xp + amountXP;
      const nextCoins = prev.coins + amountCoins;
      const originalBadges = [...prev.badges];
      
      // Check Badge rewards trigger
      if (nextXP >= 1000 && !originalBadges.includes("XP Warrior")) {
        originalBadges.push("XP Warrior");
        confetti({ particleCount: 80, colors: ['#ffd700', '#ff4500'] });
      }
      if (questionsSolvedCount >= 100 && !originalBadges.includes("100 Questions Solved")) {
        originalBadges.push("100 Questions Solved");
      }
      if (testAttemptsCount >= 5 && !originalBadges.includes("Mock Test Master")) {
        originalBadges.push("Mock Test Master");
      }

      return {
        ...prev,
        xp: nextXP,
        coins: nextCoins,
        badges: originalBadges
      };
    });
  };

  // Chat resolver fetch
  const handleSolveDoubt = async (overrideText?: string) => {
    const rawQuery = overrideText || doubtInput;
    if (!rawQuery.trim()) return;

    setDoubtInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: rawQuery, timestamp: new Date() }]);

    // Message limit validation block
    if (aiGuruMessageCount >= 10) {
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev, 
          { 
            role: 'model', 
            text: "आज की AI Guru limit पूरी हो गई है। अधिक सहायता के लिए Expert Mentor से संपर्क करें।", 
            timestamp: new Date() 
          }
        ]);
      }, 500);
      return;
    }

    setIsDoubtLoading(true);

    try {
      const res = await fetch('/api/doubt-solver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: rawQuery, topic: "General Pedagogy" })
      });
      if (!res.ok) throw new Error('API busy');
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'model', text: data.answer, timestamp: new Date() }]);
      
      // Increment query consumption counter
      setAiGuruMessageCount(prev => prev + 1);
      
      // Reward user with 5 XP for resolving doubt
      addRewardXP(5, 1);
    } catch (err) {
      const fallbackMsg = "Sorry, abhi server busy hai. Kripya 1 minute baad fir se koshish karein!";
      setChatMessages(prev => [...prev, { 
        role: 'model', 
        text: `⚠️ **त्रुटि:** ${fallbackMsg}`, 
        timestamp: new Date() 
      }]);
    } finally {
      setIsDoubtLoading(false);
    }
  };

  // Trigger Daily Mock Quiz (30s per question)
  const startDailyMockTest = () => {
    const questionsPool = get30Questions();
    const list = [...questionsPool].sort(() => 0.5 - Math.random()).slice(0, 30);
    setActiveMockQuestions(list);
    setCurrentMockIndex(0);
    setSelectedMockAnswers({});
    setActiveMockType('daily');
    setMockStatus('running');
    setMockTimerRemaining(30); // 30s for first question
    setMockTotalDuration(15 * 60); // 15 mins total
    setResultAnalysis(null);
  };

  // Trigger Full Mock Paper (150 mins)
  const startFullMockTest = () => {
    // 150 questions (or exact child development mock factor preloaded)
    // Add the specific Child development factor question from specifications
    const childDevSample: Question = {
      id: 5001,
      topicId: 2,
      questionText: "What is the primary factor of child development?",
      options: ["A) Heredity", "B) Environment", "C) Both A & B", "D) Schooling"],
      correctAnswer: 2, // "Both A & B" represents index 2
      explanation: "Child development is a joint product of both heredity and environment (Nature vs Nurture)."
    };
    
    const questionsPool = get30Questions();
    const shuffled = [...questionsPool].sort(() => 0.5 - Math.random());
    const list = [childDevSample, ...shuffled];
    
    setActiveMockQuestions(list);
    setCurrentMockIndex(0);
    setSelectedMockAnswers({});
    setActiveMockType('full');
    setMockStatus('running');
    setMockTimerRemaining(150 * 60); // 150 minutes!
    setMockTotalDuration(150 * 60);
    setResultAnalysis(null);
  };

  // Mock Question navigation
  const handleSelectMockOption = (optionIndex: number) => {
    setSelectedMockAnswers(prev => ({
      ...prev,
      [currentMockIndex]: optionIndex
    }));
  };

  const handleNextMockQuestion = () => {
    if (currentMockIndex < activeMockQuestions.length - 1) {
      setCurrentMockIndex(prev => prev + 1);
      // Reset timer to 30 seconds for next question if Daily quiz mode
      if (activeMockType === 'daily') {
        setMockTimerRemaining(30);
      }
    } else {
      handleSubmitMockTest();
    }
  };

  const handlePrevMockQuestion = () => {
    if (currentMockIndex > 0) {
      setCurrentMockIndex(prev => prev - 1);
    }
  };

  const handleSubmitMockTest = () => {
    if (mockTimerRef.current) clearTimeout(mockTimerRef.current);
    
    // Calculate results
    let correctNum = 0;
    const splitArr: boolean[] = [];
    const badTopics: string[] = [];

    activeMockQuestions.forEach((q, idx) => {
      const isCorrect = selectedMockAnswers[idx] === q.correctAnswer;
      splitArr.push(isCorrect);
      if (isCorrect) {
        correctNum++;
      } else {
        // Collect weak topics by matching topicId to STUDY_TOPICS
        const topicObj = STUDY_TOPICS.find(t => t.id === q.topicId);
        if (topicObj && !badTopics.includes(topicObj.title)) {
          badTopics.push(topicObj.title);
        }
      }
    });

    if (badTopics.length === 0) {
      badTopics.push("Perfect marks! No weak topics found.");
    }

    const calculatedAccuracy = activeMockQuestions.length > 0 
      ? Math.round((correctNum / activeMockQuestions.length) * 100) 
      : 0;

    const timeRemainingSecs = mockTimerRemaining;
    const timeSpentSecs = mockTotalDuration - timeRemainingSecs;
    const minutesSpent = Math.floor(timeSpentSecs / 60);
    const secondsSpent = timeSpentSecs % 60;
    const timeTakenFormattedStr = `${minutesSpent}m ${secondsSpent}s`;

    // Save states
    setQuestionsSolvedCount(prev => {
      const next = prev + activeMockQuestions.length;
      localStorage.setItem('cdp_questionsSolved', String(next));
      return next;
    });

    setTestAttemptsCount(prev => {
      const next = prev + 1;
      localStorage.setItem('cdp_testAttemptsCount', String(next));
      return next;
    });

    setCompletedMockToday(true);
    localStorage.setItem('cdp_completedMockToday', 'true');

    // Update global average accuracy Rate
    setAccuracyRate(prev => {
      const nextAcc = Math.round((prev * 0.7) + (calculatedAccuracy * 0.3));
      localStorage.setItem('cdp_accuracyRate', String(nextAcc));
      return nextAcc;
    });

    // Update granular topic accuracies (Weak < 60%)
    const updatedAccuracies = { ...topicAccuracies };
    activeMockQuestions.forEach((q, idx) => {
      if (q.topicId) {
        const isCorrect = selectedMockAnswers[idx] === q.correctAnswer;
        const currentAcc = updatedAccuracies[q.topicId] ?? 70;
        updatedAccuracies[q.topicId] = isCorrect 
          ? Math.min(100, currentAcc + 5)
          : Math.max(10, currentAcc - 6);
      }
    });
    setTopicAccuracies(updatedAccuracies);
    localStorage.setItem('cdp_topicAccuracies', JSON.stringify(updatedAccuracies));

    // Save current solved wrong questions
    const wrongList: number[] = [];
    activeMockQuestions.forEach((q, idx) => {
      if (selectedMockAnswers[idx] !== q.correctAnswer) {
        wrongList.push(q.id);
      }
    });
    setWrongQuestions(prev => {
      const nextMerged = Array.from(new Set([...prev, ...wrongList]));
      return nextMerged;
    });

    // Trigger fireworks/celebration
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

    // Calculate XP reward
    const earnedXP = correctNum * 12;
    const earnedCoins = Math.round(correctNum * 3);
    addRewardXP(earnedXP, earnedCoins);

    setResultAnalysis({
      score: correctNum,
      total: activeMockQuestions.length,
      accuracy: calculatedAccuracy,
      timeTakenFormatted: timeTakenFormattedStr,
      weakTopics: badTopics.slice(0, 3), // limit top 3 weak ones
      correctSplit: splitArr,
      showDetailedSolutions: true
    });

    setMockStatus('analyzing');
  };

  // Practice Zone Selection Trigger
  const startPracticeCategoryMCQ = (categoryTitle: string) => {
    setSelectedPracticeCategory(categoryTitle);
    
    // Map some questions
    let matchedId = 1;
    if (categoryTitle.includes("Development")) matchedId = 2;
    if (categoryTitle.includes("Pedagogy")) matchedId = 4;
    if (categoryTitle.includes("Inclusive")) matchedId = 2;// sample fallback
    if (categoryTitle.includes("Acts")) matchedId = STUDY_TOPICS[STUDY_TOPICS.length-1].id;

    const pool = MOCK_QUESTIONS.filter(q => q.topicId === matchedId || matchedId === 1);
    
    // Filter by difficulty in state
    setPracticeQuestions(pool);
    setCurrentPracticeIndex(0);
    setSelectedPracticeAnswers({});
    setPracticeSubmitted(false);
    setShowPracticeExplanation(false);
  };

  const handleSelectPracticeOption = (optionIdx: number) => {
    if (practiceSubmitted) return;
    setSelectedPracticeAnswers(prev => ({
      ...prev,
      [currentPracticeIndex]: optionIdx
    }));
  };

  const handlePracticeSubmit = () => {
    setPracticeSubmitted(true);
    setShowPracticeExplanation(true);
    
    const currentQuestion = practiceQuestions[currentPracticeIndex];
    if (!currentQuestion) return;
    const userAns = selectedPracticeAnswers[currentPracticeIndex];
    const isCorrect = userAns === currentQuestion.correctAnswer;

    // Track dynamic statistics
    setQuestionsSolvedCount(prev => {
      const next = prev + 1;
      localStorage.setItem('cdp_questionsSolved', String(next));
      return next;
    });

    setQuestionsSolvedToday(prev => {
      const next = prev + 1;
      localStorage.setItem('cdp_questionsSolvedToday', String(next));
      // Celebrate daily progress goals!
      if (next === 20) {
        confetti({ particleCount: 120, spread: 70, colors: ['#ff9800', '#10b981'] });
      }
      return next;
    });

    // Update Topic Accuracy dynamically for the Weak Topic Engine (Weak < 60%)
    if (currentQuestion.topicId) {
      setTopicAccuracies(prev => {
        const currentAcc = prev[currentQuestion.topicId] ?? 70;
        const netAcc = isCorrect 
          ? Math.min(100, currentAcc + 6) 
          : Math.max(10, currentAcc - 8);
        const updated = { ...prev, [currentQuestion.topicId]: netAcc };
        localStorage.setItem('cdp_topicAccuracies', JSON.stringify(updated));
        return updated;
      });
    }

    if (isCorrect) {
      addRewardXP(10, 2);
      confetti({ particleCount: 30, spread: 40 });
    } else {
      // Append strictly to Wrong Questions list
      if (!wrongQuestions.includes(currentQuestion.id)) {
        setWrongQuestions(prev => [...prev, currentQuestion.id]);
      }
    }
  };

  const handleNextPracticeQuestion = () => {
    if (currentPracticeIndex < practiceQuestions.length - 1) {
      setCurrentPracticeIndex(prev => prev + 1);
      setPracticeSubmitted(false);
      setShowPracticeExplanation(false);
    } else {
      // Finished practice set!
      alert("🎉 Practice Zone task completed!");
      setSelectedPracticeCategory(null);
    }
  };

  // Study Hub chapter search and filtering
  const filteredTopics = STUDY_TOPICS.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          topic.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (studyHubCategoryFilter === 'all') return matchesSearch;
    if (studyHubCategoryFilter === 'text_notes' && [1, 2, 3].includes(topic.id)) return matchesSearch;
    if (studyHubCategoryFilter === 'quick_revision' && [5, 6].includes(topic.id)) return matchesSearch;
    if (studyHubCategoryFilter === 'revision_cards' && topic.id === 9) return matchesSearch;
    if (studyHubCategoryFilter === 'visual_summary' && [4, 8].includes(topic.id)) return matchesSearch;
    if (studyHubCategoryFilter === 'exam_specific' && topic.id >= 10) return matchesSearch;
    return matchesSearch;
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen text-slate-100 flex items-center justify-center px-4 py-8 relative overflow-hidden" style={{ backgroundColor: "#081225" }}>
        
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md space-y-6 relative z-10 animate-fade-in">
          
          {/* Logo element */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-14 h-14 bg-gradient-to-tr from-orange-500 to-orange-600 rounded-2xl shadow-xl flex items-center justify-center text-white">
              <BrainCircuit className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">CDP Master</h1>
            <p className="text-slate-400 font-medium text-xs sm:text-sm">Learn Smarter. Score Higher. Crack CDP.</p>
          </div>

          {/* Feedback alerts */}
          {authError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{authError}</span>
            </div>
          )}
          {authSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* Card Frame */}
          <div className="bg-[#111B2E] border border-slate-800 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
            
            {/* LOGIN SCREEN */}
            {authScreen === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Email Address</label>
                  <input 
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="ak2225042@gmail.com"
                    autoComplete="off"
                    className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Password</label>
                  <input 
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                  <p className="text-[10px] text-slate-500 font-bold mt-1">Hint: Is standard profile ka password <code className="text-orange-400">password</code> hai.</p>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <button 
                    type="button"
                    onClick={() => { setAuthScreen('forgot_password'); setAuthError(null); setAuthSuccess(null); }}
                    className="text-xs text-orange-400 hover:underline font-bold transition-all cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setAuthScreen('signup'); setAuthError(null); setAuthSuccess(null); }}
                    className="text-xs text-slate-300 hover:text-white font-bold transition-all cursor-pointer"
                  >
                    Create Account
                  </button>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-orange-500/20"
                >
                  Log In
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="flex-shrink mx-3 text-[10px] text-slate-500 uppercase tracking-widest font-black">OR</span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-2.5 bg-[#081225] hover:bg-slate-950 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.49 3.77v3.12h4.01c2.34-2.16 3.69-5.33 3.69-8.74z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-4.01-3.12c-1.12.75-2.54 1.19-3.95 1.19-3.04 0-5.61-2.05-6.53-4.81H1.31v3.22A12 12 0 0 0 12 24z"/>
                    <path fill="#FBBC05" d="M5.47 14.35A7.17 7.17 0 0 1 5.09 12c0-.82.14-1.61.38-2.35V6.43H1.31A12 12 0 0 0 0 12c0 2.22.61 4.3 1.68 6.09l3.79-3.74z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43A11.93 11.93 0 0 0 12 0 12 12 0 0 0 1.31 6.43l4.16 3.22c.92-2.76 3.49-4.81 6.53-4.81z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </form>
            )}

            {/* SIGNUP SCREEN */}
            {authScreen === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Full Name</label>
                  <input 
                    type="text"
                    required
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                    placeholder="Aman Kumar"
                    className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Mobile Number</label>
                  <input 
                    type="tel"
                    required
                    value={signupMobile}
                    onChange={(e) => setSignupMobile(e.target.value)}
                    placeholder="7571051611"
                    className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Email Address</label>
                  <input 
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="ak2225042@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Password</label>
                    <input 
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 rounded-xl px-3 py-2.5 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Confirm</label>
                    <input 
                      type="password"
                      required
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 rounded-xl px-3 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Target Exam</label>
                  <select 
                    value={signupTargetExam}
                    onChange={(e: any) => setSignupTargetExam(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 rounded-xl px-3 py-2.5 text-xs text-orange-400 font-extrabold cursor-pointer"
                  >
                    <option value="UPTET" className="text-white font-bold bg-[#111B2E]">UPTET</option>
                    <option value="CTET" className="text-white font-bold bg-[#111B2E]">CTET</option>
                    <option value="STET" className="text-white font-bold bg-[#111B2E]">STET</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-orange-500/20"
                >
                  Sign Up
                </button>

                <div className="text-center pt-2">
                  <p className="text-xs text-slate-400">
                    Already have account?{' '}
                    <button 
                      type="button"
                      onClick={() => { setAuthScreen('login'); setAuthError(null); setAuthSuccess(null); }}
                      className="text-orange-400 font-bold hover:underline transition-colors cursor-pointer"
                    >
                      Login
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* FORGOT PASSWORD SCREEN */}
            {authScreen === 'forgot_password' && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Email Address</label>
                  <input 
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="ak2225042@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-orange-500/20"
                >
                  Reset Password
                </button>

                <div className="text-center pt-2">
                  <button 
                    type="button"
                    onClick={() => { setAuthScreen('login'); setAuthError(null); setAuthSuccess(null); }}
                    className="text-xs text-slate-400 hover:text-white font-bold transition-all flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                  >
                    ← Back to Login
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* Contact Support Section */}
          <div className="bg-[#111B2E] border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
            <div className="mx-auto w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-400">
              <MessageCircle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">Need Help & Guidance?</h4>
              <p className="text-[11px] text-slate-400 mt-1">We're here to support your preparation journey.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a 
                href="https://wa.me/917571051611" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] rounded-lg transition-colors cursor-pointer"
              >
                <span>WhatsApp Support</span>
              </a>
              <a 
                href="https://instagram.com/amn_0fficial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white font-extrabold text-[11px] rounded-lg transition-colors cursor-pointer"
              >
                <span>Instagram Community</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 flex flex-col pb-20 md:pb-0" style={{ backgroundColor: "#081225" }}>
      
      {/* Top Header */}
      <header className="sticky top-0 z-40" style={{ backgroundColor: "#111B2E", borderBottom: "1px solid #1e293b" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative p-2 bg-gradient-to-tr from-orange-500 to-orange-600 rounded-xl shadow-lg text-white">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-full uppercase">UPTET Target 2026</span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase" title={firebaseSyncStatus}>
                  {firebaseSyncStatus}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                CDP Master Pro <span className="text-orange-400 font-medium text-sm"></span>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center bg-[#081225] p-1 rounded-xl border border-slate-800 gap-1">
            <button 
              onClick={() => setActiveTab('home')} 
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === 'home' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              <Home className="w-4 h-4" /> Home
            </button>
            <button 
              onClick={() => setActiveTab('practice')} 
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === 'practice' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              <Target className="w-4 h-4" /> Practice
            </button>
            <button 
              onClick={() => setActiveTab('mock_test')} 
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === 'mock_test' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              <Medal className="w-4 h-4" /> Mock Test
            </button>
            <button 
              onClick={() => setActiveTab('study_hub')} 
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === 'study_hub' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              <Book className="w-4 h-4" /> Study Hub
            </button>
            <button 
              onClick={() => setActiveTab('profile')} 
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === 'profile' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              <User className="w-4 h-4" /> Profile
            </button>
          </nav>

          {/* User profile capsule */}
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-white">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 font-mono">ID: {currentUser.id}</p>
            </div>
            <div className="w-9 h-9 bg-gradient-to-tr from-orange-400 to-orange-600 rounded-full flex items-center justify-center font-black text-white shadow">
              {currentUser.name.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        
        {/* VIEWPORTS ROUTER */}

        {/* 1. HOME VIEWPORT */}
        {activeTab === 'home' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Motivation Marquee Banner */}
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-3 flex items-center gap-3 overflow-hidden">
               <Flame className="w-5 h-5 text-orange-500 animate-pulse flex-shrink-0" />
               <p className="text-orange-300 font-bold text-xs sm:text-sm animate-marquee whitespace-nowrap">
                  {MOTIVATIONAL_QUOTES[quoteIdx]}
               </p>
            </div>

            {/* Hero Card */}
            <div className="relative p-6 sm:p-10 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-gradient-to-br from-[#111B2E] to-slate-900">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 max-w-2xl">
                <span className="text-orange-400 font-bold text-xs uppercase tracking-widest block mb-2">Welcome Back, {currentUser.fullName || currentUser.displayName || currentUser.name || "Learner"} 👋</span>
                <h2 className="text-3xl sm:text-5xl font-black leading-tight text-white">
                  {currentUser.targetExam || "UPTET"} Target 2026
                </h2>
                <p className="text-orange-400 font-black text-sm mt-3 uppercase tracking-wider">
                  Today’s Study Plan
                </p>
                <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                  Continue your preparation journey with theory logs, PYQ practice, and instant AI coaching aligned with UPTET CDP.
                </p>
                <div className="flex flex-wrap gap-3.5 mt-6">
                  <button 
                    onClick={() => { setActiveTab('mock_test'); startDailyMockTest(); }} 
                    className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-lg transition-transform hover:scale-105 btn-3d flex items-center gap-1.5 cursor-pointer"
                  >
                    <Target className="w-4 h-4" /> Start Daily Challenge
                  </button>
                  <button 
                    onClick={() => setActiveTab('study_hub')} 
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Continue Learning
                  </button>
                </div>
              </div>
            </div>

            {/* Today's Progress Dashboard Grid Component */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
              <div className="bg-[#111B2E] border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Solved MCQs</span>
                <p className="text-2xl font-black text-white mt-1">{questionsSolvedCount}</p>
                <span className="text-[9px] text-emerald-400 font-bold mt-1.5 flex items-center gap-0.5">✓ Target: 100</span>
              </div>
              
              <div className="bg-[#111B2E] border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Avg Accuracy</span>
                <p className="text-2xl font-black text-white mt-1">{accuracyRate}%</p>
                <span className="text-[9px] text-blue-400 font-bold mt-1.5">Keep learning</span>
              </div>

              <div className="bg-[#111B2E] border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Daily Streak</span>
                <p className="text-2xl font-black text-orange-400 mt-1 flex items-center gap-1">
                  <Flame className="w-5 h-5 fill-orange-500 text-orange-400" /> {streakDays}
                </p>
                <span className="text-[9px] text-orange-300 font-bold mt-1.5">Days active</span>
              </div>

              <div className="bg-[#111B2E] border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Study Time</span>
                <p className="text-2xl font-black text-amber-400 mt-1">55 Mins</p>
                <span className="text-[9px] text-slate-505 font-bold mt-1.5">Today's logs</span>
              </div>

              <div className="col-span-2 md:col-span-1 bg-[#111B2E] border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Weak Topic</span>
                <p className="text-[13px] font-bold text-rose-400 mt-1 text-ellipsis overflow-hidden line-clamp-1" title={lowestTopicCleanTitle}>{lowestTopicCleanTitle}</p>
                <span className="text-[9px] text-[tomato] font-bold mt-1.5">Practice to fix</span>
              </div>
            </div>

            {/* EXAM READINESS & SMART STUDY PLAN ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Exam Readiness Meter */}
              <div className="bg-[#111B2E] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden shadow-xl">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
                 
                 <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                    <h3 className="font-black text-white text-sm flex items-center gap-2">
                       <Award className="w-5 h-5 text-orange-400" /> Exam Readiness Score
                    </h3>
                    <span className="bg-orange-500/10 px-2 py-0.5 border border-orange-500/20 text-orange-400 text-[9px] font-bold font-mono tracking-wider rounded uppercase">
                       LIVE ANALYSIS
                    </span>
                 </div>

                 <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
                    {/* Radial Progress Gauge */}
                    <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                       <svg className="w-full h-full transform -rotate-90">
                          <circle
                             cx="56"
                             cy="56"
                             r="46"
                             className="stroke-slate-900"
                             strokeWidth="8"
                             fill="transparent"
                          />
                          <circle
                             cx="56"
                             cy="56"
                             r="46"
                             className="stroke-orange-500 transition-all duration-1000 ease-out"
                             strokeWidth="8"
                             strokeDasharray={2 * Math.PI * 46}
                             strokeDashoffset={2 * Math.PI * 46 * (1 - examReadiness / 100)}
                             strokeLinecap="round"
                             fill="transparent"
                          />
                       </svg>
                       <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-2xl font-black text-white">{examReadiness}%</span>
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Ready</span>
                       </div>
                    </div>

                    {/* Readiness text, level and advice */}
                    <div className="flex-grow space-y-2 text-center sm:text-left">
                       <div className="flex items-center justify-center sm:justify-start gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${
                             examReadiness < 60 ? 'bg-rose-500' : examReadiness < 80 ? 'bg-amber-400' : 'bg-emerald-500'
                          }`} />
                          <span className="text-xs font-black uppercase tracking-widest text-slate-300">
                             {examReadiness < 60 ? 'Needs Attention' : examReadiness < 80 ? 'Steady Progress' : 'Excellent Standard'}
                          </span>
                       </div>
                       
                       <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                          {examReadiness < 60 
                            ? "Aman, focus on completing the key psycho-pedagogy chapters. Solved questions accuracy and streak multiplier are currently at primary tier."
                            : examReadiness < 80
                            ? "Aapki taiyyari achhi direction mein hai! To score above 130 marks, practice Piaget/Vygotsky stages and keep your streak multiplier alive!"
                            : "Excellent work, mentor! Your accuracy, daily log consistency, and test mock performance placing you in top 5% rank zone."
                          }
                       </p>

                       <p className="text-[10px] text-orange-400 font-mono font-bold leading-relaxed bg-orange-950/20 px-2.5 py-1.5 rounded-lg border border-orange-500/10 flex items-center gap-1.5 justify-center sm:justify-start">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
                          <span>Mentor Tip: {MOTIVATIONAL_QUOTES[quoteIdx]}</span>
                       </p>
                    </div>
                 </div>
              </div>

              {/* Smart Study Plan tasks checklist */}
              <div className="bg-[#111B2E] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden shadow-xl">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

                 <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                    <h3 className="font-black text-white text-sm flex items-center gap-2">
                       <Compass className="w-5 h-5 text-orange-400" /> Aaj Kya Padhna Hai?
                    </h3>
                    <div className="flex items-center gap-1 bg-[#081225] px-2.5 py-0.5 border border-slate-800 rounded font-bold font-mono text-[9px] text-slate-400">
                       <span>TODAY'S TARGETS</span>
                    </div>
                 </div>

                 {/* Study checklist items */}
                 <div className="space-y-3">
                    
                    {/* Task 1: 20 MCQs on Weak Topic */}
                    <div className="p-2.5 bg-[#081225] border border-slate-800 rounded-xl flex items-center justify-between gap-3">
                       <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-xs ${
                             questionsSolvedToday >= 20 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'text-slate-500'
                          }`}>
                             {questionsSolvedToday >= 20 ? '✓' : '1'}
                          </div>
                          <div>
                             <p className={`text-xs font-bold ${questionsSolvedToday >= 20 ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                                Solve 20 MCQs (Weak: {lowestTopicCleanTitle})
                             </p>
                             <p className="text-[10px] text-slate-500 mt-0.5">
                                Progress: {questionsSolvedToday}/20 solved in active practice session
                             </p>
                          </div>
                       </div>
                       <button 
                         onClick={() => {
                            setActiveTab('practice');
                            const cleanTitle = lowestAccuracyTopic.title.split('(')[1]?.replace(')', '') || lowestAccuracyTopic.title;
                            startPracticeCategoryMCQ(cleanTitle);
                         }}
                         className="px-2.5 py-1 bg-orange-600/10 hover:bg-orange-600 text-orange-400 hover:text-white border border-orange-500/20 text-[10px] font-bold rounded-lg transition-colors flex-shrink-0"
                       >
                          Practice
                       </button>
                    </div>

                    {/* Task 2: Smart Revision */}
                    <div className="p-2.5 bg-[#081225] border border-slate-800 rounded-xl flex items-center justify-between gap-3">
                       <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-xs ${
                             completedRevisionToday ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'text-slate-500'
                          }`}>
                             {completedRevisionToday ? '✓' : '2'}
                          </div>
                          <div>
                             <p className={`text-xs font-bold ${completedRevisionToday ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                                Complete 1 smart revision
                             </p>
                             <p className="text-[10px] text-slate-500 mt-0.5">
                                Expand any chapter's theory notes in Study Hub
                             </p>
                          </div>
                       </div>
                       <button 
                         onClick={() => {
                            setActiveTab('study_hub');
                         }}
                         className="px-2.5 py-1 bg-orange-600/10 hover:bg-orange-600 text-orange-400 hover:text-white border border-orange-500/20 text-[10px] font-bold rounded-lg transition-colors flex-shrink-0"
                       >
                          Revise Hub
                       </button>
                    </div>

                    {/* Task 3: Daily Mock test */}
                    <div className="p-2.5 bg-[#081225] border border-slate-800 rounded-xl flex items-center justify-between gap-3">
                       <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-xs ${
                             completedMockToday ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'text-slate-500'
                          }`}>
                             {completedMockToday ? '✓' : '3'}
                          </div>
                          <div>
                             <p className={`text-xs font-bold ${completedMockToday ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                                Complete 1 daily mock test
                             </p>
                             <p className="text-[10px] text-slate-500 mt-0.5">
                                Take the 30 question high-yield active exam set
                             </p>
                          </div>
                       </div>
                       <button 
                         onClick={() => {
                            setActiveTab('mock_test');
                            startDailyMockTest();
                         }}
                         className="px-2.5 py-1 bg-orange-600/10 hover:bg-orange-600 text-orange-400 hover:text-white border border-orange-500/20 text-[10px] font-bold rounded-lg transition-colors flex-shrink-0"
                       >
                          Quiz
                       </button>
                    </div>

                 </div>
              </div>

            </div>

            {/* Quick Actions Panel */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">⚡ Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                
                <div className="bg-[#111B2E] border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-orange-500/40 transition-all">
                  <div>
                    <h4 className="font-extrabold text-white text-sm">Daily Quiz</h4>
                    <p className="text-xs text-slate-400 mt-1">30 random questions from syllabus</p>
                  </div>
                  <button 
                    onClick={() => { setActiveTab('mock_test'); startDailyMockTest(); }}
                    className="mt-4 w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-705 text-xs text-orange-400 font-bold py-2 rounded-lg text-center"
                  >
                    Start Quiz
                  </button>
                </div>

                <div className="bg-[#111B2E] border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-blue-500/40 transition-all">
                  <div>
                    <h4 className="font-extrabold text-white text-sm">Topic Practice</h4>
                    <p className="text-xs text-slate-400 mt-1">Chapter-wise MCQ practice</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('practice')}
                    className="mt-4 w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-705 text-xs text-blue-400 font-bold py-2 rounded-lg text-center"
                  >
                    Practice Now
                  </button>
                </div>

                <div className="bg-[#111B2E] border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-rose-500/40 transition-all">
                  <div>
                    <h4 className="font-extrabold text-white text-sm">Wrong Questions</h4>
                    <p className="text-xs text-slate-400 mt-1">गलत सवालों की revision & clear</p>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveTab('practice');
                      setSelectedPracticeCategory("Wrong Questions Archive");
                      // Load all questions from wrong list
                      const pool = MOCK_QUESTIONS.filter(q => wrongQuestions.includes(q.id));
                      setPracticeQuestions(pool.length > 0 ? pool : MOCK_QUESTIONS.slice(0, 5));
                      setCurrentPracticeIndex(0);
                      setSelectedPracticeAnswers({});
                      setPracticeSubmitted(false);
                    }}
                    className="mt-4 w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-705 text-xs text-rose-450 font-bold py-2 rounded-lg text-center"
                  >
                    Revise ({wrongQuestions.length})
                  </button>
                </div>

                <div className="bg-[#111B2E] border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-yellow-500/40 transition-all">
                  <div>
                    <h4 className="font-extrabold text-white text-sm">Flashcards</h4>
                    <p className="text-xs text-slate-400 mt-1">Fast definition memories & acts</p>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveTab('study_hub');
                      setStudyHubCategoryFilter('revision_cards');
                    }}
                    className="mt-4 w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-705 text-xs text-yellow-400 font-bold py-2 rounded-lg text-center"
                  >
                    Open
                  </button>
                </div>

              </div>
            </div>

            {/* Exam Countdown, Continue, leader, notify components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
              
              {/* Left Column: Exam Countdown, Continue study & notifications */}
              <div className="space-y-6">
                
                {/* Exam Countdown Card */}
                <div className="bg-[#111B2E] border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-white text-sm">UPTET Target Exam 2026</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Syllabus Deadlines & Goals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-400 text-xs font-mono font-bold tracking-widest uppercase mb-1">Countdown</p>
                    <p className="text-sm font-black text-white bg-[#081225] px-3 py-1 border border-slate-800 rounded-lg">{countdownString}</p>
                  </div>
                </div>

                {/* Continue Learning Capsule */}
                <div className="bg-[#111B2E] border border-slate-800 p-5 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                     <h4 className="font-black text-white text-sm">📖 Continue Learning</h4>
                     <span className="text-[10px] text-blue-400 font-bold">Chapter 1 Active</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                     Aapne "Intro to Psychology" notes padhna shuru kiya tha. Learning Guide ki pedagogic trick yaad karke revision test clear karein!
                  </p>
                  <button 
                    onClick={() => {
                      setActiveTab('study_hub');
                      setExpandedTopicId(1);
                    }}
                    className="w-full bg-[#081225] hover:bg-slate-900 border border-slate-800 text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 text-slate-300"
                  >
                     Check Notes Layout & Mind Map <ChevronRight className="w-4 h-4 text-orange-400" />
                  </button>
                </div>

                {/* Expert Mentor Important Notifications Feed */}
                <div className="bg-[#111B2E] border border-slate-800 p-5 rounded-2xl space-y-3">
                  <h4 className="font-black text-white text-sm flex items-center gap-2">
                    <Bell className="w-4 h-4 text-orange-400" /> Urgent Alerts & Bulletin (Expert Mentor)
                  </h4>
                  <div className="space-y-2.5">
                    {notifications.map(n => (
                      <div key={n.id} className="p-3 bg-[#081225] rounded-xl border border-slate-800 flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? 'bg-slate-600' : 'bg-orange-500 animate-ping'}`} />
                        <div>
                          <p className="text-xs text-slate-300 leading-relaxed">{n.text}</p>
                          <span className="text-[10px] text-slate-500 mt-1 block font-mono">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Weak Topics & Gamification Leaderboard */}
              <div className="space-y-6">
                
                {/* Weak Topics Analysis tracker */}
                <div className="bg-[#111B2E] border border-slate-800 p-5 rounded-2xl space-y-3">
                  <h4 className="font-black text-white text-sm flex items-center justify-between">
                     <span>🛑 Weak Topics Radar (Lower Accuracy)</span>
                     <span className="text-[10px] text-slate-505">Based on Mock analytics</span>
                  </h4>
                   <div className="space-y-2.5">
                     {getWeakTopics().length > 0 ? (
                        getWeakTopics().map(topic => {
                           const acc = topicAccuracies[topic.id] ?? 50;
                           const cleanName = topic.title.split('(')[1]?.replace(')', '') || topic.title;
                           
                           return (
                              <div key={topic.id} className="p-3 bg-[#081225] rounded-xl border border-slate-800 flex items-center justify-between">
                                 <div>
                                    <p className="text-xs text-slate-200 font-bold">{cleanName}</p>
                                    <p className="text-[10px] text-rose-400 mt-0.5">Accuracy: {acc}% (Need practice)</p>
                                 </div>
                                 <button 
                                   onClick={() => {
                                      setActiveTab('practice');
                                      startPracticeCategoryMCQ(cleanName);
                                   }}
                                   className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-[10px] font-bold rounded-lg transition-all"
                                 >
                                    Strengthen
                                 </button>
                              </div>
                           );
                        })
                     ) : (
                        <div className="p-4 bg-emerald-500/5 border border-dashed border-emerald-500/10 text-center rounded-xl">
                           <p className="text-xs text-emerald-400 font-bold">🎉 Ultimate Consistency! All syllabus modules are above 60% standard.</p>
                        </div>
                     )}
                   </div>
                </div>

                {/* Global Gamified Leaderboard */}
                <div className="bg-[#111B2E] border border-slate-800 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <h4 className="font-black text-white text-sm flex items-center gap-1.5">
                      <Medal className="w-5 h-5 text-yellow-400" /> Live Quiz Leaderboard
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Aman Kumar is #2</span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2.5 bg-[#081225] rounded-xl border border-amber-500/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-amber-400">#1</span>
                        <div className="w-7 h-7 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg flex items-center justify-center text-xs font-bold">🏆</div>
                        <div>
                          <p className="text-xs font-bold text-white">Sachin Meena</p>
                          <p className="text-[10px] text-slate-400">Score: 148/150 • 98 mins</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-300">🪙 950</span>
                    </div>

                    <div className="p-2.5 bg-orange-500/10 rounded-xl border border-orange-500/20 flex items-center justify-between animate-pulse">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-orange-400">#2</span>
                        <div className="w-7 h-7 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center text-xs font-black">A</div>
                        <div>
                          <p className="text-xs font-black text-orange-400">Aman Kumar (You)</p>
                          <p className="text-[10px] text-slate-400">Score: 142/150 • 110 mins</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-orange-400">🪙 820</span>
                    </div>

                    <div className="p-2.5 bg-[#081225] rounded-xl border border-slate-800 flex items-center justify-between text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold">#3</span>
                        <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center text-xs font-bold">S</div>
                        <div>
                          <p className="text-xs font-bold text-slate-303">Shweta Dixit</p>
                          <p className="text-[10px] text-slate-500">Score: 139/150 • 115 mins</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-500">🪙 710</span>
                    </div>

                    <div className="p-2.5 bg-[#081225] rounded-xl border border-slate-800 flex items-center justify-between text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold">#4</span>
                        <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center text-xs font-bold">R</div>
                        <div>
                          <p className="text-xs font-bold text-slate-303">Rohit Shakya</p>
                          <p className="text-[10px] text-slate-505">Score: 135/150 • 120 mins</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-500">🪙 690</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* 2. PRACTICE PORTAL VIEWPORT */}
        {activeTab === 'practice' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Header Title bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                  <Target className="text-orange-500 w-7 h-7" /> Practice Zone
                </h2>
                <p className="text-sm text-slate-400">Topic wise question training with customizable parameters</p>
              </div>

              {/* Realtime filters & statistics */}
              <div className="flex items-center gap-2">
                 <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Difficulty Filter:</span>
                 <select 
                   value={selectedPracticeFilter} 
                   onChange={(e: any) => setSelectedPracticeFilter(e.target.value)}
                   className="bg-[#111B2E] border border-slate-800 text-slate-250 text-xs font-bold px-3 py-1.5 rounded-lg focus:outline-none"
                 >
                    <option value="All">All Levels</option>
                    <option value="Easy">Easy Level</option>
                    <option value="Medium">Medium Level</option>
                    <option value="Hard">Hard Level</option>
                 </select>
              </div>
            </div>

            {/* Categorized Practice Hub */}
            {!selectedPracticeCategory ? (
              <div className="space-y-6">
                
                {/* Bookmarks, Wrong list and chaptermcqs shortcuts */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#111B2E] border border-slate-800 p-5 rounded-xl hover:border-orange-500/30 transition-all flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-white text-base">Bookmarked (Bookmarks)</h4>
                      <p className="text-xs text-slate-400 mt-1 font-mono">{bookmarkedQuestions.length} Questions Saved</p>
                    </div>
                    <button 
                      onClick={() => {
                        if (bookmarkedQuestions.length === 0) {
                          alert("Aapne abhi koi bookmarks nahi add kiye hain!");
                          return;
                        }
                        setSelectedPracticeCategory("My Saved Bookmarks");
                        const pool = MOCK_QUESTIONS.filter(q => bookmarkedQuestions.includes(q.id));
                        setPracticeQuestions(pool);
                        setCurrentPracticeIndex(0);
                        setSelectedPracticeAnswers({});
                        setPracticeSubmitted(false);
                      }}
                      className="px-3 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg transition-transform hover:scale-105"
                    >
                      Practice
                    </button>
                  </div>

                  <div className="bg-[#111B2E] border border-slate-800 p-5 rounded-xl hover:border-rose-500/30 transition-all flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-white text-base">Wrong Questions Revision</h4>
                      <p className="text-xs text-slate-400 mt-1 font-mono">{wrongQuestions.length} Incorrect Attempts</p>
                    </div>
                    <button 
                      onClick={() => {
                        if (wrongQuestions.length === 0) {
                          alert("Very clean! Solved list contains zero incorrect records.");
                          return;
                        }
                        setSelectedPracticeCategory("Wrong Questions Archive");
                        const pool = MOCK_QUESTIONS.filter(q => wrongQuestions.includes(q.id));
                        setPracticeQuestions(pool);
                        setCurrentPracticeIndex(0);
                        setSelectedPracticeAnswers({});
                        setPracticeSubmitted(false);
                      }}
                      className="px-3 py-2 bg-rose-600 hover:bg-rose-505 text-white text-xs font-bold rounded-lg transition-transform hover:scale-105"
                    >
                      Revise All
                    </button>
                  </div>

                  <div className="bg-[#111B2E] border border-slate-800 p-5 rounded-xl hover:border-blue-500/30 transition-all flex items-center justify-between">
                     <div>
                       <h4 className="font-black text-white text-base">Timed Practice Mode</h4>
                       <p className="text-xs text-slate-400 mt-1">Timed countdown questions</p>
                     </div>
                     <button 
                       onClick={() => {
                         setSelectedPracticeCategory("Timed Rapid Challenge");
                         setPracticeQuestions(MOCK_QUESTIONS.slice(0, 15));
                         setCurrentPracticeIndex(0);
                         setSelectedPracticeAnswers({});
                         setPracticeSubmitted(false);
                       }}
                       className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-transform hover:scale-105"
                     >
                       Begin
                     </button>
                  </div>
                </div>

                {/* Primary syllabus topics list */}
                <h3 className="text-sm font-black text-slate-405 uppercase tracking-widest mt-6">📖 Syllabus Category Modules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: "c1", title: "Child Development", desc: "शारीरिक, मानसिक, संवेदी और सामाजिक विकास की अवधारणा।", type: "topic_wise_mcq" },
                    { id: "c2", title: "Learning & Pedagogy", desc: "अधिगम का अर्थ, थार्नडाइक, पावलव और स्किनर के नियम।", type: "topic_wise_mcq" },
                    { id: "c3", title: "Inclusive Education", desc: "समावेशी समाज and विशिष्ट बालकों की आवश्यकताएं।", type: "topic_wise_mcq" },
                    { id: "c4", title: "Assessment & Evaluation", desc: "मूल्यांकन, सतत एवं व्यापक मूल्यांकन (CCE) संप्रत्यय।", type: "topic_wise_mcq" },
                    { id: "c5", title: "RTE / NEP / NCF", desc: "शिक्षा का अधिकार कानून 2009, NEP 2020 रणनीतियाँ।", type: "important_acts" },
                    { id: "c6", title: "Previous Year Questions", desc: "UPTET Exams (2018-2024) High-yield MCQs.", type: "pyq" }
                  ].map(cat => (
                    <div key={cat.id} className="bg-[#111B2E] border border-slate-800 p-5 rounded-xl flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                           <h4 className="font-black text-white text-lg">{cat.title}</h4>
                           <span className="bg-slate-950 px-2 py-0.5 border border-slate-800 text-slate-400 rounded text-[9px] font-bold font-mono tracking-wider uppercase">
                              {cat.type}
                           </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{cat.desc}</p>
                      </div>
                      <button 
                        onClick={() => startPracticeCategoryMCQ(cat.title)}
                        className="px-4 py-2 bg-[#081225] hover:bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-bold text-orange-400 rounded-lg transition-colors flex-shrink-0"
                      >
                         Practice Now
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              // Active Practice MCQ viewport
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#111B2E] border border-slate-800 rounded-2xl p-6 shadow-xl max-w-3xl mx-auto space-y-6"
              >
                {/* Header detail */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                   <div>
                      <p className="text-xs text-orange-400 font-bold tracking-widest uppercase">Active Zone: {selectedPracticeCategory}</p>
                      <h3 className="font-extrabold text-white text-lg mt-1">
                         Question {currentPracticeIndex + 1} of {practiceQuestions.length}
                      </h3>
                   </div>
                   <button 
                     onClick={() => setSelectedPracticeCategory(null)}
                     className="px-3 py-1.5 bg-[#081225] hover:bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold rounded-lg"
                   >
                     Exit Practice
                   </button>
                </div>

                {/* Main Question Display */}
                {practiceQuestions.length > 0 ? (
                  <div className="space-y-5">
                    <div className="bg-[#081225] p-5 rounded-xl border border-slate-800 text-white font-extrabold text-base sm:text-lg leading-relaxed relative">
                       {practiceQuestions[currentPracticeIndex].questionText}
                       {/* Bookmark trigger */}
                       <button 
                         onClick={() => toggleBookmarkId(practiceQuestions[currentPracticeIndex].id)}
                         className="absolute top-4 right-4 text-slate-400 hover:text-yellow-400 transition-colors"
                       >
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${bookmarkedQuestions.includes(practiceQuestions[currentPracticeIndex].id) ? 'fill-yellow-400 text-yellow-500' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.371 1.24.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.17 0l-3.972 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.97-2.883c-.783-.57-.372-1.81.587-1.81h4.91a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                       </button>
                    </div>

                    {/* Options list */}
                    <div className="space-y-2.5">
                      {practiceQuestions[currentPracticeIndex].options.map((option, oIdx) => {
                         const isSelected = selectedPracticeAnswers[currentPracticeIndex] === oIdx;
                         const isCorrectAns = oIdx === practiceQuestions[currentPracticeIndex].correctAnswer;
                         
                         let optionStyle = "border-slate-805 bg-[#081225] hover:bg-slate-900 text-slate-200";
                         if (isSelected && !practiceSubmitted) {
                           optionStyle = "border-orange-500 bg-orange-500/10 text-orange-300";
                         } else if (practiceSubmitted) {
                           if (isCorrectAns) {
                             optionStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-extrabold";
                           } else if (isSelected) {
                             optionStyle = "border-rose-500 bg-rose-500/20 text-rose-305";
                           }
                         }

                         return (
                           <button 
                             key={oIdx}
                             onClick={() => handleSelectPracticeOption(oIdx)}
                             className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all ${optionStyle}`}
                           >
                             {option}
                           </button>
                         );
                      })}
                    </div>

                    {/* Submit or actions footer */}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                       <div>
                          {practiceSubmitted && (
                             <span className={`text-xs font-extrabold ${selectedPracticeAnswers[currentPracticeIndex] === practiceQuestions[currentPracticeIndex].correctAnswer ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {selectedPracticeAnswers[currentPracticeIndex] === practiceQuestions[currentPracticeIndex].correctAnswer ? "✓ Correct Answer!" : "✗ Incorrect, Try Next!"}
                             </span>
                          )}
                       </div>
                       
                       <div className="flex gap-2">
                         {!practiceSubmitted ? (
                           <button 
                             onClick={handlePracticeSubmit}
                             disabled={selectedPracticeAnswers[currentPracticeIndex] === undefined}
                             className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow btn-3d"
                           >
                              Submit Answer
                           </button>
                         ) : (
                           <button 
                             onClick={handleNextPracticeQuestion}
                             className="px-6 py-2.5 bg-blue-600 hover:bg-blue-505 text-white font-bold text-xs rounded-lg shadow btn-3d"
                           >
                              {currentPracticeIndex === practiceQuestions.length - 1 ? 'Finish Set' : 'Next Question'}
                           </button>
                         )}
                       </div>
                    </div>

                    {/* Dynamic Explanation widget */}
                    {showPracticeExplanation && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 mt-4"
                      >
                         <p className="text-xs font-bold text-orange-400">💡 Explanation / व्याख्या:</p>
                         <p className="text-xs text-slate-300 leading-relaxed font-medium">
                            {practiceQuestions[currentPracticeIndex].explanation}
                         </p>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <p className="text-center text-slate-404 py-10">No questions available in this filter range.</p>
                )}

              </motion.div>
            )}
          </motion.div>
        )}

        {/* 3. MOCK TEST VIEWPORT */}
        {activeTab === 'mock_test' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Upper Config Layout */}
            {mockStatus === 'config' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                    <Medal className="text-orange-500 w-7 h-7" /> Mock Test Arena
                  </h2>
                  <p className="text-sm text-slate-400">Authentic computer-based simulated exam environments for UPTET 2026</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Daily Mock quiz detailed module */}
                  <div className="bg-[#111B2E] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4">
                     <div>
                        <div className="flex items-center justify-between">
                           <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[9px] font-black px-2 py-0.5 rounded uppercase">Featured</span>
                           <span className="text-xs text-slate-500 font-mono">30 Questions</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mt-2.5">Daily Test Series</h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                           A rapid mock containing 30 questions. Each question is strictly fitted with a live 30-seconds auto-submit timer to build speed under stress.
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mt-4 text-slate-400">
                           <div>🕒 Duration: 15 Mins</div>
                           <div>🎯 Target: 85%+ Accuracy</div>
                           <div>⚡ Difficulty: Mixed</div>
                           <div>🪙 Reward: 150+ Coins</div>
                        </div>
                     </div>
                     <button 
                       onClick={startDailyMockTest}
                       className="w-full py-3 bg-orange-600 hover:bg-orange-550 text-white font-bold text-xs rounded-xl shadow btn-3d"
                     >
                        🔑 Start Daily Mock Quiz
                     </button>
                  </div>

                  {/* Full Mock Test Detailed box with standard child development exact matching factors */}
                  <div className="bg-[#111B2E] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4">
                     <div>
                        <div className="flex items-center justify-between">
                           <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[9px] font-black px-2 py-0.5 rounded uppercase">Full Syllabus Paper</span>
                           <span className="text-xs text-slate-500 font-mono">150 Questions</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mt-2.5">Full Mock Test #1</h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                           Syllabus-structured complete mock test matching the actual UPTET parameters. Contains comprehensive development, inclusive acts, and pedagogical models.
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mt-4 text-slate-400">
                           <div>🕒 Time: 150 Mins</div>
                           <div>🎟️ Max Marks: 150 Marks</div>
                           <div>🔒 Mode: Timed exam controls</div>
                           <div>👑 Reward: 500+ Coins</div>
                        </div>
                     </div>
                     <button 
                       onClick={startFullMockTest}
                       className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow btn-3d"
                     >
                        🔥 Start 150-Min Full Mock Test
                     </button>
                  </div>

                </div>

                {/* Other test types grids requested */}
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mt-6">🎓 Explore Alternate Test Formats</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                   <div className="p-4 bg-[#111B2E] border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                      <h4 className="font-extrabold text-white text-sm">Chapter Test</h4>
                      <p className="text-[11px] text-slate-405 mt-1">Single chapter focus test sets with customized limits.</p>
                      <button 
                        onClick={() => {
                          setActiveMockQuestions(MOCK_QUESTIONS.slice(0, 10));
                          setCurrentMockIndex(0);
                          setSelectedMockAnswers({});
                          setActiveMockType('chapter');
                          setMockStatus('running');
                          setMockTimerRemaining(15 * 60);
                          setMockTotalDuration(15 * 60);
                        }}
                        className="mt-3 text-xs font-bold text-orange-400 flex items-center gap-1 hover:underline"
                      >
                         Configure <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                   </div>

                   <div className="p-4 bg-[#111B2E] border border-slate-800 rounded-xl hover:border-slate-705 transition-colors">
                      <h4 className="font-extrabold text-white text-sm">Subject Test</h4>
                      <p className="text-[11px] text-slate-405 mt-1">Multi-chapter combined syllabus CDP mocks.</p>
                      <button 
                        onClick={() => {
                          setActiveMockQuestions(MOCK_QUESTIONS.slice(0, 20));
                          setCurrentMockIndex(0);
                          setSelectedMockAnswers({});
                          setActiveMockType('subject');
                          setMockStatus('running');
                          setMockTimerRemaining(30 * 60);
                          setMockTotalDuration(30 * 60);
                        }}
                        className="mt-3 text-xs font-bold text-orange-400 flex items-center gap-1 hover:underline"
                      >
                         Configure <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                   </div>

                   <div className="p-4 bg-[#111B2E] border border-slate-800 rounded-xl hover:border-slate-705 transition-colors">
                      <h4 className="font-extrabold text-white text-sm">PYQ Test</h4>
                      <p className="text-[11px] text-slate-405 mt-1">Previous years full exams timed sheets.</p>
                      <button 
                        onClick={() => {
                          setActiveMockQuestions(MOCK_QUESTIONS.slice(15, 30));
                          setCurrentMockIndex(0);
                          setSelectedMockAnswers({});
                          setActiveMockType('pyq');
                          setMockStatus('running');
                          setMockTimerRemaining(25 * 60);
                          setMockTotalDuration(25 * 60);
                        }}
                        className="mt-3 text-xs font-bold text-orange-400 flex items-center gap-1 hover:underline"
                      >
                         Configure <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                   </div>
                </div>
              </div>
            )}

            {/* Simulated Live Exam Session Interface */}
            {mockStatus === 'running' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#111B2E] border border-slate-800 rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto space-y-6"
              >
                 {/* Top Panel bar */}
                 <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                       <span className="bg-orange-600 text-white font-mono font-bold text-[9px] px-2 py-0.5 rounded tracking-widest uppercase">
                          {activeMockType === 'daily' ? 'Daily MCQ Challenge' : 'Full Exam Mode'}
                       </span>
                       <h3 className="font-extrabold text-white text-lg mt-1">
                          Question {currentMockIndex + 1} of {activeMockQuestions.length}
                       </h3>
                    </div>

                    {/* Circular standard timer */}
                    <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 border border-slate-805 rounded-2xl">
                       <Clock className="w-4 h-4 text-orange-400 animate-spin-slow" />
                       <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Timer</p>
                          <p className="text-sm font-mono font-black text-white">
                             {Math.floor(mockTimerRemaining / 60)}:{(mockTimerRemaining % 60).toString().padStart(2, '0')}
                          </p>
                       </div>
                    </div>
                 </div>

                 {/* Question Block */}
                 {activeMockQuestions.length > 0 ? (
                   <div className="space-y-6">
                      <div className="bg-[#081225] p-5 rounded-2xl border border-slate-800 text-white font-extrabold text-base sm:text-lg leading-relaxed relative">
                         {activeMockQuestions[currentMockIndex].questionText}
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 gap-2.5">
                         {activeMockQuestions[currentMockIndex].options.map((option, oIdx) => {
                            const isSelected = selectedMockAnswers[currentMockIndex] === oIdx;
                            return (
                              <button 
                                key={oIdx}
                                onClick={() => handleSelectMockOption(oIdx)}
                                className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all ${
                                  isSelected 
                                    ? 'border-orange-500 bg-orange-500/10 text-orange-300' 
                                    : 'border-slate-800 bg-[#081225] hover:bg-slate-900 text-slate-350'
                                }`}
                              >
                                 {option}
                              </button>
                            );
                         })}
                      </div>

                      {/* Navigation index footer */}
                      <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                         <div className="flex items-center gap-2">
                            <button 
                              onClick={handlePrevMockQuestion}
                              disabled={currentMockIndex === 0}
                              className="px-4 py-2 bg-[#081225] disabled:opacity-40 border border-slate-800 text-slate-400 text-xs font-bold rounded-lg"
                            >
                               Prev
                            </button>
                            <button 
                              onClick={handleNextMockQuestion}
                              className="px-4 py-2 bg-[#081225] border border-slate-800 text-slate-200 text-xs font-bold rounded-lg"
                            >
                               {currentMockIndex === activeMockQuestions.length - 1 ? 'Last Question' : 'Skip/Next'}
                            </button>
                         </div>

                         <button 
                           onClick={handleSubmitMockTest}
                           className="px-6 py-2.5 bg-orange-600 hover:bg-orange-550 text-white text-xs font-black rounded-lg shadow btn-3d"
                         >
                            Submit Paper
                         </button>
                      </div>
                   </div>
                 ) : (
                   <p className="text-center text-slate-400">Loading exam questions...</p>
                 )}
              </motion.div>
            )}

            {/* COMPREHENSIVE RESULT ANALYSIS DASHBOARD */}
            {mockStatus === 'analyzing' && resultAnalysis && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#111B2E] border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl max-w-4xl mx-auto space-y-6"
              >
                 {/* Top celebration title */}
                 <div className="text-center space-y-2 border-b border-slate-800 pb-6">
                    <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 to-orange-500 text-white rounded-full flex items-center justify-center font-black text-3xl mx-auto shadow-lg animate-bounce">
                       🏆
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white">Exam Result Analysis</h3>
                    <p className="text-xs sm:text-sm text-slate-450">Fitted parameters synchronized under Learning Guide UPTET guidelines</p>
                 </div>

                 {/* Results Analysis metrics cards block */}
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-[#081225] border border-slate-800 p-4 rounded-xl">
                       <span className="text-[10px] text-slate-500 font-bold uppercase block">Marks scored</span>
                       <p className="text-2xl font-black text-orange-400 mt-1">{resultAnalysis.score} / {resultAnalysis.total}</p>
                    </div>
                    <div className="bg-[#081225] border border-slate-800 p-4 rounded-xl">
                       <span className="text-[10px] text-slate-500 font-bold uppercase block">Accuracy</span>
                       <p className="text-2xl font-black text-emerald-400 mt-1">{resultAnalysis.accuracy}%</p>
                    </div>
                    <div className="bg-[#081225] border border-slate-800 p-4 rounded-xl">
                       <span className="text-[10px] text-slate-500 font-bold uppercase block">Time taken</span>
                       <p className="text-2xl font-black text-blue-400 mt-1">{resultAnalysis.timeTakenFormatted}</p>
                    </div>
                    <div className="bg-[#081225] border border-slate-800 p-4 rounded-xl">
                       <span className="text-[10px] text-slate-500 font-bold uppercase block">Rank achieved</span>
                       <p className="text-2xl font-black text-yellow-400 mt-1">#2 / 142</p>
                    </div>
                 </div>

                 {/* Weak Topics Analysis summary block */}
                 <div className="p-4 bg-orange-500/10 border border-orange-500/25 rounded-xl space-y-2">
                    <p className="text-xs font-black text-orange-400 uppercase tracking-widest flex items-center gap-1">
                       <AlertCircle className="w-4 h-4" /> Weak Topics Detected (Re-study Recommended)
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                       {resultAnalysis.weakTopics.map((wt, iidx) => (
                          <span key={iidx} className="bg-[#111B2E] border border-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg text-slate-200">
                             ⚠️ {wt}
                          </span>
                       ))}
                    </div>
                    <p className="text-[11px] text-slate-450 pt-1 leading-relaxed">
                       Syllabus check indicates errors in Piagetian schemata models and early acts parameters. Go to 'Study Hub' below to revise notes before re-submitting.
                    </p>
                 </div>

                 {/* Correct/Wrong Split grid representation */}
                 <div className="space-y-3">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">📋 Response Heatmap Matrix (Correct vs Incorrect)</p>
                    <div className="flex flex-wrap gap-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                       {resultAnalysis.correctSplit.map((correctCheck, qidx) => (
                          <div 
                            key={qidx}
                            onClick={() => setCurrentMockIndex(qidx)}
                            className={`w-10 h-10 rounded-lg cursor-pointer flex items-center justify-center font-bold text-xs border ${
                              correctCheck 
                                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
                                : 'bg-rose-500/20 border-rose-500/30 text-rose-450'
                            }`}
                          >
                             {qidx + 1}
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* Explanations section solution block */}
                 {resultAnalysis.showDetailedSolutions && (
                    <div className="space-y-4 pt-4 border-t border-slate-800">
                       <h4 className="text-sm font-black text-slate-450 uppercase tracking-widest">📝 Solution Explanations Directory</h4>
                       <div className="space-y-4">
                          {activeMockQuestions.map((q, idx) => {
                             const userAns = selectedMockAnswers[idx];
                             const isCorrect = userAns === q.correctAnswer;
                             
                             return (
                                <div key={q.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                                   <div className="flex items-center justify-between gap-2">
                                      <span className="text-xs text-orange-400 font-mono font-bold uppercase">Question {idx+1}</span>
                                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                                        isCorrect ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                                      }`}>
                                         {isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                                      </span>
                                   </div>
                                   <p className="text-xs text-white font-bold leading-relaxed">{q.questionText}</p>
                                   <div className="text-[11px] space-y-1 text-slate-400">
                                      <p>Aapka chunav: <span className="text-slate-200 font-bold">{q.options[userAns] || "Attempt nahi kiya"}</span></p>
                                      <p>Sahi uttar: <span className="text-emerald-400 font-bold">{q.options[q.correctAnswer]}</span></p>
                                   </div>
                                   <p className="text-[11px] text-orange-300 italic pt-1 border-t border-slate-800 font-medium">
                                      💡 व्याख्या: {q.explanation}
                                   </p>
                                </div>
                             );
                          })}
                       </div>
                    </div>
                 )}

                 {/* Finish / Restart triggers */}
                 <div className="flex gap-4 pt-4 border-t border-slate-800">
                    <button 
                      onClick={() => setMockStatus('config')}
                      className="flex-1 py-3.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold rounded-xl text-slate-300 transition-colors"
                    >
                       Back to Arena Config
                    </button>
                    <button 
                      onClick={() => {
                        if (activeMockType === 'daily') {
                          startDailyMockTest();
                        } else {
                          startFullMockTest();
                        }
                      }}
                      className="flex-1 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow btn-3d"
                    >
                       🔄 Re-take Test Paper
                    </button>
                 </div>

              </motion.div>
            )}

          </motion.div>
        )}

        {/* 4. STUDY HUB VIEWPORT */}
        {activeTab === 'study_hub' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Header and prominent Notice */}
            <div className="border-b border-slate-800 pb-4">
               <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                  <Book className="text-orange-500 w-7 h-7" /> Study Hub
               </h2>
               <p className="text-sm text-slate-400">अमन अकादमी और महत्वपूर्ण नियमों का बाइलिंगुअल संकलन।</p>
               
               {/* NOTICE as strictly requested */}
               <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs rounded-xl flex items-start gap-2 animate-pulse leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p>
                     <strong>महत्वपूर्ण संदेश:</strong> PDF aur video ko main focus na banayein. Text notes, revision aur flashcards par focus rakhein. Hamne is pure dashboard ko self-explanatory textbook mein tabdil kiya hai!
                  </p>
               </div>
            </div>

            {/* Quick Filter Categories list */}
            <div className="flex flex-wrap gap-2">
               {[
                 { id: "all", label: "📑 All Materials" },
                 { id: "text_notes", label: "✍️ Smart Revision Notes" },
                 { id: "quick_revision", label: "⚡ One Liner Facts" },
                 { id: "revision_cards", label: "🗂️ Flashcards" },
                 { id: "visual_summary", label: "🗺️ Visual Mind Maps" },
                 { id: "exam_specific", label: "📜 Acts & Policies" }
               ].map(filterBtn => (
                  <button
                    key={filterBtn.id}
                    onClick={() => {
                      setStudyHubCategoryFilter(filterBtn.id as any);
                      setExpandedTopicId(null);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                      studyHubCategoryFilter === filterBtn.id 
                        ? 'bg-orange-500 border-orange-600 text-white shadow-md' 
                        : 'bg-[#111B2E] border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                     {filterBtn.label}
                  </button>
               ))}
            </div>

            {/* Collapsible Expandable Chapters container */}
            <div className="space-y-4">
               {/* Search text box */}
               <div className="relative max-w-md bg-slate-950 rounded-xl border border-slate-800">
                  <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chapters notes..."
                    className="w-full bg-transparent pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-0 text-white placeholder-slate-600"
                  />
               </div>

               {/* Chapters list layout */}
               {filteredTopics.map((topic, index) => {
                  const isExpanded = expandedTopicId === topic.id;
                  
                  return (
                     <div 
                       key={topic.id}
                       className="bg-[#111B2E] border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
                     >
                        <button 
                          onClick={() => {
                             const willExpand = !isExpanded;
                             setExpandedTopicId(willExpand ? topic.id : null);
                             if (willExpand) {
                                setCompletedRevisionToday(true);
                                localStorage.setItem('cdp_completedRevisionToday', 'true');
                                addRewardXP(5, 1);
                             }
                             setExpandedChapterTab('summary');
                             setChapterMcqScore(null);
                             setCurrentChapterMcqIdx(0);
                             setChapterMcqSelected(null);
                          }}
                          className="w-full text-left p-5 flex items-center justify-between gap-4"
                        >
                           <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-orange-400">
                                 {topic.icon}
                              </div>
                              <div>
                                 <h4 className="font-extrabold text-white text-base sm:text-lg">{topic.title}</h4>
                                 <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{topic.shortDesc}</p>
                              </div>
                           </div>
                           {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                        </button>

                        {/* Expandable Tabbed detailed block */}
                        {isExpanded && (
                          <div className="border-t border-slate-800 bg-[#081225]/40">
                             
                             {/* Tabs menu matching the requested parameters:
                                 Chapter Summary | Smart Notes | Important Points | One Liner Facts | Flashcards | Mind Map | Chapter MCQ | Chapter Test */}
                             <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-950/80 scrollbar-hide text-xs font-bold gap-1 p-2">
                                {[
                                  { id: "summary", label: "📑 Chapter Summary" },
                                  { id: "notes", label: "🖊️ Smart Notes" },
                                  { id: "points", label: "💡 Important Points" },
                                  { id: "one_liners", label: "⚡ One Liner Facts" },
                                  { id: "flashcards", label: "🗂️ Flashcards" },
                                  { id: "mindmap", label: "🗺️ Mind Map" },
                                  { id: "mcq", label: "🎯 Chapter MCQ" },
                                  { id: "test", label: "⏱️ Chapter Test" }
                                ].map(chTab => (
                                   <button 
                                     key={chTab.id}
                                     onClick={() => setExpandedChapterTab(chTab.id as any)}
                                     className={`flex-shrink-0 px-3.5 py-2 rounded-lg transition-colors ${
                                       expandedChapterTab === chTab.id 
                                         ? 'bg-orange-500 text-white' 
                                         : 'text-slate-400 hover:text-white hover:bg-slate-900'
                                     }`}
                                   >
                                      {chTab.label}
                                   </button>
                                ))}
                             </div>

                             {/* Tab contents panel */}
                             <div className="p-6 space-y-4">
                                
                                {/* A. Summary */}
                                {expandedChapterTab === 'summary' && (
                                   <div className="space-y-3">
                                      <h5 className="text-sm font-black text-white uppercase tracking-wider">Chapter Comprehensive Summary</h5>
                                      <p className="text-xs sm:text-sm text-slate-350 leading-relaxed bg-[#111B2E] p-4 rounded-xl border border-slate-800">
                                         {topic.content.introduction}
                                      </p>
                                      {topic.content.valuableFact && (
                                         <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                                            <p className="text-xs text-orange-400 font-bold">🌟 Pocket Gold Fact:</p>
                                            <p className="text-xs text-slate-200 mt-1">{topic.content.valuableFact}</p>
                                         </div>
                                      )}
                                   </div>
                                )}

                                {/* B. Smart Notes */}
                                {expandedChapterTab === 'notes' && (
                                   <div className="space-y-3">
                                      <h5 className="text-sm font-black text-white uppercase tracking-wider">Smart Revision Notes</h5>
                                      <div className="space-y-3">
                                         {topic.content.keyPoints?.map((kp, kidx) => (
                                            <div key={kidx} className="p-4 bg-[#111B2E] border border-slate-800 rounded-xl space-y-1">
                                               <h6 className="text-xs font-black text-orange-500 uppercase">{kp.title}</h6>
                                               <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">{kp.desc}</p>
                                            </div>
                                         ))}
                                      </div>
                                   </div>
                                )}

                                {/* C. Important Points */}
                                {expandedChapterTab === 'points' && (
                                   <div className="space-y-3">
                                      <h5 className="text-sm font-black text-white uppercase tracking-wider">Learning Guide's High-Yield Bullet list</h5>
                                      <ul className="list-disc pl-5 space-y-2.5 text-xs sm:text-sm text-slate-300">
                                         <li>Harkins development milestones require sensory mapping for newborn reflexes.</li>
                                         <li>Moro reflex response activates when the head is tilted back briefly.</li>
                                         <li>Babinski foot reflex is normal until about 12 to 24 months, indicating brain connectivity.</li>
                                         <li>Always prioritize Nature vs Nurture interaction on any exam development factors.</li>
                                      </ul>
                                   </div>
                                )}

                                {/* D. One Liner Facts */}
                                {expandedChapterTab === 'one_liners' && (
                                   <div className="space-y-3">
                                      <h5 className="text-sm font-black text-white uppercase tracking-wider">Fast Revision One-Liners</h5>
                                      <div className="space-y-2 bg-[#111B2E] p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
                                         <p className="leading-relaxed"><strong className="text-orange-400">» Sigmund Freud:</strong> Psychoanalysis founder, classified developmental energy as Libido.</p>
                                         <p className="leading-relaxed"><strong className="text-orange-400">» Rudolf Gockel (1590):</strong> First coined 'Psychology' keyword in written manuscripts.</p>
                                         <p className="leading-relaxed"><strong className="text-orange-400">» Mendel Peas factor:</strong> Tracked heredity continuity via recessive factors.</p>
                                      </div>
                                   </div>
                                )}

                                {/* E. Flashcards */}
                                {expandedChapterTab === 'flashcards' && (
                                   <div className="space-y-4">
                                      <h5 className="text-sm font-black text-white uppercase tracking-wider">Interactive 3D Memorizing Flashcards</h5>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                         {FLASHCARDS.map(fc => {
                                            const isFlipped = flippedCards[fc.id] || false;
                                            return (
                                               <div 
                                                 key={fc.id}
                                                 onClick={() => setFlippedCards(prev => ({ ...prev, [fc.id]: !isFlipped }))}
                                                 className="relative h-44 bg-[#111B2E] border border-slate-800 p-5 rounded-xl cursor-pointer shadow-lg hover:border-orange-500/40 transition-all select-none overflow-hidden flex flex-col justify-between"
                                               >
                                                  <div className="absolute top-2 right-2 text-[9px] font-mono text-slate-500 uppercase tracking-widest leading-none">
                                                     Flip Card
                                                  </div>
                                                  <div className="relative z-15 flex flex-col h-full justify-between">
                                                     {!isFlipped ? (
                                                        <div>
                                                           <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[9px] font-bold px-2 py-0.5 rounded uppercase">Mnemonic Trigger</span>
                                                           <p className="text-lg font-black text-white mt-3">"{fc.statement}"</p>
                                                           <p className="text-xs text-slate-400 mt-1">Author: {fc.philosopher}</p>
                                                        </div>
                                                     ) : (
                                                        <div className="space-y-1.5 animate-pulse">
                                                           <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-2 py-0.5 rounded uppercase">Internal Meaning</span>
                                                           <p className="text-xs text-slate-205 font-bold leading-relaxed">{fc.description}</p>
                                                           <p className="text-[10px] text-slate-550 italic mt-1">{fc.englishPhilosopher} • {fc.context}</p>
                                                        </div>
                                                     )}
                                                     
                                                     <div className="text-[9px] text-right font-bold text-slate-400">
                                                        {!isFlipped ? "👁️ Show Explanation" : "✓ Got it!"}
                                                     </div>
                                                  </div>
                                               </div>
                                            );
                                         })}
                                      </div>
                                   </div>
                                )}

                                {/* F. Mind Map */}
                                {expandedChapterTab === 'mindmap' && (
                                   <div className="space-y-3">
                                      <h5 className="text-sm font-black text-white uppercase tracking-wider">Concept Structural Mind Map</h5>
                                      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto text-emerald-400">
                                         <pre className="leading-relaxed">
{`[Psychology Conception, 1590 Rudolf]
     │
     ├──► Soul science (Plato, Aristotle 16th century)
     ├──► Mind science (Reid & Pomponazzi 17th century)
     ├──► Consciousness (William James 19th century)
     └──► Behaviorism (Watson, Woodworth & Skinner 20th century)
             │
             └──► Learning theories applied to pedagogy`}
                                         </pre>
                                      </div>
                                   </div>
                                )}

                                {/* G. Chapter MCQ */}
                                {expandedChapterTab === 'mcq' && (
                                   <div className="space-y-4">
                                      <h5 className="text-sm font-black text-white uppercase tracking-wider">Chapter Rapid MCQ Practice</h5>
                                      
                                      {chapterMcqScore === null ? (
                                         <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
                                            <p className="text-xs text-slate-400 font-mono">Question {currentChapterMcqIdx+1} of 5</p>
                                            <p className="text-white font-extrabold text-sm sm:text-base">
                                               {MOCK_QUESTIONS[currentChapterMcqIdx % MOCK_QUESTIONS.length].questionText}
                                            </p>
                                            <div className="space-y-2 text-xs">
                                               {MOCK_QUESTIONS[currentChapterMcqIdx % MOCK_QUESTIONS.length].options.map((option, oIdx) => (
                                                  <button
                                                    key={oIdx}
                                                    onClick={() => setChapterMcqSelected(oIdx)}
                                                    className={`w-full text-left p-3.5 rounded-lg border ${
                                                      chapterMcqSelected === oIdx 
                                                        ? 'border-orange-500 bg-orange-500/10 text-orange-300' 
                                                        : 'border-slate-800 bg-[#111B2E] text-slate-300 hover:bg-slate-900'
                                                    }`}
                                                  >
                                                     {option}
                                                  </button>
                                               ))}
                                            </div>
                                            <button
                                              onClick={() => {
                                                 const correctAns = MOCK_QUESTIONS[currentChapterMcqIdx % MOCK_QUESTIONS.length].correctAnswer;
                                                 if (chapterMcqSelected === correctAns) {
                                                    addRewardXP(10, 2);
                                                    setChapterMcqScore(1); // quick finish mockup
                                                 } else {
                                                    alert("गलत जवाब! सही उत्तर है: " + MOCK_QUESTIONS[currentChapterMcqIdx % MOCK_QUESTIONS.length].options[correctAns]);
                                                    setChapterMcqScore(0);
                                                 }
                                              }}
                                              disabled={chapterMcqSelected === null}
                                              className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg mt-2"
                                            >
                                               Submit
                                            </button>
                                         </div>
                                      ) : (
                                         <div className="p-5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-center space-y-3">
                                            <h6 className="font-extrabold text-emerald-400 text-lg">Practice Set Finished!</h6>
                                            <p className="text-xs text-slate-303">You earned +10 Experience points for trying chapter evaluations!</p>
                                            <button 
                                              onClick={() => {
                                                 setChapterMcqScore(null);
                                                 setChapterMcqSelected(null);
                                              }}
                                              className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
                                            >
                                               Repeat MCQ
                                            </button>
                                         </div>
                                      )}
                                   </div>
                                )}

                                {/* H. Chapter Test */}
                                {expandedChapterTab === 'test' && (
                                   <div className="p-5 bg-[#111B2E] border border-slate-800 rounded-xl text-center space-y-4">
                                      <h5 className="font-extrabold text-white text-base">⏱️ Sub-Chapter Speed Test Mode</h5>
                                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                                         Assess chapter completion rate in a tight 2-minute exam. Contains 5 focus questions from this chapter study set.
                                      </p>
                                      <button
                                        onClick={() => {
                                           setActiveTab('mock_test');
                                           startDailyMockTest();
                                        }}
                                        className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs rounded-xl shadow btn-3d"
                                      >
                                         Begin Timed speed test
                                      </button>
                                   </div>
                                )}

                             </div>
                          </div>
                        )}
                     </div>
                  );
               })}
            </div>
          </motion.div>
        )}

        {/* 5. PROFILE VIEWPORT */}
        {activeTab === 'profile' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
             {/* Main Profile Info Header */}
             <div className="bg-[#111B2E] border border-slate-800 p-6 sm:p-8 relative overflow-hidden text-center shadow-xl">
                 <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-orange-500/20 to-blue-500/10 border-b border-slate-800" />
                 
                 <div className="relative w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-4xl font-extrabold border-4 border-slate-800 shadow-xl mt-6">
                    {currentUser.name.charAt(0)}
                 </div>
                 <h2 className="text-2xl font-black text-white relative z-10">{currentUser.name}</h2>
                 <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mt-1 relative z-10">
                    ID: {currentUser.id} • {currentUser.email}
                 </p>
                 <div className="mt-4 inline-flex items-center gap-2 bg-[#081225] px-4 py-2 border border-slate-800 rounded-full text-xs text-orange-400 font-bold">
                    <GraduationCap className="w-4 h-4" /> Active Enrolled Course: COURSE_UPTET_2026
                 </div>
             </div>

             {/* Performance Cards Block */}
             <div className="space-y-3">
                <h4 className="text-sm font-black text-slate-405 uppercase tracking-widest">🏆 Performance Metrics</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-center">
                   <div className="bg-[#111B2E] border border-slate-800 p-4 rounded-xl">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Solved</span>
                      <p className="text-xl font-black text-white mt-1">{questionsSolvedCount}</p>
                   </div>
                   
                   <div className="bg-[#111B2E] border border-slate-800 p-4 rounded-xl">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Avg Accuracy</span>
                      <p className="text-xl font-black text-white mt-1">{accuracyRate}%</p>
                   </div>

                   <div className="bg-[#111B2E] border border-slate-800 p-4 rounded-xl">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Tests Attempted</span>
                      <p className="text-xl font-black text-white mt-1">{testAttemptsCount}</p>
                   </div>

                   <div className="bg-[#111B2E] border border-slate-800 p-4 rounded-xl">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Best Score</span>
                      <p className="text-xl font-black text-orange-400 mt-1">142/150</p>
                   </div>

                   <div className="bg-[#111B2E] border border-slate-800 p-4 rounded-xl">
                      <span className="text-[10px] text-slate-505 font-bold uppercase block">Current Streak</span>
                      <p className="text-xl font-black text-orange-400 mt-1">12 Days</p>
                   </div>

                   <div className="bg-[#111B2E] border border-slate-800 p-4 rounded-xl">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Rank achieved</span>
                      <p className="text-xl font-black text-yellow-400 mt-1">✨ #2</p>
                   </div>
                </div>
             </div>

             {/* Achievements Badges Display */}
             <div className="bg-[#111B2E] border border-slate-800 p-5 rounded-2xl space-y-3">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                   <Award className="w-5 h-5 text-yellow-400" /> Earned Badges & Ribbons
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                   {currentUser.badges.map((badge, idx) => (
                      <span key={idx} className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 text-[11px] font-bold px-3 py-1.5 rounded-xl">
                         🏆 {badge}
                      </span>
                   ))}
                   <span className="bg-[#081225] text-slate-500 border border-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-xl italic">
                      + Locked Badges are rewarded organically
                   </span>
                </div>
             </div>

             {/* Gamification Coins & XP tracking */}
             <div className="bg-gradient-to-r from-orange-600/15 to-blue-600/5 border border-orange-500/20 p-5 rounded-2xl flex justify-between items-center">
                <div>
                   <h4 className="font-extrabold text-white text-base">🪙 Gold & Level Experience</h4>
                   <p className="text-xs text-slate-400 mt-1">Keep solving practice sets to level up!</p>
                </div>
                <div className="text-right">
                   <p className="text-lg font-black text-amber-400">🪙 {currentUser.coins} Coins</p>
                   <p className="text-xs font-mono text-blue-400 mt-0.5">{currentUser.xp} Experience Points</p>
                </div>
             </div>

             {/* Links Directory Area */}
             <div className="bg-[#111B2E] border border-slate-800 rounded-2xl divide-y divide-slate-800">
                {[
                  { title: "My Progress tracker details", detail: "View custom performance graph log history" },
                  { title: "Test History records", detail: "Browse detail sheets from 3 daily attempts" },
                  { title: "Bookmarks and Saved handouts", detail: `Quick browse related ${bookmarkedQuestions.length} bookmarks` },
                  { title: "Wrong Questions bank", detail: `${wrongQuestions.length} saved incorrect revisions` },
                  { title: "Subscription Plan parameters", detail: "COURSE_UPTET_2026 Lifetime Premium Active" },
                  { title: "Help & Support line", detail: "Direct chatbot query & helpline guides" },
                  { title: "Application Settings", detail: "Reset local statistics & configurations" }
                ].map((item, idindex) => (
                   <div 
                     key={idindex}
                     onClick={() => alert(`Aapne choose kiya: ${item.title}`)}
                     className="p-4 hover:bg-slate-950/40 cursor-pointer transition-all flex items-center justify-between"
                   >
                      <div>
                         <p className="text-xs sm:text-sm font-extrabold text-slate-200">{item.title}</p>
                         <p className="text-[10px] text-slate-500 mt-0.5">{item.detail}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                   </div>
                ))}
                
                {/* Logout action */}
                <div 
                  onClick={() => {
                    setIsLoggedIn(false);
                    localStorage.setItem('cdp_isLoggedIn', 'false');
                    localStorage.removeItem('cdp_currentUser_rich');
                    setLoginEmail('');
                    setLoginPassword('');
                    setSignupFullName('');
                    setSignupMobile('');
                    setSignupEmail('');
                    setSignupPassword('');
                    setSignupConfirmPassword('');
                    setAuthSuccess("Aap successfully logged out ho gaye hain!");
                    setActiveTab('home');
                  }}
                  className="p-4 hover:bg-rose-950/20 cursor-pointer transition-all flex items-center justify-between"
                >
                   <div>
                      <p className="text-xs sm:text-sm font-extrabold text-rose-450">Sign Out</p>
                      <p className="text-[10px] text-rose-350 mt-0.5">Exit current STU_98765 sandbox session</p>
                   </div>
                   <X className="w-4 h-4 text-rose-500" />
                </div>
             </div>

             {/* Profile Contact Support Card */}
             <div className="bg-[#111B2E] border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl text-center relative overflow-hidden mt-6">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
               <div className="mx-auto w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-400">
                 <MessageCircle className="w-6 h-6" />
               </div>
               <div>
                 <h4 className="text-sm font-black text-white">Need Help & Guidance?</h4>
                 <p className="text-[11px] text-slate-400 mt-1">We're here to support your preparation journey.</p>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                 <a 
                   href="https://wa.me/917571051611" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] rounded-lg transition-colors cursor-pointer"
                 >
                   <span>WhatsApp Support</span>
                 </a>
                 <a 
                   href="https://instagram.com/amn_0fficial" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white font-extrabold text-[11px] rounded-lg transition-colors cursor-pointer"
                 >
                   <span>Instagram Community</span>
                 </a>
               </div>
             </div>

          </motion.div>
        )}

      </main>

      {/* COMPACT FLOATING DOUBT CHAT WITH SPECIFIC SIZE */}
      <div>
         {/* Small floating chat trigger button */}
         <button 
           onClick={() => setIsDoubtDrawerOpen(true)}
           className="fixed bottom-20 md:bottom-6 right-6 p-3 bg-gradient-to-tr from-orange-500 to-orange-600 text-white rounded-full hover:scale-105 active:scale-95 transition-transform shadow-xl hover:shadow-orange-500/20 z-50 flex items-center justify-center border border-orange-400"
         >
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-black pl-1.5 pr-1 hidden sm:inline uppercase">Ask CDP AI</span>
         </button>

         {/* Doubt solver chat drawer backdrop */}
         {isDoubtDrawerOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-end p-4">
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsDoubtDrawerOpen(false)} />
              
              <motion.div 
                initial={{ transform: 'translateX(100%)', opacity: 0 }}
                animate={{ transform: 'translateX(0%)', opacity: 1 }}
                exit={{ transform: 'translateX(100%)', opacity: 0 }}
                transition={{ type: 'spring', damping: 25 }}
                className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md h-[80vh] shadow-2xl flex flex-col overflow-hidden z-10"
              >
                 {/* Drawer Header */}
                 <div className="p-4 border-b border-slate-800 bg-[#111B2E] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                       <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                          <BrainCircuit className="w-4 h-4" />
                       </div>
                       <div>
                          <h3 className="font-extrabold text-white text-xs sm:text-sm">CDP AI Doubt Solver</h3>
                          <p className="text-[9px] text-emerald-400 font-mono">Expert Mentor • Verified Assistant</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setIsDoubtDrawerOpen(false)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                    >
                       <X className="w-4 h-4" />
                    </button>
                 </div>

                 {/* Messages log */}
                 <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-[#081225] select-text">
                    {chatMessages.map((msg, index) => (
                       <div 
                         key={index}
                         className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                       >
                          <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                            msg.role === 'user' 
                              ? 'bg-orange-600 text-white rounded-tr-none' 
                              : 'bg-[#111B2E] text-slate-200 border border-slate-800 rounded-tl-none'
                          }`}>
                             <p>{msg.text}</p>
                             <span className="text-[9px] text-slate-505 mt-2 block text-right font-mono">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </span>
                          </div>
                       </div>
                    ))}
                    
                    {isDoubtLoading && (
                       <div className="flex justify-start">
                          <div className="bg-[#111B2E] p-4 border border-slate-800 rounded-2xl rounded-tl-none flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                             <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                             <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                       </div>
                    )}
                    <div ref={chatEndRef} />
                 </div>

                 {/* Quick Chips suggestions inside drawer */}
                 <div className="p-3 bg-slate-950 border-t border-slate-800">
                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Suggested Doubt Triggers:</p>
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide text-[10px] font-bold">
                       {QUICK_DOUBT_CHIPS.map(chip => (
                          <button
                            key={chip.id}
                            onClick={() => {
                               if (aiGuruMessageCount >= 10) {
                                 alert("आज की AI Guru limit पूरी हो गई है। अधिक सहायता के लिए Expert Mentor से संपर्क करें।\n\nWhatsApp: +91-7571051611\nInstagram: @amn_0fficial");
                                 return;
                               }
                               handleSolveDoubt(chip.text);
                            }}
                            className="bg-[#111B2E] hover:bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-full flex-shrink-0 transition-colors"
                          >
                             {chip.text}
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* Send Input Panel */}
                 <div className="p-3.5 bg-[#111B2E] border-t border-slate-800 flex gap-2">
                    <input 
                      type="text"
                      value={doubtInput}
                      onChange={(e) => setDoubtInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSolveDoubt()}
                      placeholder={aiGuruMessageCount >= 10 ? "आज की AI Guru limit पूरी हो गई है। (Limit Reached)" : "Type your CDP doubt query..."}
                      disabled={isDoubtLoading || aiGuruMessageCount >= 10}
                      className="flex-1 bg-slate-950 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                    <button 
                      onClick={() => {
                          if (aiGuruMessageCount >= 10) {
                             alert("आज की AI Guru limit पूरी हो गई है। अधिक सहायता के लिए Expert Mentor से संपर्क करें।\n\nWhatsApp: +91-7571051611\nInstagram: @amn_0fficial");
                             return;
                          }
                          handleSolveDoubt();
                       }}
                      disabled={aiGuruMessageCount < 10 && (!doubtInput.trim() || isDoubtLoading)}
                      className="p-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white rounded-xl transition-colors shrink-0"
                    >
                       <Send className="w-4 h-4" />
                    </button>
                 </div>
              </motion.div>
           </div>
         )}
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-slate-800 pb-safe z-40" style={{ backgroundColor: "#111B2E" }}>
        <div className="flex justify-around items-center p-2">
          
          <button 
            onClick={() => setActiveTab('home')} 
            className={`flex flex-col items-center p-2 flex-1 transition-colors ${activeTab === 'home' ? 'text-orange-400' : 'text-slate-500'}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-1">Home</span>
          </button>

          <button 
            onClick={() => setActiveTab('practice')} 
            className={`flex flex-col items-center p-2 flex-1 transition-colors ${activeTab === 'practice' ? 'text-orange-400' : 'text-slate-500'}`}
          >
            <Target className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-1">Practice</span>
          </button>

          <button 
            onClick={() => setActiveTab('mock_test')} 
            className={`flex flex-col items-center p-2 flex-1 transition-colors ${activeTab === 'mock_test' ? 'text-orange-400' : 'text-slate-500'}`}
          >
            <Medal className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-1">Mock Test</span>
          </button>

          <button 
            onClick={() => setActiveTab('study_hub')} 
            className={`flex flex-col items-center p-2 flex-1 transition-colors ${activeTab === 'study_hub' ? 'text-orange-400' : 'text-slate-500'}`}
          >
            <Book className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-1">Study Hub</span>
          </button>

          <button 
            onClick={() => setActiveTab('profile')} 
            className={`flex flex-col items-center p-2 flex-1 transition-colors ${activeTab === 'profile' ? 'text-orange-400' : 'text-slate-500'}`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-1">Profile</span>
          </button>

        </div>
      </nav>

    </div>
  );
}
