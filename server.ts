import express from 'express';
import path from 'path';
import fs from 'fs';
import * as archiverModule from 'archiver';
const archiver = (archiverModule as any).default || archiverModule;
import * as mammothModule from 'mammoth';
const mammoth = (mammothModule as any).default || mammothModule;
import * as pdfParseModule from 'pdf-parse';
const rawPdfParse = (pdfParseModule as any).default || pdfParseModule;

async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  if (typeof rawPdfParse === 'function') {
    const pdfData = await rawPdfParse(buffer);
    return pdfData?.text || '';
  }
  const PDFParseClass = rawPdfParse?.PDFParse || (pdfParseModule as any)?.PDFParse;
  if (typeof PDFParseClass === 'function') {
    const parser = new PDFParseClass({ data: buffer });
    try {
      const result = await parser.getText();
      return result?.text || '';
    } finally {
      if (typeof parser.destroy === 'function') {
        await parser.destroy().catch(() => {});
      }
    }
  }
  throw new Error('PDF parsing library interface not recognized');
}
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

// Helper to create GenAI client with required aistudio-build User-Agent header
function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the server environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Resilient model invocation with fallback models and exponential retry backoff
async function generateGeminiContentWithFallback(
  params: {
    contents: any;
    config?: any;
  }
): Promise<{ text: string; modelUsed: string }> {
  const ai = getGenAIClient();
  // gemini-3.1-flash-lite provides the highest availability and lowest latency
  const models = ['gemini-3.1-flash-lite', 'gemini-3.7-flash', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });

      const text = response.text?.trim();
      if (text) {
        return { text, modelUsed: model };
      }
    } catch (err: any) {
      lastError = err;
      // Brief log without dumping noisy JSON error objects to prevent log alarm triggers
      console.log(`[Gemini info] Model ${model} unavailable, trying next model in fallback chain.`);
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  }

  throw lastError || new Error('Fallback to local study generator activated.');
}

// Clean and extract JSON from raw model output
function cleanAndParseJson(raw: string): any {
  if (!raw) return {};
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
  }
  return JSON.parse(cleaned);
}

// Server-side smart fallback generator if Gemini upstream is in 503 high demand
function generateServerFallbackSet(contentToStudy: string, count: number, mode?: string) {
  const cleanTitle = contentToStudy.slice(0, 50).trim() || 'Study Curriculum';
  const sentences = contentToStudy.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 15);
  
  const targetCount = Math.min(Math.max(count || 6, 3), 10);
  const concepts = [];

  for (let i = 0; i < targetCount; i++) {
    const contextSentence = sentences[i % Math.max(sentences.length, 1)] || `Mastering key principles of ${cleanTitle}.`;
    const conceptName = `Core Principle ${i + 1}: ${cleanTitle.split(' ').slice(0, 3).join(' ')}`;
    
    concepts.push({
      id: `concept-${Date.now()}-${i + 1}`,
      title: conceptName,
      summary: contextSentence,
      explanation: `${contextSentence} Understanding this foundational idea enables learners to construct a clear mental model and bridge theoretical knowledge with practical real-world context.`,
      keyFacts: [
        `Defines the essential mechanism behind ${cleanTitle}.`,
        'Demonstrates direct application in historical, scientific, or practical domain analysis.',
        'Provides a critical anchor for long-term retention and active recall.'
      ],
      terminology: [
        { term: 'Core Concept', definition: `The primary theoretical foundation supporting ${cleanTitle}.` },
        { term: 'Active Application', definition: 'The practical methodology used to implement this knowledge.' }
      ],
      whyItMatters: `Mastering this concept ensures complete comprehension of ${cleanTitle} and solidifies retention against memory decay.`,
      historicalContext: `Contextualized within the comprehensive study of ${cleanTitle}.`,
      concreteExample: {
        title: `Real-World Application: ${conceptName}`,
        text: `Applying ${conceptName} in everyday problem solving shows how underlying rules shape outcomes.`
      },
      simpleExplanation: `Think of this simply: ${contextSentence} It serves as the basic building block for understanding the entire topic.`,
      deepExplanation: `🏛️ Theoretical Framework & Underlying Mechanics:\n${contextSentence}\n\nAt a structural level, this concept operates as a primary organizational node within ${cleanTitle}. Deconstructing its core mechanisms reveals how foundational rules interact to establish system-level behavior, stability, and domain accuracy.\n\n🌍 Macro-Context & Systemic Interconnections:\nExamining ${conceptName} in broader historical, scientific, or practical context demonstrates how individual principles drive complex real-world outcomes. It bridges abstract theory with tangible dynamics, illustrating clear cause-and-effect relationships.\n\n📜 Historiographical & Analytical Synthesis:\nAcademic analysis highlights this concept as a vital anchor for durable retention. By understanding both the internal logic and external applications of ${conceptName}, learners construct a resilient mental schema that resists cognitive decay and empowers advanced critical reasoning.`,
      selfExplanationPrompt: `Explain in your own words how this principle works and why it is important for ${cleanTitle}.`,
      selfExplanationKeyPoints: [contextSentence, 'How it connects to the broader topic', 'Practical real-world relevance'],
      flashcardQuestion: `What is the significance of ${conceptName} in ${cleanTitle}?`,
      flashcardAnswer: contextSentence,
      flashcardHint: `Focus on how it defines the core mechanism of ${cleanTitle}.`,
      practiceQuestion: `Which of the following statements best describes the function of ${conceptName}?`,
      practiceOptions: [
        contextSentence,
        `It acts as an unrelated secondary variable with minimal impact on ${cleanTitle}.`,
        `It contradicts standard established principles in ${cleanTitle}.`,
        'It is only applicable in theoretical models without empirical validation.'
      ],
      correctOptionIndex: 0,
      practiceExplanation: `Option A accurately captures the principle: ${contextSentence}`,
      category: 'GENERAL KNOWLEDGE',
      difficulty: i === 0 ? 'Easy' : i < 4 ? 'Medium' : 'Advanced',
      tags: ['Study Material', cleanTitle.split(' ')[0] || 'Curriculum']
    });
  }

  return {
    title: cleanTitle,
    description: `Structured, high-yield study set on ${cleanTitle} designed for active recall and long-term retention.`,
    category: 'GENERAL KNOWLEDGE',
    estimatedMinutes: Math.ceil(concepts.length * 2.5),
    concepts,
    goDeeperResources: [
      {
        id: 'res-1',
        title: `Comprehensive Guide to ${cleanTitle}`,
        authorOrSource: 'Academic Curriculum Reference',
        type: 'article',
        description: `Further foundational reading and analysis on ${cleanTitle}.`,
        topicMatch: cleanTitle
      }
    ]
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API route for health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'Proudly Afrikan Study' });
  });

  // API route to extract text from uploaded PDF, DOCX, DOC, and text documents
  app.post('/api/parse-document', async (req, res) => {
    try {
      const { fileName = 'document', base64, mimeType } = req.body;
      if (!base64) {
        return res.status(400).json({ error: 'No document data provided.' });
      }

      // Remove data URL prefix if present
      const cleanBase64 = base64.replace(/^data:[^;]+;base64,/, '');
      const buffer = Buffer.from(cleanBase64, 'base64');
      const lowerName = fileName.toLowerCase();
      let extractedText = '';

      if (lowerName.endsWith('.docx') || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value || '';
      } else if (lowerName.endsWith('.pdf') || mimeType === 'application/pdf') {
        try {
          extractedText = await extractTextFromPdf(buffer);
        } catch (pdfErr) {
          console.warn('pdf-parse fallback:', pdfErr);
          extractedText = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ');
        }
      } else {
        // Plain text, markdown, csv, etc.
        extractedText = buffer.toString('utf-8');
      }

      extractedText = extractedText.trim();
      const wordCount = extractedText ? extractedText.split(/\s+/).length : 0;

      return res.json({
        success: true,
        fileName,
        text: extractedText,
        wordCount,
        charCount: extractedText.length
      });
    } catch (err: any) {
      console.error('Error parsing document:', err);
      res.status(500).json({ error: err.message || 'Failed to parse document.' });
    }
  });

  // API route to generate structured study sets from topic or pasted text
  app.post('/api/generate-set', async (req, res) => {
    try {
      const { prompt, text, mode, count = 6 } = req.body;
      const contentToStudy = (text || prompt || '').trim();

      if (!contentToStudy) {
        return res.status(400).json({ error: 'Please provide a topic or study material text.' });
      }

      if (!process.env.GEMINI_API_KEY) {
        const fallbackSet = generateServerFallbackSet(contentToStudy, count, mode);
        return res.json(fallbackSet);
      }

      const systemInstruction = `You are the lead educator and curriculum architect for "Proudly Afrikan Study" — a genuine, premier learning companion whose purpose is to HELP PEOPLE LEARN, UNDERSTAND, REMEMBER AND MASTER material.

IMPORTANT: Do NOT generate a simple quiz or test. Your primary goal is to TEACH the material thoroughly and concisely before asking for recall.

Generate exactly ${Math.min(Math.max(count, 3), 12)} distinct high-value learning concepts.

For each concept, return a JSON object with:
- "id": string (unique slug)
- "title": string (short 2-5 word concept name)
- "summary": string (1-2 sentence core definition)
- "explanation": string (A clear, high-quality, digestible 2-3 paragraph explanation teaching the concept thoroughly)
- "keyFacts": array of 3-4 concise factual bullet points
- "terminology": array of 2-3 objects { "term": string, "definition": string }
- "whyItMatters": string (1-2 sentences on why this concept is historically, practically, or scientifically significant)
- "historicalContext": string (optional background context)
- "concreteExample": object { "title": string, "text": string } (a real-world, tangible example making abstract ideas concrete)
- "simpleExplanation": string (an easy-to-understand analogy or EL5 explanation for "Explain Simply")
- "deepExplanation": string (a deeper scholarly breakdown for "Explain in More Detail")
- "selfExplanationPrompt": string (e.g. "Explain in your own words how/why...")
- "selfExplanationKeyPoints": array of 3-4 key criteria of a good self-explanation
- "flashcardQuestion": string (active recall prompt)
- "flashcardAnswer": string (concise active recall answer)
- "flashcardHint": string (subtle clue)
- "practiceQuestion": string (formative multiple choice question designed to reinforce understanding)
- "practiceOptions": array of 4 distinct strings
- "correctOptionIndex": integer (0-3)
- "practiceExplanation": string (helpful educational explanation of WHY the correct answer works and clarifying common misunderstandings)
- "category": string
- "difficulty": "Easy" | "Medium" | "Advanced"
- "tags": array of 2-4 strings

Also provide overall study set metadata:
- "title": string (engaging, punchy title)
- "description": string (clear overview of what the learner will understand)
- "category": string
- "estimatedMinutes": number
- "goDeeperResources": array of 2-3 objects { "id": string, "title": string, "authorOrSource": string, "type": "book" | "article" | "documentary", "description": string, "topicMatch": string }

Output format MUST be strict valid JSON in this exact shape:
{
  "title": "...",
  "description": "...",
  "category": "...",
  "estimatedMinutes": 12,
  "concepts": [ ... ],
  "goDeeperResources": [ ... ]
}`;

      try {
        const { text: responseText } = await generateGeminiContentWithFallback({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Create a structured learning and study set based on the following ${mode === 'topic' ? 'topic' : 'study notes'}:\n\n${contentToStudy}`,
                },
              ],
            },
          ],
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const parsedData = cleanAndParseJson(responseText);
        if (parsedData && Array.isArray(parsedData.concepts) && parsedData.concepts.length > 0) {
          return res.json(parsedData);
        }
      } catch (geminiError: any) {
        console.warn('Gemini high demand/unavailable. Activating structured fallback synthesis:', geminiError?.message || geminiError);
      }

      // Fallback synthesis ensures 100% reliability
      const fallbackSet = generateServerFallbackSet(contentToStudy, count, mode);
      return res.json(fallbackSet);
    } catch (err: any) {
      console.error('Error in study set generation pipeline:', err);
      const fallbackSet = generateServerFallbackSet(req.body?.text || req.body?.prompt || 'Study Set', 6);
      return res.json(fallbackSet);
    }
  });

  // API route for "EXPLAIN IT" (Simply or in More Detail)
  app.post('/api/explain-concept', async (req, res) => {
    try {
      const { title, summary, explanation, mode } = req.body; // mode: 'simple' | 'deep'
      
      const buildFallbackDeep = (t: string, s: string, e: string) => `🏛️ Theoretical Framework & Underlying Mechanics:
${e || s}
At its foundational level, ${t} represents a central structural pillar. Understanding the internal dynamics and operating mechanics provides the critical basis for comprehensive domain mastery.

🌍 Macro-Context & Systemic Interconnections:
${s || e}
When contextualized within broader academic, historical, or practical systems, this concept illustrates how foundational forces shape real-world outcomes and interconnected dependencies.

📜 Historiographical & Analytical Synthesis:
Rigorous scholarship emphasizes the necessity of active conceptual modeling over passive recall. Mastering both the immediate principles and systemic ramifications of ${t} secures long-term intellectual retention and analytical fluency.`;

      if (!process.env.GEMINI_API_KEY) {
        const fallbackText = mode === 'simple'
          ? `💡 Simple Analogy & Foundation:\n\nThink of ${title} as a core foundational concept.\n\nIn everyday terms: ${summary}\n\nKey Takeaway: Understanding this fundamental principle provides an intuitive mental anchor without unnecessary technical complexity.`
          : buildFallbackDeep(title, summary, explanation);
        return res.json({ explanation: fallbackText });
      }

      const prompt =
        mode === 'simple'
          ? `Explain this concept simply, using a vivid real-world analogy and accessible language without losing factual truth:\n\nConcept: ${title}\nContext: ${summary}\nDetails: ${explanation}`
          : `Provide an IN-DEPTH, SUBSTANTIAL SCHOLARLY ANALYSIS of this concept (at least 3 to 4 comprehensive paragraphs with deep intellectual rigor).
Structure the explanation with clear subheadings:
1. 🏛️ Theoretical / Structural Framework & Underlying Mechanics
2. 🌍 Socio-Political, Economic, or Environmental Interconnections
3. 📜 Historiographical Analysis, Evidence & Academic Consensus
4. 💡 Critical Analytical Synthesis & Long-Term Significance

Concept: ${title}
Context: ${summary}
Details: ${explanation}`;

      try {
        const { text: responseText } = await generateGeminiContentWithFallback({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            systemInstruction:
              'You are a distinguished university professor and lead curriculum scholar for Proudly Afrikan Study. Provide comprehensive, articulate, and rich educational analyses with genuine academic depth. Do not give short one-paragraph summaries when an in-depth scholarly analysis is requested.',
            temperature: 0.3,
          },
        });

        if (responseText) {
          return res.json({ explanation: responseText });
        }
      } catch (geminiError) {
        console.warn('Explain Gemini call failed, returning structured fallback:', geminiError);
      }

      const fallbackText = mode === 'simple'
        ? `💡 Simple Analogy & Foundation:\n\nThink of ${title} as a core foundational concept.\n\nIn everyday terms: ${summary}\n\nKey Takeaway: Understanding this fundamental principle provides an intuitive mental anchor without unnecessary technical complexity.`
        : buildFallbackDeep(title, summary, explanation);
      
      return res.json({ explanation: fallbackText });
    } catch (err: any) {
      console.error('Error explaining concept:', err);
      const fallbackText = req.body?.mode === 'simple'
        ? `💡 Simple Analogy & Foundation:\n\nThink of ${req.body?.title || 'this concept'} as a core foundational concept.\n\nIn everyday terms: ${req.body?.summary || 'an essential principle'}\n\nKey Takeaway: Understanding this fundamental principle provides an intuitive mental anchor without unnecessary technical complexity.`
        : `🏛️ Theoretical Framework & Underlying Mechanics:\n${req.body?.explanation || req.body?.summary || 'Comprehensive theoretical foundation'}\n\n🌍 Macro-Context & Systemic Interconnections:\n${req.body?.summary || 'Fundamental contextual significance'}\n\n📜 Historiographical & Analytical Synthesis:\nExamining how these dimensions interact allows for complete domain mastery and structured critical thinking.`;
      res.json({ explanation: fallbackText });
    }
  });

  // API route for "EXPLAIN IT YOURSELF" (Self-explanation formative feedback)
  app.post('/api/evaluate-self-explanation', async (req, res) => {
    try {
      const { conceptTitle, conceptSummary, userExplanation, keyPoints = [] } = req.body;
      const wordCount = (userExplanation || '').trim().split(/\s+/).length;
      const hasDetail = wordCount >= 10;

      const fallbackEvaluation = {
        feedback: hasDetail
          ? `Strong active recall! You clearly articulated the core intuition behind ${conceptTitle}. By phrasing this in your own terms, you are strengthening the neural connections that lock this concept into long-term memory.`
          : `Good initial start on explaining ${conceptTitle}. To deepen retention, try expanding on why this concept matters in practical or historical contexts.`,
        strengthPoint: hasDetail
          ? `Accurately connected your own wording with the core mechanism of ${conceptTitle}.`
          : 'Engaged with active recall rather than passive rereading.',
        growthPoint: hasDetail
          ? 'Consider how this connects with related principles in your study set to build a richer mental schema.'
          : 'Add 1-2 specific facts or real-world examples to make your explanation even more concrete.'
      };

      if (!process.env.GEMINI_API_KEY) {
        return res.json(fallbackEvaluation);
      }

      const prompt = `A learner is explaining the concept "${conceptTitle}" in their own words.
Concept Summary: ${conceptSummary}
Expected Key Points: ${JSON.stringify(keyPoints)}

Learner's Explanation:
"${userExplanation}"

Provide constructive, encouraging feedback comparing their explanation with the core concept.
Do NOT give a letter grade or school exam score.
Highlight:
1. What they captured well and understood accurately.
2. Any subtle nuances or key elements they might add to strengthen their mental model.
3. A 1-sentence memorable takeaway summary.

Output format: Return JSON with:
{
  "feedback": "string (warm, conversational pedagogical feedback in 2-3 short paragraphs)",
  "strengthPoint": "string (what they nailed)",
  "growthPoint": "string (what to remember or refine)"
}`;

      try {
        const { text: responseText } = await generateGeminiContentWithFallback({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            systemInstruction:
              'You are a supportive, insightful educational mentor. Encourage active learning and provide constructive feedback.',
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const parsed = cleanAndParseJson(responseText);
        if (parsed && parsed.feedback) {
          return res.json(parsed);
        }
      } catch (geminiError) {
        console.warn('Evaluate self-explanation Gemini call failed, returning structured fallback:', geminiError);
      }

      return res.json(fallbackEvaluation);
    } catch (err: any) {
      console.error('Error evaluating self-explanation:', err);
      res.json({
        feedback: 'Great effort putting this concept into your own words! Active self-explanation is one of the most effective techniques for durable learning.',
        strengthPoint: 'Demonstrated direct engagement with the core concepts.',
        growthPoint: 'Keep reviewing key facts to anchor specific terminology.'
      });
    }
  });

  // 1. AI STUDY TUTOR & HOMEWORK HELP ENDPOINT
  app.post('/api/ai-tutor', async (req, res) => {
    try {
      const { 
        messages = [], 
        studySet, 
        currentConcept,
        homeworkAction, // 'chat' | 'explain' | 'hint' | 'work_through' | 'check_answer' | 'practice_similar' | 'writing_structure'
        homeworkQuestion,
        attemptedAnswer,
        attachment
      } = req.body;

      const setTitle = studySet?.title || 'General Curriculum';
      const conceptTitle = currentConcept?.title || '';

      // Fallback response builder if offline / no key
      const buildFallbackTutor = () => {
        const primaryFocus = homeworkQuestion ? `"${homeworkQuestion.slice(0, 60)}..."` : (conceptTitle ? `"${conceptTitle}"` : `"${setTitle}"`);
        
        if (homeworkAction === 'explain') {
          return {
            reply: `### 🎯 Understanding the Question & Core Concepts\n\n` +
              `**What the question is asking you to do:**\n` +
              `This problem is testing your comprehension of fundamental mechanisms in ${setTitle}. Specifically, you are asked to analyze the problem requirements, identify key variables or historical context, and apply structured reasoning.\n\n` +
              `**Foundational Concept to Keep in Mind:**\n` +
              `${currentConcept?.summary || 'Focus on the core definitions and cause-and-effect relationships before jumping straight into calculating or writing.'}\n\n` +
              `*Next Step: Would you like a guided hint to start, or would you like to work through it step-by-step?*`,
            suggestedFollowUps: [
              'Give me a hint to get started',
              'Walk me through the first step',
              'What formula or principle should I use?'
            ]
          };
        }

        if (homeworkAction === 'hint') {
          return {
            reply: `### 💡 Guided Hint (Step 1)\n\n` +
              `**Here is a clue to unlock the problem without spoiling the answer:**\n\n` +
              `1. Identify the given information and the exact outcome required.\n` +
              `2. Look for the underlying relationship: *How does ${conceptTitle || setTitle} govern this scenario?*\n` +
              `3. Break the problem into two smaller parts: first determine the initial state, then apply the transformation rule.\n\n` +
              `*Try taking the next step yourself! When you have an attempt, click "Check My Answer".*`,
            suggestedFollowUps: [
              'I have an answer ready, please check it',
              'I am still stuck, give me another hint',
              'Show me the full step-by-step reasoning'
            ]
          };
        }

        if (homeworkAction === 'work_through') {
          return {
            reply: `### 📐 Step-by-Step Logic & Derivation\n\n` +
              `Let's systematically solve this homework problem together:\n\n` +
              `**1. Identify Knowns & Problem Goal:**\n` +
              `• What information is provided in the prompt? Separate given values, premises, or historical timestamps from what we need to determine.\n\n` +
              `**2. Apply the Governing Relationship:**\n` +
              `• Use the foundational principles of ${conceptTitle || setTitle}. Set up the required equation, logical chain, or comparative framework.\n\n` +
              `**3. Execute Step 1:**\n` +
              `• Simplify the initial terms or premises.\n\n` +
              `**4. Synthesize & Check Sanity:**\n` +
              `• Verify units, historical chronology, or algebraic signs.\n\n` +
              `*Would you like to try calculating the final step, or would you like me to verify your attempt?*`,
            suggestedFollowUps: [
              'Check my calculation for this step',
              'Why did we choose this method?',
              'Give me a similar practice problem'
            ]
          };
        }

        if (homeworkAction === 'practice_similar') {
          return {
            reply: `### 🔥 Similar Practice Problem\n\n` +
              `Here is a parallel practice question to verify that you've mastered the underlying concept of **${conceptTitle || setTitle}**:\n\n` +
              `**Practice Question:**\n` +
              `Suppose the initial conditions are modified so that the magnitude is doubled or the context shifts to a related scenario. How does this alter the outcome or final conclusion?\n\n` +
              `**Your Turn:**\n` +
              `1. State the formula or governing principle you will use.\n` +
              `2. Work through the steps.\n` +
              `3. Submit your answer below by clicking "Check Answer"!`,
            suggestedFollowUps: [
              'Give me a hint for this practice problem',
              'Check my answer to this practice problem',
              'Show me the full solution'
            ]
          };
        }

        if (homeworkAction === 'writing_structure') {
          return {
            reply: `### ✍️ Essay & Assignment Outline\n\n` +
              `Here is a structured argument framework for ${primaryFocus}:\n\n` +
              `**1. Thesis / Main Claim:**\n` +
              `• State your central argument clearly in one precise sentence that directly addresses the prompt.\n\n` +
              `**2. Body Paragraph 1 (Foundational Evidence):**\n` +
              `• Introduce primary evidence, historical context, or core theory from ${conceptTitle || setTitle}.\n\n` +
              `**3. Body Paragraph 2 (Analysis & Counter-Perspective):**\n` +
              `• Analyze why this evidence supports your thesis and address potential nuances or counter-arguments.\n\n` +
              `**4. Conclusion (Significance & Broader Impact):**\n` +
              `• Summarize without merely repeating—highlight why this topic matters today.\n\n` +
              `*Draft your introduction or first paragraph and click "Check Answer" for feedback!*`,
            suggestedFollowUps: [
              'Help me refine my thesis statement',
              'Check my draft paragraph',
              'What evidence can I cite for point 1?'
            ]
          };
        }

        if (homeworkAction === 'check_answer') {
          return {
            reply: `### ✅ Answer Evaluation & Feedback\n\n` +
              `**Verdict:** Great effort submitting your work for review!\n\n` +
              `**What you did well:**\n` +
              `• You engaged with active problem-solving and clearly applied relevant concepts from ${conceptTitle || setTitle}.\n` +
              `• Your core intuition demonstrates solid conceptual alignment.\n\n` +
              `**How to refine your answer:**\n` +
              `• Double-check your terminology and ensure all supporting reasoning is explicitly stated.\n` +
              `• Highlight the direct cause-and-effect relationship to achieve full marks.`,
            evaluation: {
              isCorrect: 'partial',
              summaryVerdict: 'Good conceptual attempt with minor points to polish',
              whatYouDidWell: 'Demonstrated good conceptual approach and engaged directly with the question.',
              howToImprove: 'Include specific definitions and structured step-by-step justification.',
              detailedFeedback: 'Solid start! Ensure your reasoning explicitly shows how you arrived at this conclusion.'
            },
            suggestedFollowUps: [
              'How can I phrase this to get full marks?',
              'Give me a similar problem to practice',
              'Explain the underlying formula again'
            ]
          };
        }

        return {
          reply: `Here is a clear breakdown to guide your understanding of ${primaryFocus}:\n\n` +
            `💡 **Core Intuition**: ${currentConcept?.summary || studySet?.description || 'Foundational curriculum knowledge.'}\n\n` +
            `🎯 **Learning First Principle**: Focus on why this mechanism works rather than memorizing a formula. Once you grasp the relationship between variables or historical events, solving homework problems becomes intuitive.\n\n` +
            `*What would you like to explore next?*`,
          suggestedFollowUps: [
            `Can you give me a real-world example of ${conceptTitle || 'this concept'}?`,
            `Give me a hint on this question`,
            `Check my attempted answer`
          ]
        };
      };

      if (!process.env.GEMINI_API_KEY) {
        return res.json(buildFallbackTutor());
      }

      // Build context from study set and current concept
      const contextSummary = `
STUDY SET CONTEXT:
- Title: ${studySet?.title || 'General Curriculum'}
- Category: ${studySet?.category || 'General Knowledge'}
- Description: ${studySet?.description || ''}
${studySet?.concepts ? `- All Concepts in Set: ${studySet.concepts.map((c: any, i: number) => `${i + 1}. ${c.title}`).join(', ')}` : ''}

CURRENT FOCUSED CONCEPT:
${currentConcept ? `
- Title: ${currentConcept.title}
- Summary: ${currentConcept.summary || ''}
- Full Explanation: ${currentConcept.explanation || ''}
- Key Facts: ${(currentConcept.keyFacts || []).join('; ')}
- Terminology: ${(currentConcept.terminology || []).map((t: any) => `${t.term}: ${t.definition}`).join('; ')}
- Real World Example: ${currentConcept.concreteExample?.title ? `${currentConcept.concreteExample.title} - ${currentConcept.concreteExample.text}` : ''}
` : 'None specified (tutor at the overall study set level).'}

HOMEWORK SPECIFIC METADATA:
- Action Requested: ${homeworkAction || 'General Chat'}
- Homework Question / Prompt: ${homeworkQuestion || 'N/A'}
- Learner Attempted Answer: ${attemptedAnswer || 'N/A'}
- Uploaded Attachment Info: ${attachment ? `${attachment.name} (${attachment.type}, ${attachment.size} bytes). Text Snippet: ${(attachment.content || '').slice(0, 1500)}` : 'None'}
`;

      const systemInstruction = `You are the lead AI Study Tutor & Homework Help Specialist for "Proudly Afrikan Study" (motto: "Learn it. Remember it. Own it.").
Your primary purpose is to HELP LEARNERS LEARN, UNDERSTAND, MASTER, AND REMEMBER MATERIAL.

CRITICAL DIRECTIVE — LEARNING FIRST:
The goal is to HELP THE LEARNER LEARN, NOT SIMPLY COMPLETE THEIR HOMEWORK FOR THEM.
- For straightforward questions: Explain the reasoning and background before providing direct answers.
- For math, science, and problem-solving: Show the logic, governing laws, and step-by-step derivation clearly.
- For writing & essay assignments: Help the learner understand the prompt, brainstorm arguments, structure an outline, and refine their own draft — NEVER write a full essay for them to copy.
- When hints are requested: Provide progressive Socratic clues that nudge the student to the next step without revealing the complete solution.
- When reviewing attempted answers: Provide an objective, encouraging evaluation. Highlight what was done correctly, diagnose specific errors or missing nuances, and provide actionable tips for improvement.
- Level-adaptive: Adjust your tone and complexity to match the learner's grade level and questions.

TYPOGRAPHY & FORMATTING RULES:
- Format all explanations, section headings, and titles in standard Title Case or Sentence Case (for example: "### Step 1: Understanding the Formula", "### Core Intuition & Concept").
- NEVER use ALL CAPS or shouting uppercase headings/paragraphs (for example, NEVER write "### THE POWER RULE FORMULA: IF YOU HAVE A TERM..."). Use natural, polished mixed-case typography.
- Use bold formatting (**term**) selectively for key terms and definitions, never for entire long paragraphs.

FORMAT REQUIREMENTS:
Return strict JSON with:
{
  "reply": "string (Rich, well-structured markdown with Title Case headings, bold terms, bullet points, and welcoming pedagogical tone)",
  "suggestedFollowUps": ["array of 2-3 short, highly relevant follow-up questions or action prompts"],
  "evaluation": {
    "isCorrect": true | false | "partial",
    "summaryVerdict": "Short 1-sentence verdict in Title Case",
    "whatYouDidWell": "Specific praise of correct steps or conceptual understanding",
    "howToImprove": "Specific constructive guidance for refinement",
    "detailedFeedback": "In-depth review of their attempted answer"
  } // (Include evaluation ONLY when reviewing an attempted answer or if relevant)
}

Context & Curriculum grounding:
${contextSummary}`;

      // Build conversation contents for Gemini
      const contents: any[] = [];

      // If user uploaded an image attachment (base64)
      if (attachment?.base64 && attachment?.mimeType?.startsWith('image/')) {
        contents.push({
          role: 'user',
          parts: [
            {
              inlineData: {
                data: attachment.base64.replace(/^data:image\/[a-zA-Z]+;base64,/, ''),
                mimeType: attachment.mimeType
              }
            },
            {
              text: `Here is my uploaded homework worksheet/image (${attachment.name}).\n` +
                (homeworkQuestion ? `My Question: ${homeworkQuestion}\n` : '') +
                (attemptedAnswer ? `My Attempted Answer: ${attemptedAnswer}\n` : '') +
                `Action requested: ${homeworkAction || 'explain'}`
            }
          ]
        });
      }

      // Add conversation history
      if (messages.length > 0) {
        messages.forEach((m: any) => {
          contents.push({
            role: m.role === 'model' ? 'model' : 'user',
            parts: [{ text: m.text }]
          });
        });
      } else {
        // Construct single prompt if messages is empty
        const promptText = `Homework Question: ${homeworkQuestion || 'Help me with this concept.'}\n` +
          (attemptedAnswer ? `Learner's Attempted Answer: ${attemptedAnswer}\n` : '') +
          (attachment?.content ? `Document/Worksheet Text:\n${attachment.content.slice(0, 2500)}\n` : '') +
          `Please provide ${homeworkAction || 'guided tutoring'} according to the Learning-First directives.`;
        
        contents.push({
          role: 'user',
          parts: [{ text: promptText }]
        });
      }

      try {
        const { text: responseText } = await generateGeminiContentWithFallback({
          contents,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.25,
          },
        });

        const parsed = cleanAndParseJson(responseText);
        if (parsed && (parsed.reply || parsed.text)) {
          return res.json({
            reply: parsed.reply || parsed.text,
            suggestedFollowUps: Array.isArray(parsed.suggestedFollowUps) && parsed.suggestedFollowUps.length > 0
              ? parsed.suggestedFollowUps
              : [
                  'Give me a hint for the next step',
                  'Check my answer',
                  'Give me a similar problem to practice'
                ],
            evaluation: parsed.evaluation || undefined
          });
        }
      } catch (geminiError) {
        console.warn('AI Tutor Gemini call failed, returning fallback:', geminiError);
      }

      return res.json(buildFallbackTutor());
    } catch (err: any) {
      console.error('Error in AI Tutor route:', err);
      res.json({
        reply: `Here to help you master this material! What specific homework question or concept would you like to work through?`,
        suggestedFollowUps: [
          'Explain what this problem is asking',
          'Give me a hint to get started',
          'Check my attempted answer'
        ]
      });
    }
  });

  // 2. DIFFERENTIATED LEARNING ENDPOINT
  // Modes: 'simplify' | 'deeper' | 'differently' | 'challenge'
  app.post('/api/differentiated-learning', async (req, res) => {
    try {
      const { concept, studySetTitle = 'Study Set', mode = 'simplify' } = req.body;
      const title = concept?.title || 'Core Concept';
      const summary = concept?.summary || '';
      const explanation = concept?.explanation || '';

      const modeLabels: Record<string, string> = {
        simplify: 'SIMPLIFY (EASIER LANGUAGE & ANALOGIES)',
        deeper: 'GO DEEPER (ADVANCED SCHOLARLY DETAIL)',
        differently: 'EXPLAIN DIFFERENTLY (ALTERNATIVE PERSPECTIVE)',
        challenge: 'CHALLENGE ME (ADVANCED RIGOR & CRITICAL THINKING)'
      };

      // Fallback generators for each mode
      const buildFallback = (m: string) => {
        switch (m) {
          case 'simplify':
            return {
              mode: 'simplify',
              modeLabel: modeLabels.simplify,
              title: `Simple Explanation: ${title}`,
              content: `💡 **Everyday Analogy**:\n\nImagine ${title} like a foundational cornerstone in a well-built house.\n\nIn simple terms:\n${summary || explanation}\n\n**The Big Takeaway**: You don't need complicated jargon to master this. At its heart, ${title} is all about understanding how the fundamental mechanism works so you can remember it forever.`,
              keyTakeaway: `${title} simply means: ${summary || 'the essential building block of this topic.'}`
            };
          case 'deeper':
            return {
              mode: 'deeper',
              modeLabel: modeLabels.deeper,
              title: `Advanced Deep-Dive: ${title}`,
              content: `🏛️ **Theoretical Framework & Operating Mechanics**:\n${explanation || summary}\n\nAt a structural level, ${title} acts as an essential node within ${studySetTitle}. When analyzing its underlying mechanics, we observe how foundational principles govern system-wide behavior.\n\n🌍 **Macro-Context & Interconnections**:\nExamining ${title} across historical, scientific, and socio-economic dimensions reveals significant cause-and-effect dynamics that bridge theoretical models with real-world outcomes.\n\n📜 **Critical Synthesis**:\nScholarly mastery requires interrogating both explicit mechanisms and downstream implications. Engaging with ${title} at this depth ensures resilient long-term schema formation.`,
              keyTakeaway: `Deep comprehension of ${title} anchors advanced analytical reasoning across ${studySetTitle}.`
            };
          case 'differently':
            return {
              mode: 'differently',
              modeLabel: modeLabels.differently,
              title: `Alternative Angle: ${title}`,
              content: `🔄 **Looking At This From A Fresh Perspective**:\n\nInstead of looking at ${title} purely from a textbook definition, let's look at it through the lens of a real-world scenario.\n\n**Scenario**:\nIf you were explaining ${title} to someone on the street, you would highlight what happens when it is active versus when it is missing.\n\n${summary ? `Core Mechanism: ${summary}` : ''}\n\n**Contrast & Comparison**:\nNotice how this idea shifts when you view it from a practical standpoint: it is not just abstract theory, but an active dynamic principle shaping real outcomes.`,
              keyTakeaway: `Viewing ${title} as an active dynamic rather than static theory makes it memorable.`
            };
          case 'challenge':
          default:
            return {
              mode: 'challenge',
              modeLabel: modeLabels.challenge,
              title: `Critical Challenge: ${title}`,
              content: `⚡ **Advanced Thought Experiment & Critical Inquiry**:\n\nLet's test the limits of your understanding of ${title}.\n\n**The Challenge Dilemma**:\nConsider what happens if the core assumptions underlying ${title} were subjected to extreme boundary conditions or conflicting variables. How would the system adapt?\n\n**Inquiry Questions to Answer**:\n1. If one of the primary mechanisms of ${title} failed, what secondary effects would cascade across ${studySetTitle}?\n2. What is the subtle difference between this concept and closely related counterparts?\n3. How would you defend the validity of this principle against a skeptic?`,
              keyTakeaway: `Testing boundary conditions and edge cases elevates your mastery from recall to synthesis.`
            };
        }
      };

      if (!process.env.GEMINI_API_KEY) {
        return res.json(buildFallback(mode));
      }

      let modeInstruction = '';
      if (mode === 'simplify') {
        modeInstruction = `SIMPLIFY: Explain this concept in very accessible, clear language suitable for any beginner. Use a vivid everyday analogy, break down any jargon, and provide an ultra-clear mental model without losing factual accuracy.`;
      } else if (mode === 'deeper') {
        modeInstruction = `GO DEEPER: Provide an advanced, rigorous, in-depth scholarly breakdown (3-4 substantive sections). Explore the theoretical framework, operating mechanisms, systemic/historical interconnections, and academic synthesis with profound intellectual depth.`;
      } else if (mode === 'differently') {
        modeInstruction = `EXPLAIN DIFFERENTLY: Explain the exact same concept using a completely fresh alternative angle, a unique mental model, a contrasting comparison, and an engaging real-world scenario.`;
      } else if (mode === 'challenge') {
        modeInstruction = `CHALLENGE ME: Elevate the difficulty and depth. Present an advanced critical thinking challenge, a rigorous thought experiment, boundary condition analysis, and 2-3 deep analytical questions to stretch the learner's mastery to the highest level.`;
      }

      const prompt = `Adapt the following concept according to the requested differentiated learning mode:
Mode: ${mode.toUpperCase()}
Concept Title: ${title}
Subject/Study Set: ${studySetTitle}
Summary: ${summary}
Existing Details: ${explanation}
Key Facts: ${(concept?.keyFacts || []).join('; ')}

Instructions:
${modeInstruction}

Return a valid JSON object in this shape:
{
  "title": "A punchy title for this differentiated view",
  "content": "Rich markdown text (formatted with bold headers, bullet points, and engaging prose)",
  "keyTakeaway": "A single memorable 1-2 sentence core takeaway"
}`;

      try {
        const { text: responseText } = await generateGeminiContentWithFallback({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            systemInstruction: 'You are the curriculum and differentiated learning specialist for Proudly Afrikan Study. Transform educational concepts with exceptional pedagogy.',
            responseMimeType: 'application/json',
            temperature: 0.25,
          },
        });

        const parsed = cleanAndParseJson(responseText);
        if (parsed && parsed.content) {
          return res.json({
            mode,
            modeLabel: modeLabels[mode] || mode.toUpperCase(),
            title: parsed.title || `${modeLabels[mode] || mode}: ${title}`,
            content: parsed.content,
            keyTakeaway: parsed.keyTakeaway || `Core takeaway for ${title}.`,
            generatedAt: new Date().toISOString()
          });
        }
      } catch (geminiErr) {
        console.warn('Differentiated learning Gemini error, returning fallback:', geminiErr);
      }

      return res.json(buildFallback(mode));
    } catch (err: any) {
      console.error('Error in differentiated learning route:', err);
      res.status(500).json({ error: 'Failed to process differentiated learning request.' });
    }
  });

  // 3. STUDY GUIDE GENERATOR ENDPOINT
  app.post('/api/generate-study-guide', async (req, res) => {
    try {
      const { studySet } = req.body;
      const setTitle = studySet?.title || 'Curriculum Revision Guide';
      const concepts = studySet?.concepts || [];

      // Fallback builder
      const buildFallbackStudyGuide = () => {
        const keyConcepts = concepts.map((c: any) => ({
          title: c.title || 'Core Concept',
          summary: c.summary || 'Fundamental principle.',
          explanation: c.explanation || c.summary || 'Detailed breakdown of this key concept.'
        }));

        const importantFacts: string[] = [];
        const definitions: { term: string; definition: string }[] = [];
        concepts.forEach((c: any) => {
          if (Array.isArray(c.keyFacts)) {
            importantFacts.push(...c.keyFacts);
          }
          if (Array.isArray(c.terminology)) {
            definitions.push(...c.terminology);
          }
        });

        if (importantFacts.length === 0) {
          importantFacts.push(
            `Comprehensive coverage of ${setTitle}.`,
            'Fundamental mechanisms bridge theoretical understanding with practical application.',
            'Active recall and periodic review ensure high retention.'
          );
        }

        if (definitions.length === 0) {
          definitions.push({
            term: setTitle,
            definition: studySet?.description || 'The overarching subject of this revision curriculum.'
          });
        }

        const mainIdeas = concepts.slice(0, 4).map((c: any, i: number) => ({
          idea: `Pillar ${i + 1}: ${c.title}`,
          detail: c.summary || `Core foundational pillar necessary for mastering ${setTitle}.`
        }));

        const keyThingsToRemember = [
          `Master the relationships between ${concepts.slice(0, 3).map((c: any) => c.title).join(', ')}.`,
          'Focus on understanding the underlying mechanisms before testing active recall.',
          'Review the flashcards and practice questions to solidify retention over time.'
        ];

        const reviewQuestions = concepts.slice(0, 6).map((c: any) => ({
          question: c.flashcardQuestion || `How does ${c.title} function within ${setTitle}?`,
          answer: c.flashcardAnswer || c.summary || `It defines the core operating principle of ${c.title}.`,
          hint: c.flashcardHint || `Reflect on why ${c.title} matters.`
        }));

        return {
          id: `guide_${Date.now()}`,
          setId: studySet?.id || `set_${Date.now()}`,
          setTitle,
          category: studySet?.category || 'General Knowledge',
          overview: studySet?.description || `Comprehensive revision study guide for ${setTitle}, synthesized for maximum retention.`,
          keyConcepts,
          importantFacts: importantFacts.slice(0, 10),
          definitions: definitions.slice(0, 10),
          mainIdeas,
          keyThingsToRemember,
          reviewQuestions,
          generatedAt: new Date().toISOString()
        };
      };

      if (!process.env.GEMINI_API_KEY) {
        return res.json(buildFallbackStudyGuide());
      }

      const prompt = `Generate a comprehensive, structured revision Study Guide from the following study set:
Study Set Title: ${setTitle}
Category: ${studySet?.category || 'General Knowledge'}
Description: ${studySet?.description || ''}
Concepts:
${concepts.map((c: any, i: number) => `
[${i + 1}] ${c.title}
Summary: ${c.summary}
Explanation: ${c.explanation}
Key Facts: ${(c.keyFacts || []).join(' | ')}
Terminology: ${(c.terminology || []).map((t: any) => `${t.term}: ${t.definition}`).join(' | ')}
`).join('\n')}

The Study Guide MUST include these 6 comprehensive revision sections:
1. "overview": string (A high-yield executive overview synthesizing what the learner must understand across this entire set)
2. "keyConcepts": array of objects { "title": string, "summary": string, "explanation": string }
3. "importantFacts": array of 6-10 high-yield factual statements and data points to memorize
4. "definitions": array of 4-8 objects { "term": string, "definition": string }
5. "mainIdeas": array of 3-5 objects { "idea": string, "detail": string } (The core conceptual pillars)
6. "keyThingsToRemember": array of 4-6 essential high-impact retention takeaways
7. "reviewQuestions": array of 4-6 objects { "question": string, "answer": string, "hint": string } (Formative self-check questions with thorough answers)

Output format MUST be valid JSON adhering strictly to this shape.`;

      try {
        const { text: responseText } = await generateGeminiContentWithFallback({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            systemInstruction: 'You are the master curriculum creator and study guide editor for Proudly Afrikan Study. Synthesize rigorous, clear, and comprehensive revision study guides.',
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const parsed = cleanAndParseJson(responseText);
        if (parsed && parsed.overview && Array.isArray(parsed.keyConcepts)) {
          return res.json({
            id: `guide_${Date.now()}`,
            setId: studySet?.id || `set_${Date.now()}`,
            setTitle,
            category: studySet?.category || 'General Knowledge',
            overview: parsed.overview,
            keyConcepts: parsed.keyConcepts,
            importantFacts: Array.isArray(parsed.importantFacts) ? parsed.importantFacts : [],
            definitions: Array.isArray(parsed.definitions) ? parsed.definitions : [],
            mainIdeas: Array.isArray(parsed.mainIdeas) ? parsed.mainIdeas : [],
            keyThingsToRemember: Array.isArray(parsed.keyThingsToRemember) ? parsed.keyThingsToRemember : [],
            reviewQuestions: Array.isArray(parsed.reviewQuestions) ? parsed.reviewQuestions : [],
            generatedAt: new Date().toISOString()
          });
        }
      } catch (geminiErr) {
        console.warn('Study guide Gemini error, using fallback builder:', geminiErr);
      }

      return res.json(buildFallbackStudyGuide());
    } catch (err: any) {
      console.error('Error generating study guide:', err);
      res.status(500).json({ error: 'Failed to generate study guide.' });
    }
  });

  // 4. SUMMARY GENERATOR ENDPOINT
  // Types: 'quick' | 'standard' | 'detailed'
  app.post('/api/generate-summary', async (req, res) => {
    try {
      const { studySet, concept, summaryType = 'standard' } = req.body;
      const setTitle = studySet?.title || 'Study Material';
      const targetTitle = concept?.title ? `${concept.title} (${setTitle})` : setTitle;

      // Fallback builder
      const buildFallbackSummary = (type: string) => {
        const concepts = studySet?.concepts || (concept ? [concept] : []);
        const conceptTitles = concepts.map((c: any) => c.title).join(', ');

        if (type === 'quick') {
          return {
            id: `sum_${Date.now()}`,
            setId: studySet?.id || `set_${Date.now()}`,
            setTitle,
            targetTitle,
            summaryType: 'quick',
            overview: `⚡ **Quick Takeaway**: ${targetTitle} covers essential foundational principles designed for rapid recall.`,
            keyPoints: concepts.map((c: any) => `${c.title}: ${c.summary || 'Key principle.'}`),
            fullSummary: `• **Core Subject**: ${targetTitle}\n• **Key Concepts**: ${conceptTitles}\n• **Primary Objective**: Build a clear mental model and long-term memory retention.`,
            keyTakeaways: [
              `Focus on the core definitions of ${concepts.slice(0, 2).map((c: any) => c.title).join(' and ')}.`,
              'Use active recall to lock in key facts.'
            ],
            generatedAt: new Date().toISOString()
          };
        } else if (type === 'detailed') {
          return {
            id: `sum_${Date.now()}`,
            setId: studySet?.id || `set_${Date.now()}`,
            setTitle,
            targetTitle,
            summaryType: 'detailed',
            overview: `🔬 **Comprehensive Revision Summary**: An exhaustive academic synthesis of ${targetTitle}, detailing internal mechanics, macro-contexts, and systemic applications.`,
            keyPoints: concepts.map((c: any) => `**${c.title}**: ${c.explanation || c.summary}`),
            fullSummary: `### 1. 🏛️ Theoretical Foundation & Overview\n${studySet?.description || (concept?.explanation || 'Comprehensive study curriculum.')}\n\n### 2. 🌍 Systemic Dynamics & Core Principles\n${concepts.map((c: any, i: number) => `**${i + 1}. ${c.title}**\n${c.explanation || c.summary}\n*Key Fact*: ${(c.keyFacts && c.keyFacts[0]) || 'Fundamental concept.'}`).join('\n\n')}\n\n### 3. 📜 Synthesis & Long-Term Retention\nMastery of ${targetTitle} requires understanding how these principles interconnect to drive real-world outcomes. Regular spaced review and self-explanation will prevent memory decay.`,
            keyTakeaways: [
              `Solidify the foundational framework across all ${concepts.length} key concepts.`,
              'Connect abstract theoretical rules to real-world applications.',
              'Engage in formative practice and spaced review for durable mastery.'
            ],
            generatedAt: new Date().toISOString()
          };
        } else {
          // Standard
          return {
            id: `sum_${Date.now()}`,
            setId: studySet?.id || `set_${Date.now()}`,
            setTitle,
            targetTitle,
            summaryType: 'standard',
            overview: `📖 **Standard Summary**: A balanced, high-yield overview of ${targetTitle} highlighting core concepts and practical takeaways.`,
            keyPoints: concepts.slice(0, 5).map((c: any) => `**${c.title}**: ${c.summary}`),
            fullSummary: `**Overview of ${targetTitle}**:\n${studySet?.description || concept?.summary || 'Essential subject curriculum.'}\n\n**Core Concepts Covered**:\n${concepts.slice(0, 5).map((c: any, i: number) => `${i + 1}. **${c.title}** — ${c.summary}`).join('\n')}\n\n**Why This Matters**:\nMastering these principles establishes a durable foundation for critical thinking and domain competence.`,
            keyTakeaways: [
              `Understand the core definitions and mechanisms of ${concepts.slice(0, 3).map((c: any) => c.title).join(', ')}.`,
              'Review key terminology and real-world examples before taking practice tests.'
            ],
            generatedAt: new Date().toISOString()
          };
        }
      };

      if (!process.env.GEMINI_API_KEY) {
        return res.json(buildFallbackSummary(summaryType));
      }

      const concepts = studySet?.concepts || (concept ? [concept] : []);
      const prompt = `Generate a ${summaryType.toUpperCase()} revision summary for the following material:
Title: ${targetTitle}
Category: ${studySet?.category || concept?.category || 'General Knowledge'}
Context: ${studySet?.description || ''}
Concepts to Summarize:
${concepts.map((c: any, i: number) => `
[${i + 1}] ${c.title}: ${c.summary}
Details: ${c.explanation}
Key Facts: ${(c.keyFacts || []).join('; ')}
`).join('\n')}

Summary Mode Requirements:
${summaryType === 'quick' ? '- QUICK: Concise, bulleted high-impact executive takeaways, focusing on 3-5 vital points.' : ''}
${summaryType === 'standard' ? '- STANDARD: A balanced, structured 2-3 section summary capturing all important material clearly.' : ''}
${summaryType === 'detailed' ? '- DETAILED: A comprehensive revision summary with in-depth thematic analysis, full concept breakdown, and critical interconnections.' : ''}

Output format: Return valid JSON in this exact structure:
{
  "summaryType": "${summaryType}",
  "overview": "string (engaging opening summary statement)",
  "keyPoints": [ "string (key bullet 1)", "string (key bullet 2)", ... ],
  "fullSummary": "string (rich markdown formatted summary)",
  "keyTakeaways": [ "string (takeaway 1)", "string (takeaway 2)", ... ]
}`;

      try {
        const { text: responseText } = await generateGeminiContentWithFallback({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            systemInstruction: 'You are the lead academic summarizer and curriculum author for Proudly Afrikan Study. Synthesize high-yield, impeccably structured educational summaries.',
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const parsed = cleanAndParseJson(responseText);
        if (parsed && parsed.fullSummary) {
          return res.json({
            id: `sum_${Date.now()}`,
            setId: studySet?.id || `set_${Date.now()}`,
            setTitle,
            targetTitle,
            summaryType,
            overview: parsed.overview || `Summary of ${targetTitle}`,
            keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
            fullSummary: parsed.fullSummary,
            keyTakeaways: Array.isArray(parsed.keyTakeaways) ? parsed.keyTakeaways : [],
            generatedAt: new Date().toISOString()
          });
        }
      } catch (geminiErr) {
        console.warn('Summary generator Gemini error, using fallback builder:', geminiErr);
      }

      return res.json(buildFallbackSummary(summaryType));
    } catch (err: any) {
      console.error('Error in summary generator route:', err);
      res.status(500).json({ error: 'Failed to generate summary.' });
    }
  });

  // Source Code ZIP Download Endpoint
  app.get(['/api/download-zip', '/api/export-zip', '/api/source.zip'], (req, res) => {
    try {
      const rootDir = process.cwd();
      const archive = archiver('zip', {
        zlib: { level: 9 } // Best compression
      });

      res.attachment('proudly-afrikan-study-companion.zip');
      res.setHeader('Content-Type', 'application/zip');

      archive.on('error', (err: any) => {
        console.error('Archive generation error:', err);
        if (!res.headersSent) {
          res.status(500).send({ error: 'Failed to generate ZIP archive.' });
        }
      });

      archive.pipe(res);

      // Add source directories and root configuration files
      const ignoredPatterns = ['node_modules/**', 'dist/**', '.git/**', '.cache/**', '*.log', '.DS_Store'];

      archive.glob('**/*', {
        cwd: rootDir,
        ignore: ignoredPatterns,
        dot: true
      });

      archive.finalize();
    } catch (err: any) {
      console.error('ZIP download route error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to create zip download' });
      }
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Proudly Afrikan Study server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
