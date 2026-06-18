import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialize Gemini client to avoid crashes if API Key is missing on start
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST route to handle child development and pedagogy doubts
app.post('/api/doubt-solver', async (req, res) => {
  try {
    const { question, topic, history } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Quick regex prefilter to capture non-CDP/unrelated patterns instantly
    const nonPedagogyCodewords = [
      'react', 'nodejs', 'python', 'javascript', 'html', 'css', 'programming', 
      'coding', 'sql', 'database', 'blockchain', 'crypto', 'crypto', 'stock market', 
      'mutual fund', 'finance', 'religion', 'politics', 'bitcoin', 'weather'
    ];
    const userQueryLower = question.toLowerCase();
    const isUnrelatedCodeOrFinance = nonPedagogyCodewords.some(word => userQueryLower.includes(word));

    if (isUnrelatedCodeOrFinance) {
      return res.json({ 
        answer: "मैं केवल CDP और UPTET Pedagogy से जुड़े सवालों में मदद कर सकता हूँ। कृपया CDP से संबंधित प्रश्न पूछें।" 
      });
    }

    const ai = getGeminiClient();

    // Context instructions to model following user rules strictly
    const systemInstruction = `
You are "AI Guru", an expert UPTET & CTET Child Development & Pedagogy (CDP) Study Coach.
Ask only CDP and UPTET pedagogy questions.

STRICT RULES:
1. ONLY answer questions related to Child Development (बाल विकास), Pedagogy (शिक्षाशास्त्र), Psychology (मनोविज्ञान), Learning Theories (अधिगम सिद्धांत), Piaget, Vygotsky, Kohlberg, Thorndike, Pavlov, Skinner, UPTET, CTET, STET, RTE Act 2009, IEP, NEP, NCF, Inclusive Education (समावेशी शिक्षा), Assessment and Evaluation.
2. If the user asks about ANYTHING else (general knowledge, coding, politics, adult content, medical, finance, religion, recipes, sports, or any unrelated topics), you MUST reply with exactly and ONLY this Hindi phrase:
"मैं केवल CDP और UPTET Pedagogy से जुड़े सवालों में मदद कर सकता हूँ। कृपया CDP से संबंधित प्रश्न पूछें।"
3. Keep answers extremely fast, short, and clear.
4. Keep answers in simple, easy-to-understand Hindi, using English terms in parentheses (e.g., "संज्ञानात्मक विकास (Cognitive Development)") when useful.
5. Add short classroom examples when useful.
6. ABSOLUTE MAXIMUM ANSWER LENGTH: 120 words. Answer quickly and finish within this limit.
`;

    const chatHistory = history?.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })) || [];

    // Query 'gemini-3.5-flash' for efficient first-class response
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: question }] }
      ],
      config: {
        systemInstruction: systemInstruction,
      }
    });

    let answerText = response.text || "";
    // If model strayed or hallucinated outside constraints, check output to enforce refusal
    const unrelatedResponse = "मैं केवल CDP और UPTET Pedagogy से जुड़े सवालों में मदद कर सकता हूँ। कृपया CDP से संबंधित प्रश्न पूछें।";
    
    // Basic verification of safety or topic violation
    const unrelatedKeywords = ['recipe', 'finance', 'stock', 'invest', 'politic', 'coding', 'programming'];
    const textLower = answerText.toLowerCase();
    if (unrelatedKeywords.some(kw => textLower.includes(kw))) {
      answerText = unrelatedResponse;
    }

    res.json({ answer: answerText });
  } catch (error: any) {
    console.error('Doubt Solver API Error:', error);
    res.status(500).json({ error: 'Sorry, abhi server busy hai. Kripya 1 minute baad fir se koshish karein!' });
  }
});

// Configure Vite integration for dev server or serve static assets in production
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`UPTET CDP Fullstack Server running on port ${PORT}`);
});
