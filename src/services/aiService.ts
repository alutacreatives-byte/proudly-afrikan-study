import { StudySet, StudyConcept } from '../types';

export interface GenerateSetParams {
  topic?: string;
  notesText?: string;
  count?: number;
  category?: string;
}

export class AIService {
  static async generateStudySet(params: GenerateSetParams): Promise<StudySet> {
    const { topic, notesText, count = 6, category = 'GENERAL KNOWLEDGE' } = params;
    const inputContent = (notesText || topic || '').trim();

    if (!inputContent) {
      throw new Error('Please provide a topic or study notes.');
    }

    try {
      const response = await fetch('/api/generate-set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: topic,
          text: notesText,
          mode: notesText ? 'notes' : 'topic',
          count: count,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const setId = `custom-${Date.now()}`;
        const concepts: StudyConcept[] = (data.concepts || []).map((c: any, index: number) => ({
          id: c.id || `${setId}-concept-${index + 1}`,
          setId: setId,
          title: c.title || `Concept ${index + 1}`,
          summary: c.summary || '',
          category: c.category || data.category || category || 'CUSTOM SET',
          difficulty: c.difficulty || 'Medium',
          tags: c.tags || [category || 'Custom'],
          explanation: c.explanation || c.summary || 'Core educational breakdown of this concept.',
          keyFacts: Array.isArray(c.keyFacts) ? c.keyFacts : [c.summary || 'Fundamental principle.'],
          terminology: Array.isArray(c.terminology) ? c.terminology : [],
          whyItMatters: c.whyItMatters || 'Understanding this foundational idea enables mastery of the broader topic.',
          historicalContext: c.historicalContext || '',
          concreteExample: c.concreteExample || {
            title: `Practical Case: ${c.title || `Concept ${index + 1}`}`,
            text: `Application of ${c.title || `this concept`} in real-world scenarios demonstrates its fundamental importance.`
          },
          simpleExplanation: c.simpleExplanation,
          deepExplanation: c.deepExplanation,
          selfExplanationPrompt: c.selfExplanationPrompt || `Explain in your own words what ${c.title} means and why it is significant.`,
          selfExplanationKeyPoints: c.selfExplanationKeyPoints || [c.summary],
          flashcardQuestion: c.flashcardQuestion || `What is the core principle of ${c.title}?`,
          flashcardAnswer: c.flashcardAnswer || c.summary,
          flashcardHint: c.flashcardHint,
          practiceQuestion: c.practiceQuestion || c.flashcardQuestion,
          practiceOptions: Array.isArray(c.practiceOptions) && c.practiceOptions.length === 4 
            ? c.practiceOptions 
            : [c.flashcardAnswer || c.summary, 'Alternative Context', 'Contrasting Theory', 'Unrelated Principle'],
          correctOptionIndex: typeof c.correctOptionIndex === 'number' ? c.correctOptionIndex : 0,
          practiceExplanation: c.practiceExplanation || `This is correct because ${c.summary || c.flashcardAnswer}.`,
        }));

        if (concepts.length > 0) {
          return {
            id: setId,
            title: data.title || topic || 'Custom Study Set',
            description: data.description || `Comprehensive learning set with ${concepts.length} key concepts.`,
            category: data.category || category || 'CUSTOM SET',
            estimatedMinutes: data.estimatedMinutes || Math.ceil(concepts.length * 2),
            isCustom: true,
            createdAt: new Date().toISOString(),
            concepts,
            goDeeperResources: data.goDeeperResources || []
          };
        }
      } else if (response.status === 400) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Please provide a valid topic or study notes.');
      }
    } catch (err: any) {
      if (err.message && err.message.includes('Please provide a valid topic')) {
        throw err;
      }
      console.warn('Backend generation encountered an issue, synthesizing structured study set via fallback builder:', err);
    }

    // Fallback generator if offline or no backend key
    return this.generateSmartFallback(inputContent, topic, category, count);
  }

  static async explainConcept(title: string, summary: string, explanation: string, mode: 'simple' | 'deep'): Promise<string> {
    try {
      const response = await fetch('/api/explain-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, summary, explanation, mode })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.explanation) return data.explanation;
      }
    } catch (e) {
      console.warn('Explain API call failed, using fallback:', e);
    }

    if (mode === 'simple') {
      return `💡 Simple Analogy & Foundation:\n\nThink of ${title} as a core foundational concept.\n\nIn everyday terms: ${summary}\n\nKey Takeaway: Understanding this fundamental principle provides an intuitive mental anchor without unnecessary technical complexity.`;
    } else {
      return `🏛️ Theoretical Framework & Underlying Mechanics:
${explanation || summary}
At its core, ${title} serves as an essential structural pillar within this subject matter. Deconstructing its internal mechanics allows learners to build a precise mental model of how foundational dynamics operate.

🌍 Macro-Context & Systemic Interconnections:
${summary || explanation}
When analyzed across wider academic, historical, or practical contexts, this concept illuminates the cause-and-effect relationships governing system behavior and domain complexity.

📜 Historiographical & Analytical Synthesis:
Mastery requires engaging beyond surface-level recall. Understanding both the underlying theoretical principles and real-world implications of ${title} cements deep, durable retention and critical analytical proficiency.`;
    }
  }

  static async evaluateSelfExplanation(
    conceptTitle: string,
    conceptSummary: string,
    userExplanation: string,
    keyPoints: string[] = []
  ): Promise<{ feedback: string; strengthPoint: string; growthPoint: string }> {
    try {
      const response = await fetch('/api/evaluate-self-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conceptTitle, conceptSummary, userExplanation, keyPoints })
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (e) {
      console.warn('Self-explanation evaluation failed, using fallback:', e);
    }

    const wordCount = userExplanation.trim().split(/\s+/).length;
    const hasDetail = wordCount >= 10;

    return {
      feedback: hasDetail
        ? `Great active self-explanation! You articulated the core idea of "${conceptTitle}" clearly. Expressing concepts in your own words cements deep neurological retention far more effectively than passive reading.`
        : `Good start! Try expanding on the specific mechanisms or examples of "${conceptTitle}" to lock the full concept into your long-term memory.`,
      strengthPoint: `You captured the central premise of the concept accurately.`,
      growthPoint: keyPoints[0] ? `Keep in mind: ${keyPoints[0]}` : `Think about how this applies in real-world situations.`
    };
  }

  private static generateSmartFallback(content: string, topic?: string, category: string = 'STUDY SET', requestedCount: number = 6): StudySet {
    const setId = `custom-${Date.now()}`;
    const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    const title = topic || (lines[0] && lines[0].length < 60 ? lines[0] : 'Custom Learning Set');
    const concepts: StudyConcept[] = [];

    const items = lines.slice(0, Math.min(lines.length, requestedCount));
    items.forEach((line, idx) => {
      let conceptName = `Concept ${idx + 1}`;
      let details = line;

      if (line.includes(':')) {
        const parts = line.split(':');
        conceptName = parts[0].replace(/^[-*•\d.]+\s*/, '').trim();
        details = parts.slice(1).join(':').trim();
      } else if (line.includes(' - ')) {
        const parts = line.split(' - ');
        conceptName = parts[0].replace(/^[-*•\d.]+\s*/, '').trim();
        details = parts.slice(1).join(' - ').trim();
      } else {
        conceptName = line.slice(0, 35) + (line.length > 35 ? '...' : '');
      }

      concepts.push({
        id: `${setId}-concept-${idx + 1}`,
        setId: setId,
        title: conceptName || `Concept ${idx + 1}`,
        summary: details || `Core knowledge for ${conceptName}.`,
        category: category,
        difficulty: 'Medium',
        tags: [category],
        explanation: `${details}. This concept represents a cornerstone understanding in this curriculum.`,
        keyFacts: [
          details,
          `Key principle within ${title}.`,
          `Essential foundation for subsequent learning.`
        ],
        whyItMatters: `Mastering ${conceptName} establishes a strong conceptual anchor for active problem-solving.`,
        concreteExample: {
          title: `Real-World Application of ${conceptName}`,
          text: `In practice, applying ${conceptName} ensures precision and consistency in understanding.`
        },
        simpleExplanation: `Think of this simply: ${details} It serves as the basic building block for understanding ${conceptName}.`,
        deepExplanation: `🏛️ Theoretical Framework & Underlying Mechanics:
${details}
At its foundational level, ${conceptName} operates as a key structural pillar within ${title}. Deconstructing its core mechanisms reveals how foundational rules interact to establish system-level behavior and clarity.

🌍 Macro-Context & Systemic Interconnections:
Examining ${conceptName} in broader context demonstrates how individual principles drive complex real-world outcomes, bridging abstract knowledge with tangible applications.

📜 Historiographical & Analytical Synthesis:
Rigorous conceptual modeling ensures durable retention. Understanding both the internal logic and external ramifications of ${conceptName} empowers advanced critical reasoning.`,
        selfExplanationPrompt: `Explain the meaning of ${conceptName} and why it matters in your own words.`,
        selfExplanationKeyPoints: [details],
        flashcardQuestion: `What is the core definition of ${conceptName}?`,
        flashcardAnswer: details,
        practiceQuestion: `Which statement best describes the fundamental principle of ${conceptName}?`,
        practiceOptions: [
          details,
          `An unrelated principle conflicting with ${conceptName}`,
          `A purely theoretical concept with no practical application`,
          `A legacy rule that was subsequently disproven`
        ],
        correctOptionIndex: 0,
        practiceExplanation: `This statement accurately conveys the core definition of ${conceptName}.`
      });
    });

    return {
      id: setId,
      title,
      description: `Structured learning set curated from study material with ${concepts.length} key concepts.`,
      category,
      estimatedMinutes: Math.ceil(concepts.length * 2),
      isCustom: true,
      createdAt: new Date().toISOString(),
      concepts,
    };
  }
}
