export type DifficultyLevel = 'Easy' | 'Medium' | 'Advanced';

export type FlashcardRating = 'did_not_know' | 'almost' | 'knew_it' | 'easy';

export interface ConceptPerformance {
  conceptId: string;
  totalReviews: number;
  lastRating?: FlashcardRating;
  consecutiveConfident: number;
  needsReview: boolean;
  lastReviewedAt?: string;
  practiceCorrectCount: number;
  practiceTotalCount: number;
}

export interface ConceptTerminology {
  term: string;
  definition: string;
}

export interface ConceptConcreteExample {
  title: string;
  text: string;
  relevance?: string;
}

export interface VisualAid {
  type: 'timeline' | 'diagram' | 'map' | 'quote' | 'architecture' | 'comparison';
  title: string;
  description: string;
  items?: { label: string; value: string; detail?: string }[];
  quote?: { text: string; author: string; year?: string };
}

export interface GoDeeperResource {
  id: string;
  title: string;
  authorOrSource: string;
  type: 'book' | 'article' | 'primary_source' | 'documentary';
  description: string;
  topicMatch: string;
  externalUrl?: string;
}

export interface StudyConcept {
  id: string;
  setId: string;
  title: string;
  summary: string;
  category: string;
  difficulty: DifficultyLevel;
  tags: string[];

  // Deep Lesson & Teaching Material
  explanation: string;
  keyFacts: string[];
  terminology?: ConceptTerminology[];
  whyItMatters: string;
  historicalContext?: string;
  concreteExample?: ConceptConcreteExample;
  visualAid?: VisualAid;

  // Adaptive Explanations
  simpleExplanation?: string;
  deepExplanation?: string;

  // Active Self-Explanation ("Explain it yourself")
  selfExplanationPrompt?: string;
  selfExplanationKeyPoints?: string[];

  // Active Recall / Flashcards
  flashcardQuestion: string;
  flashcardAnswer: string;
  flashcardHint?: string;

  // Formative Practice (Learning & Feedback, not a scored quiz)
  practiceQuestion: string;
  practiceOptions: string[];
  correctOptionIndex: number;
  practiceExplanation: string;
}

export interface StudySet {
  id: string;
  title: string;
  description: string;
  category: string;
  isCustom?: boolean;
  createdAt: string;
  updatedAt?: string;
  estimatedMinutes: number;
  concepts: StudyConcept[];
  featured?: boolean;
  iconName?: string;
  goDeeperResources?: GoDeeperResource[];
}

export interface SubjectProgress {
  total: number;
  mastered: number;
  percentage: number;
}

export interface UserStats {
  sessionsCompleted: number;
  questionsAnswered: number;
  conceptsStudied: number;
  streakDays: number;
  lastStudyDate?: string;
  reviewsCompleted: number;
  subjectMastery: Record<string, SubjectProgress>;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatarInitials?: string;
  createdAt: string;
}

export interface UserStudyNote {
  id: string;
  userId: string;
  targetId: string;
  targetTitle: string;
  targetType: 'concept' | 'set' | 'general';
  category: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type AppView = 
  | 'home'
  | 'study'
  | 'learn'
  | 'flashcards'
  | 'practice'
  | 'review'
  | 'planner'
  | 'sets'
  | 'set-detail'
  | 'progress'
  | 'archive';

export interface SessionResult {
  setId?: string;
  setTitle: string;
  durationMinutes: number;
  totalConcepts: number;
  confidentCount: number;
  struggledCount: number;
  struggledConceptIds: string[];
  timestamp: string;
  mode: 'learn' | 'study' | 'flashcards' | 'practice' | 'review' | 'planner';
}

export type StudyPlanDuration = 5 | 10 | 20 | 30;

export interface StudyPlanRecommendation {
  durationMinutes: StudyPlanDuration;
  title: string;
  description: string;
  concepts: StudyConcept[];
  reviewCount: number;
  newCount: number;
  rationale: string;
}
