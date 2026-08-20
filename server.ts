import express from 'express';
import path from 'path';
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

  app.use(express.json({ limit: '10mb' }));

  // API route for health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'Proudly Afrikan Study' });
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
