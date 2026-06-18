import React from 'react';
import { Smile, BrainCircuit, BookOpenCheck, Compass, UserCheck, Award, Users, BookOpen } from 'lucide-react';
import { 
  SEED_CHAPTERS, 
  SEED_MOCK_QUESTIONS, 
  SEED_SUBJECTS,
  Chapter,
  Mcq
} from './chaptersData';

export interface Question {
  id: number;
  topicId: number;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  source?: string;
}

export interface StudyTopic {
  id: number;
  title: string;
  shortDesc: string;
  icon: React.ReactNode;
  content: {
    sectionTitle: string;
    introduction: string;
    keyPoints?: { title: string; desc: string }[];
    theories?: { name: string; experiments?: string; stages?: string[]; principles: string[] }[];
    teachingImplications: string;
    valuableFact: string;
  };
  oneLinerRevision?: string[];
  weakTopicTags?: string[];
}

export interface Flashcard {
  id: number;
  statement: string;
  philosopher: string;
  englishPhilosopher: string;
  context: string;
  description: string;
}

// Map the extracted Chapters into StudyTopic schema
export const STUDY_TOPICS: StudyTopic[] = SEED_CHAPTERS.map((ch, idx) => {
  const icons = [
    <BrainCircuit className="w-5 h-5 text-indigo-400" id={`topic-icon-${ch.chapterNumber}`} />,
    <Smile className="w-5 h-5 text-indigo-300" id={`topic-icon-${ch.chapterNumber}`} />,
    <UserCheck className="w-5 h-5 text-blue-400" id={`topic-icon-${ch.chapterNumber}`} />,
    <Compass className="w-5 h-5 text-teal-400" id={`topic-icon-${ch.chapterNumber}`} />,
    <Users className="w-5 h-5 text-emerald-400" id={`topic-icon-${ch.chapterNumber}`} />,
    <Award className="w-5 h-5 text-orange-400" id={`topic-icon-${ch.chapterNumber}`} />,
  ];

  return {
    id: ch.chapterNumber,
    title: `${ch.chapterNumber}. ${ch.chapterHindiTitle} (${ch.chapterTitle})`,
    shortDesc: ch.summary.slice(0, 110) + "...",
    icon: icons[idx % icons.length],
    content: {
      sectionTitle: ch.chapterHindiTitle,
      introduction: ch.summary,
      keyPoints: ch.importantPoints.map((pt, pIdx) => ({
        title: `बिंदु ${pIdx + 1}`,
        desc: pt
      })),
      teachingImplications: "शिक्षक को हमेशा आनुवंशिकता, पर्यावरण के प्रभाव, विभिन्न अवस्थाओं और बच्चों की व्यक्तिगत भिन्नताओं के नियमों को ध्यान में रखकर सक्रिय खोज-उन्मुख गतिविधियां करानी चाहिए।",
      valuableFact: ch.oneLinerRevision[0] || "मनोविज्ञान प्रथम प्रयोगशाला (1879, लिपज़िग) की स्थापना विल्हेम वुंड्ट ने की थी।"
    },
    oneLinerRevision: ch.oneLinerRevision,
    weakTopicTags: ch.weakTopicTags
  };
});

// Map SEED_MOCK_QUESTIONS to Question schema
export const MOCK_QUESTIONS: Question[] = SEED_MOCK_QUESTIONS.map((q, idx) => {
  const ansMap: Record<string, number> = { "A": 0, "B": 1, "C": 2, "D": 3 };
  return {
    id: idx + 1,
    topicId: parseInt(q.chapterId.split("-")[1]) || 1,
    questionText: q.question,
    options: q.options,
    correctAnswer: ansMap[q.correctAnswer] !== undefined ? ansMap[q.correctAnswer] : 0,
    explanation: q.explanation
  };
});

export const get30Questions = () => {
  return MOCK_QUESTIONS;
};

export const FLASHCARDS: Flashcard[] = [
  {
    id: 1,
    statement: "SPCF (Some People Can Fly)",
    philosopher: "जीन पियाजे (Jean Piaget)",
    englishPhilosopher: "Jean Piaget Stages",
    context: "संज्ञानात्मक विकास की अवस्थाएं (Stages of Cog)",
    description: "याद रखने की शॉर्टकट ट्रिक: S = Sensorimotor (0-2 वर्ष), P = Pre-operational (2-7 वर्ष), C = Concrete (7-11 वर्ष), F = Formal (11+ वर्ष)।"
  },
  {
    id: 2,
    statement: "PAV-DOG & SKIN-RAT",
    philosopher: "इवान पावलव और स्किनर",
    englishPhilosopher: "Pavlov & Skinner Experiments",
    context: "शास्त्रीय एवं क्रियाप्रसूत अनुबंधन",
    description: "याद रखें: पावलव ने कुत्ते (Dog) पर लार टपकने का 'शास्त्रीय अनुबंधन' प्रयोग किया। स्किनर ने चूहे (Rat - Skinner Box) पर 'क्रियाप्रसूत' प्रयोग किया।"
  },
  {
    id: 3,
    statement: "REE (Readiness, Exercise, Effect)",
    philosopher: "ई.एल. थॉर्नडाइक",
    englishPhilosopher: "Thorndike Primary Laws",
    context: "सीखने के प्राथमिक नियम (Core Laws of learning)",
    description: "R = Readiness (तत्परता का नियम), E = Exercise (अभ्यास का नियम), E = Effect (प्रभाव का नियम)। अभ्यास से अधिगम सुदृढ़ होता है।"
  },
  {
    id: 4,
    statement: "MKO + ZPD = Scaffolding",
    philosopher: "लेव वाइगोत्स्की",
    englishPhilosopher: "Lev Vygotsky Dynamic Study",
    context: "सामाजिक-सांस्कृतिक विकास का सिद्धांत",
    description: "जब एक 'अधिक जानकार अन्य' (MKO) आपके वर्तमान स्तर और समीपस्थ विकास क्षेत्र (ZPD) के बीच अस्थायी सहायता करता है तो उसे मचान (Scaffolding) कहते हैं।"
  },
  {
    id: 5,
    statement: "Id, Ego & Superego Dynamic",
    philosopher: "सिगमंड फ्रायड (Sigmund Freud)",
    englishPhilosopher: "Freud Structural Personality",
    context: "व्यक्तित्व का त्रिक संरचना मॉडल",
    description: "इड = अचेतन मन और मूल प्रवृत्तियों पर आधारित पशुवत इच्छाएं। ईगो = वास्तविकता के अनुकूल संतुलन। सुपरईगो = माता-पिता और समाज से प्रेरित नैतिक सिद्धांत।"
  }
];

export const QUICK_DOUBT_CHIPS = [
  { id: "qd1", text: "Piaget Theory समझाएं", topic: "Child Development" },
  { id: "qd2", text: "शैशवावस्था के रिफ्लेक्स", topic: "Child Development" },
  { id: "qd3", text: "बुद्धि के सिद्धांतों का वर्णन", topic: "Intelligence Theories" }
];
