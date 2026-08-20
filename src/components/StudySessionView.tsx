import React, { useState } from 'react';
import { StudySet, StudyConcept } from '../types';
import { StorageService } from '../services/storageService';
import { AIService } from '../services/aiService';
import { 
  BookOpen, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  FileText, 
  Lightbulb, 
  ChevronRight, 
  Share2, 
  Layers, 
  Check, 
  ExternalLink,
  MessageSquare,
  Bookmark,
  Zap
} from 'lucide-react';

interface StudySessionViewProps {
  studySet: StudySet;
  initialConceptIndex?: number;
  onFinishLesson: (setId: string, completedConceptsCount: number) => void;
  onNavigateToFlashcards: (set: StudySet) => void;
  onNavigateToPractice: (set: StudySet) => void;
  onBack: () => void;
}

export const StudySessionView: React.FC<StudySessionViewProps> = ({
  studySet,
  initialConceptIndex = 0,
  onFinishLesson,
  onNavigateToFlashcards,
  onNavigateToPractice,
  onBack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialConceptIndex);
  const [understoodConcepts, setUnderstoodConcepts] = useState<Set<string>>(new Set());
  const [isCompleted, setIsCompleted] = useState(false);

  // "EXPLAIN IT" State
  const [explanationMode, setExplanationMode] = useState<'none' | 'simple' | 'deep'>('none');
  const [customExplanation, setCustomExplanation] = useState<string>('');
  const [isExplaining, setIsExplaining] = useState(false);

  // "EXPLAIN IT YOURSELF" State
  const [selfExplanationText, setSelfExplanationText] = useState('');
  const [isEvaluatingSelf, setIsEvaluatingSelf] = useState(false);
  const [selfFeedback, setSelfFeedback] = useState<{ feedback: string; strengthPoint: string; growthPoint: string } | null>(null);

  // Personal Notes State
  const currentConcept: StudyConcept | undefined = studySet.concepts[currentIndex];
  const [noteText, setNoteText] = useState(currentConcept ? StorageService.getNote(currentConcept.id) : '');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteSavedAlert, setNoteSavedAlert] = useState(false);
  const [noteErrorAlert, setNoteErrorAlert] = useState<string | null>(null);

  if (!currentConcept) {
    return (
      <div className="bg-white border-2 border-[#161616] p-8 text-center rounded-lg shadow-[4px_4px_0px_#161616]">
        <h2 className="font-display font-black text-2xl uppercase">No Concepts in this Study Set</h2>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-[#D92B8A] text-white font-display text-xs font-bold uppercase rounded tactile-btn">
          Return Home
        </button>
      </div>
    );
  }

  const handleNextConcept = () => {
    // Save note if modified and valid
    if (noteText.trim() && noteText.trim() !== StorageService.getNote(currentConcept.id)) {
      StorageService.saveNote({
        targetId: currentConcept.id,
        targetTitle: currentConcept.title,
        targetType: 'concept',
        category: currentConcept.category || studySet.category || 'General Knowledge',
        content: noteText.trim(),
      });
    }

    // Reset interactive states for next concept
    setExplanationMode('none');
    setCustomExplanation('');
    setSelfExplanationText('');
    setSelfFeedback(null);
    setNoteErrorAlert(null);
    setNoteSavedAlert(false);

    if (currentIndex < studySet.concepts.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setNoteText(StorageService.getNote(studySet.concepts[nextIdx].id));
    } else {
      setIsCompleted(true);
      onFinishLesson(studySet.id, understoodConcepts.size);
    }
  };

  const handlePrevConcept = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setExplanationMode('none');
      setCustomExplanation('');
      setSelfExplanationText('');
      setSelfFeedback(null);
      setNoteErrorAlert(null);
      setNoteSavedAlert(false);
      setNoteText(StorageService.getNote(studySet.concepts[prevIdx].id));
    }
  };

  const handleToggleUnderstood = () => {
    const updated = new Set(understoodConcepts);
    if (updated.has(currentConcept.id)) {
      updated.delete(currentConcept.id);
    } else {
      updated.add(currentConcept.id);
    }
    setUnderstoodConcepts(updated);
  };

  const handleRequestExplanation = async (mode: 'simple' | 'deep') => {
    if (explanationMode === mode) {
      setExplanationMode('none');
      return;
    }

    setExplanationMode(mode);

    // If pre-compiled explanation exists, use it
    if (mode === 'simple' && currentConcept.simpleExplanation) {
      setCustomExplanation(currentConcept.simpleExplanation);
      return;
    }
    if (mode === 'deep' && currentConcept.deepExplanation) {
      setCustomExplanation(currentConcept.deepExplanation);
      return;
    }

    setIsExplaining(true);
    const result = await AIService.explainConcept(
      currentConcept.title,
      currentConcept.summary,
      currentConcept.explanation,
      mode
    );
    setCustomExplanation(result);
    setIsExplaining(false);
  };

  const handleEvaluateSelfExplanation = async () => {
    if (!selfExplanationText.trim()) return;
    setIsEvaluatingSelf(true);
    const result = await AIService.evaluateSelfExplanation(
      currentConcept.title,
      currentConcept.summary,
      selfExplanationText,
      currentConcept.selfExplanationKeyPoints || [currentConcept.summary]
    );
    setSelfFeedback(result);
    setIsEvaluatingSelf(false);
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) {
      setNoteErrorAlert('Note cannot be empty');
      setTimeout(() => setNoteErrorAlert(null), 2500);
      return;
    }
    setIsSavingNote(true);
    const res = StorageService.saveNote({
      targetId: currentConcept.id,
      targetTitle: currentConcept.title,
      targetType: 'concept',
      category: currentConcept.category || studySet.category || 'General Knowledge',
      content: noteText.trim(),
    });

    if (res.success) {
      setNoteSavedAlert(true);
      setNoteErrorAlert(null);
      setTimeout(() => {
        setIsSavingNote(false);
        setNoteSavedAlert(false);
      }, 2000);
    } else {
      setIsSavingNote(false);
      setNoteErrorAlert(res.error || 'Failed to save note');
      setTimeout(() => setNoteErrorAlert(null), 2500);
    }
  };

  // LESSON COMPLETED SUMMARY SCREEN
  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        {/* Completion Header */}
        <div className="bg-[#FFFFFF] border-2 border-[#161616] p-6 sm:p-8 rounded-none shadow-[6px_6px_0px_#D92B8A] text-center space-y-4">
          <div className="inline-flex p-3.5 bg-[#FDEAF4] border-2 border-[#161616] rounded-full text-[#D92B8A]">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-[#D92B8A] uppercase tracking-widest">
              LEARNING STAGE COMPLETED
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase text-[#161616]">
              {studySet.title}
            </h1>
            <p className="text-sm sm:text-base text-[#6B6862] max-w-xl mx-auto font-medium">
              You have explored all {studySet.concepts.length} key concepts. Now lock them into long-term memory with active recall.
            </p>
          </div>

          {/* Concepts Mastered Mental Map List */}
          <div className="bg-[#FAF7F0] border-2 border-[#161616] p-4 text-left rounded-none space-y-2 mt-4">
            <span className="font-mono text-xs font-bold uppercase text-[#161616]">
              KEY CONCEPTS LEARNED IN THIS SET:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {studySet.concepts.map((c, idx) => (
                <div key={c.id} className="flex items-center gap-2 p-2 bg-white border border-[#161616] text-xs">
                  <span className="font-mono font-bold text-[#D92B8A]">{(idx + 1).toString().padStart(2, '0')}</span>
                  <span className="font-display font-bold text-[#161616] truncate">{c.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => onNavigateToFlashcards(studySet)}
              className="p-4 bg-[#D92B8A] text-white font-display text-sm font-black uppercase tracking-wider rounded-none tactile-btn flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>TEST RECALL: FLASHCARDS ↗</span>
            </button>

            <button
              onClick={() => onNavigateToPractice(studySet)}
              className="p-4 bg-[#161616] text-white font-display text-sm font-black uppercase tracking-wider rounded-none tactile-btn flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#FAF7F0]" />
              <span>PRACTISE & REINFORCE ↗</span>
            </button>
          </div>
        </div>

        {/* QUIZ CONNECTION (Optional CTA) */}
        <div className="bg-[#FAF7F0] border-2 border-[#161616] p-5 sm:p-6 rounded-none shadow-[4px_4px_0px_#161616] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#161616] text-[#FAF7F0] font-mono text-[10px] font-bold uppercase">
              <span>READY FOR THE BIG STAGE?</span>
            </div>
            <h3 className="font-display font-black text-lg uppercase text-[#161616]">
              FEEL READY TO TEST YOUR KNOWLEDGE?
            </h3>
            <p className="text-xs text-[#6B6862]">
              Take the competitive, timed test on the separate Proudly Afrikan Quiz platform.
            </p>
          </div>

          <a
            href="https://proudlyafrikan.com/quiz"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 bg-[#FFFFFF] border-2 border-[#161616] text-[#161616] hover:bg-[#D92B8A] hover:text-white font-display text-xs font-black uppercase tracking-wider rounded-none shadow-[2px_2px_0px_#161616] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>TAKE THE PROUDLY AFRIKAN QUIZ →</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="text-center">
          <button
            onClick={onBack}
            className="text-xs font-mono font-bold uppercase tracking-wider text-[#6B6862] hover:text-[#161616] underline"
          >
            ← Return to Study Sets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between border-b-2 border-[#161616] pb-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase text-[#6B6862] hover:text-[#161616] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Lesson</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#D92B8A]">
            CONCEPT {(currentIndex + 1).toString().padStart(2, '0')} / {studySet.concepts.length.toString().padStart(2, '0')}
          </span>
          <div className="w-24 sm:w-32 h-2 bg-[#F0EAE0] border border-[#161616] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#D92B8A] transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / studySet.concepts.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* KEY CONCEPTS MENTAL MAP (Horizontal Index) */}
      <div className="bg-[#FAF7F0] border-2 border-[#161616] p-3 rounded-none shadow-[2px_2px_0px_#161616] overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <span className="font-mono text-[10px] font-bold uppercase text-[#6B6862] mr-1">
            KEY CONCEPTS:
          </span>
          {studySet.concepts.map((c, idx) => {
            const isCurrent = idx === currentIndex;
            const isUnderstood = understoodConcepts.has(c.id);
            return (
              <button
                key={c.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setExplanationMode('none');
                  setCustomExplanation('');
                  setSelfExplanationText('');
                  setSelfFeedback(null);
                  setNoteText(StorageService.getNote(c.id));
                }}
                className={`px-2.5 py-1 text-xs font-mono font-bold uppercase rounded border transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-[#D92B8A] text-white border-[#161616] shadow-[1.5px_1.5px_0px_#161616]'
                    : isUnderstood
                    ? 'bg-white text-[#161616] border-[#161616]'
                    : 'bg-[#F0EAE0] text-[#6B6862] border-transparent hover:border-[#161616]'
                }`}
              >
                <span>{(idx + 1).toString().padStart(2, '0')}</span>
                <span className="font-display font-bold max-w-[120px] truncate">{c.title}</span>
                {isUnderstood && <Check className="w-3 h-3 text-green-600 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN LESSON CARD */}
      <article className="bg-[#FFFFFF] border-2 border-[#161616] rounded-none shadow-[5px_5px_0px_#161616] p-6 sm:p-8 space-y-6">
        {/* Concept Title & Meta Badges */}
        <div className="border-b-2 border-[#161616]/20 pb-4 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#161616] text-[#FAF7F0] font-mono text-[10px] font-bold uppercase">
                {currentConcept.category || studySet.category || 'General Knowledge'}
              </span>
              <span className="px-2 py-0.5 bg-[#FAF7F0] border border-[#161616] font-mono text-[10px] font-bold uppercase text-[#161616]">
                {currentConcept.difficulty}
              </span>
            </div>

            <button
              onClick={handleToggleUnderstood}
              className={`px-3 py-1 text-xs font-display font-black uppercase rounded border transition-all flex items-center gap-1.5 ${
                understoodConcepts.has(currentConcept.id)
                  ? 'bg-green-600 text-white border-[#161616] shadow-[1.5px_1.5px_0px_#161616]'
                  : 'bg-[#FAF7F0] text-[#161616] border-[#161616] hover:bg-[#F0EAE0]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{understoodConcepts.has(currentConcept.id) ? 'UNDERSTOOD ✓' : 'MARK AS UNDERSTOOD'}</span>
            </button>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase text-[#161616] tracking-tight pt-1">
            {currentConcept.title}
          </h1>

          <p className="text-base sm:text-lg font-bold text-[#D92B8A] leading-snug">
            {currentConcept.summary}
          </p>
        </div>

        {/* 1. Clear Digestible Explanation */}
        <section className="space-y-3">
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#6B6862] flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#D92B8A]" />
            <span>CORE LESSON & CONTEXT</span>
          </h2>
          <div className="text-base sm:text-lg text-[#161616] leading-relaxed space-y-4 font-normal">
            <p className="whitespace-pre-line">{currentConcept.explanation}</p>
            {currentConcept.historicalContext && (
              <div className="p-4 bg-[#FAF7F0] border-l-4 border-[#D92B8A] text-sm sm:text-base text-[#2C2C2A] space-y-1">
                <span className="font-bold font-mono text-xs uppercase text-[#D92B8A] block">Historical Context:</span>
                <p className="italic leading-relaxed">{currentConcept.historicalContext}</p>
              </div>
            )}
          </div>
        </section>

        {/* 2. Key Facts Cards */}
        {Boolean(currentConcept.keyFacts && currentConcept.keyFacts.length > 0) && (
          <section className="space-y-3 pt-2">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#6B6862] flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#D92B8A]" />
              <span>KEY FACTS TO REMEMBER</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentConcept.keyFacts.map((fact, idx) => (
                <div key={idx} className="p-3.5 bg-[#FAF7F0] border-2 border-[#161616] rounded-none flex items-start gap-3 shadow-[2px_2px_0px_#161616]">
                  <span className="font-mono font-bold text-sm text-[#D92B8A] mt-0.5">
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                  <p className="text-sm sm:text-base text-[#161616] font-medium leading-relaxed">
                    {fact}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Important Terminology */}
        {Boolean(currentConcept.terminology && currentConcept.terminology.length > 0) && (
          <section className="space-y-3 pt-2">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#6B6862] flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-[#D92B8A]" />
              <span>KEY TERMINOLOGY</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentConcept.terminology.map((t, idx) => (
                <div key={idx} className="p-4 bg-white border-2 border-[#161616] rounded-none shadow-[2px_2px_0px_#161616]">
                  <span className="font-display font-black text-sm uppercase text-[#D92B8A] block mb-1.5">
                    {t.term}
                  </span>
                  <p className="text-xs sm:text-sm text-[#2C2C2A] font-normal leading-relaxed">
                    {t.definition}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Why This Matters / Relevance */}
        {Boolean(currentConcept.whyItMatters) && (
          <section className="p-4 sm:p-5 bg-[#FDEAF4] border-2 border-[#161616] rounded-none space-y-2 shadow-[2px_2px_0px_#161616]">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#D92B8A] flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" />
              <span>WHY THIS MATTERS</span>
            </h2>
            <p className="text-sm sm:text-base text-[#161616] font-semibold leading-relaxed">
              {currentConcept.whyItMatters}
            </p>
          </section>
        )}

        {/* 5. Concrete Real-World Example */}
        {Boolean(currentConcept.concreteExample) && (
          <section className="p-4 sm:p-5 bg-[#FAF7F0] border-2 border-[#161616] rounded-none space-y-2 shadow-[2px_2px_0px_#161616]">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#161616] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D92B8A]" />
                <span>CONCRETE EXAMPLE</span>
              </h2>
              <span className="font-mono text-xs font-bold text-[#D92B8A] uppercase">
                {currentConcept.concreteExample?.title}
              </span>
            </div>
            <p className="text-sm sm:text-base text-[#2C2C2A] leading-relaxed font-normal">
              {currentConcept.concreteExample?.text}
            </p>
          </section>
        )}

        {/* 6. Visual Learning (Diagram / Timeline / Architecture) */}
        {Boolean(currentConcept.visualAid) && (
          <section className="p-4 sm:p-5 bg-white border-2 border-[#161616] rounded-none shadow-[3px_3px_0px_#161616] space-y-3">
            <div className="flex items-center justify-between border-b border-[#161616]/20 pb-2">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#161616] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#D92B8A]" />
                <span>VISUAL LEARNING: {currentConcept.visualAid?.title}</span>
              </h2>
              <span className="font-mono text-xs bg-[#FAF7F0] px-2.5 py-0.5 border border-[#161616] uppercase font-bold">
                {currentConcept.visualAid?.type}
              </span>
            </div>

            {currentConcept.visualAid?.quote ? (
              <blockquote className="p-4 bg-[#FAF7F0] border-l-4 border-[#161616] italic text-base sm:text-lg text-[#161616] space-y-1.5">
                <p>"{currentConcept.visualAid.quote.text}"</p>
                <footer className="not-italic font-mono text-xs font-bold text-[#D92B8A] pt-1">
                  — {currentConcept.visualAid.quote.author} {currentConcept.visualAid.quote.year && `(${currentConcept.visualAid.quote.year})`}
                </footer>
              </blockquote>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {currentConcept.visualAid?.items?.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-[#FAF7F0] border border-[#161616] space-y-1">
                    <span className="font-mono text-xs font-bold text-[#D92B8A] uppercase block">{item.label}</span>
                    <span className="font-display font-black text-sm sm:text-base uppercase text-[#161616] block">{item.value}</span>
                    {item.detail && <p className="text-xs sm:text-sm text-[#6B6862] leading-normal">{item.detail}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 7. "EXPLAIN IT" Interactive Tool */}
        <section className="pt-3 border-t-2 border-[#161616]/20 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-xs font-bold uppercase text-[#161616] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#D92B8A]" />
              <span>NEED DEEPER CLARITY?</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRequestExplanation('simple')}
                className={`px-4 py-2 font-display text-xs sm:text-sm font-black uppercase rounded border-2 transition-all ${
                  explanationMode === 'simple'
                    ? 'bg-[#D92B8A] text-white border-[#161616] shadow-[2px_2px_0px_#161616]'
                    : 'bg-[#FFFFFF] text-[#161616] border-[#161616] hover:bg-[#F0EAE0]'
                }`}
              >
                EXPLAIN SIMPLY
              </button>

              <button
                onClick={() => handleRequestExplanation('deep')}
                className={`px-4 py-2 font-display text-xs sm:text-sm font-black uppercase rounded border-2 transition-all ${
                  explanationMode === 'deep'
                    ? 'bg-[#161616] text-[#FAF7F0] border-[#161616] shadow-[2px_2px_0px_#D92B8A]'
                    : 'bg-[#FFFFFF] text-[#161616] border-[#161616] hover:bg-[#F0EAE0]'
                }`}
              >
                EXPLAIN IN MORE DETAIL
              </button>
            </div>
          </div>

          {/* Explanation Output Area */}
          {explanationMode !== 'none' && (
            <div className="p-5 sm:p-6 bg-[#FAF7F0] border-2 border-[#161616] rounded-none space-y-3 shadow-[4px_4px_0px_#161616] animate-fadeIn">
              <div className="flex items-center justify-between border-b-2 border-[#161616]/20 pb-2">
                <span className="font-mono text-xs sm:text-sm font-bold uppercase text-[#D92B8A]">
                  {explanationMode === 'simple' ? '💡 SIMPLE ANALOGY & BREAKDOWN' : '🔬 IN-DEPTH SCHOLARLY ANALYSIS'}
                </span>
                <button
                  onClick={() => setExplanationMode('none')}
                  className="font-mono text-xs font-bold text-[#161616] hover:text-[#D92B8A] uppercase px-2.5 py-1 bg-white border border-[#161616] rounded shadow-[1px_1px_0px_#161616]"
                >
                  Close
                </button>
              </div>

              {isExplaining ? (
                <div className="py-6 text-center font-mono text-sm text-[#6B6862] flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D92B8A] animate-spin" />
                  <span>Synthesizing clear explanation...</span>
                </div>
              ) : (
                <div className="text-base sm:text-lg text-[#161616] leading-relaxed font-normal space-y-4">
                  {customExplanation.split('\n\n').map((paragraph, pIdx) => {
                    const trimmed = paragraph.trim();
                    if (!trimmed) return null;
                    const isHeader = trimmed.startsWith('🏛️') || trimmed.startsWith('🌍') || trimmed.startsWith('📜') || trimmed.startsWith('👑') || trimmed.startsWith('🪙') || trimmed.startsWith('🚢') || trimmed.startsWith('⚖️') || trimmed.startsWith('🎓') || trimmed.startsWith('🌊') || trimmed.startsWith('🧬') || trimmed.startsWith('🌿') || trimmed.startsWith('📖') || trimmed.startsWith('🗣️') || trimmed.startsWith('💡') || trimmed.startsWith('🔬') || trimmed.startsWith('1.') || trimmed.startsWith('2.') || trimmed.startsWith('3.') || trimmed.startsWith('4.');
                    
                    return (
                      <p key={pIdx} className={`whitespace-pre-line leading-relaxed ${isHeader ? 'font-medium' : ''}`}>
                        {trimmed}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>

        {/* 8. "EXPLAIN IT YOURSELF" (Active Self-Explanation) */}
        <section className="pt-3 border-t-2 border-[#161616]/20 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#161616] flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#D92B8A]" />
              <span>EXPLAIN IT YOURSELF (ACTIVE RECALL)</span>
            </h2>
            <span className="font-mono text-xs text-[#6B6862] uppercase font-bold">
              NOT GRADED • BUILDS RETENTION
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#6B6862] leading-normal font-medium">
            {currentConcept.selfExplanationPrompt || `Explain "${currentConcept.title}" in your own words. Teaching or articulating concepts cements true mastery.`}
          </p>

          <div className="space-y-3">
            <textarea
              value={selfExplanationText}
              onChange={(e) => setSelfExplanationText(e.target.value)}
              placeholder="Type your explanation here in your own words..."
              rows={4}
              className="w-full p-3.5 bg-[#FAF7F0] border-2 border-[#161616] text-base text-[#161616] focus:outline-none focus:bg-white resize-none leading-relaxed"
            />

            <div className="flex justify-end">
              <button
                onClick={handleEvaluateSelfExplanation}
                disabled={!selfExplanationText.trim() || isEvaluatingSelf}
                className="px-5 py-2.5 bg-[#161616] text-white font-display text-xs sm:text-sm font-black uppercase rounded disabled:opacity-50 tactile-btn flex items-center gap-2 shadow-[2px_2px_0px_#161616]"
              >
                {isEvaluatingSelf ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Reviewing your explanation...</span>
                  </>
                ) : (
                  <>
                    <span>CHECK MY UNDERSTANDING</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Self-Explanation Constructive Feedback Area */}
          {selfFeedback && (
            <div className="p-5 sm:p-6 bg-[#FDEAF4] border-2 border-[#161616] rounded-none space-y-3 mt-3 shadow-[3px_3px_0px_#161616] animate-fadeIn">
              <span className="font-mono text-xs sm:text-sm font-bold uppercase text-[#D92B8A] block">
                FEEDBACK ON YOUR EXPLANATION
              </span>
              <p className="text-base sm:text-lg text-[#161616] leading-relaxed font-normal whitespace-pre-line">
                {selfFeedback.feedback}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t-2 border-[#161616]/20">
                <div className="p-3 bg-white border-2 border-[#161616] text-sm">
                  <span className="font-mono font-bold text-green-700 block text-xs uppercase mb-1">What you nailed:</span>
                  <span className="text-[#161616] leading-relaxed font-medium">{selfFeedback.strengthPoint}</span>
                </div>
                <div className="p-3 bg-white border-2 border-[#161616] text-sm">
                  <span className="font-mono font-bold text-[#D92B8A] block text-xs uppercase mb-1">Keep in mind:</span>
                  <span className="text-[#161616] leading-relaxed font-medium">{selfFeedback.growthPoint}</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 9. Personal Notes */}
        <section className="pt-3 border-t-2 border-[#161616]/20 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#161616] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#6B6862]" />
              <span>MY PERSONAL STUDY NOTES</span>
            </h2>
            {noteSavedAlert && (
              <span className="font-mono text-xs text-green-700 font-bold uppercase animate-fadeIn">
                Saved ✓
              </span>
            )}
            {noteErrorAlert && (
              <span className="font-mono text-xs text-red-600 font-bold uppercase animate-fadeIn">
                {noteErrorAlert}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onBlur={handleSaveNote}
              placeholder="Add your personal memory hook, connection, or note for this concept..."
              className="flex-1 p-3 bg-[#FAF7F0] border-2 border-[#161616] text-sm sm:text-base text-[#161616] focus:bg-white focus:outline-none"
            />
            <button
              onClick={handleSaveNote}
              className="px-4 py-2 bg-[#FFFFFF] border-2 border-[#161616] font-display text-xs sm:text-sm font-black uppercase hover:bg-[#F0EAE0] shadow-[2px_2px_0px_#161616]"
            >
              SAVE NOTE
            </button>
          </div>
        </section>
      </article>

      {/* BOTTOM CONCEPT NAVIGATION CONTROLS */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={handlePrevConcept}
          disabled={currentIndex === 0}
          className="px-4 py-2.5 bg-white border-2 border-[#161616] font-display text-xs font-black uppercase tracking-wider rounded disabled:opacity-30 tactile-btn flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>PREVIOUS CONCEPT</span>
        </button>

        <button
          onClick={handleNextConcept}
          className="px-6 py-2.5 bg-[#D92B8A] text-white font-display text-xs sm:text-sm font-black uppercase tracking-wider rounded tactile-btn flex items-center gap-2"
        >
          <span>{currentIndex === studySet.concepts.length - 1 ? 'FINISH LESSON' : 'NEXT CONCEPT'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
