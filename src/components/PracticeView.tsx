import React, { useState } from 'react';
import { StudySet, StudyConcept } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  HelpCircle, 
  Sparkles,
  BookOpen,
  RotateCcw,
  Check,
  ExternalLink,
  Layers
} from 'lucide-react';

interface PracticeViewProps {
  studySet: StudySet;
  onBack: () => void;
  onRecordAnswer: (conceptId: string, isCorrect: boolean) => void;
  onCompletePractice: (result: { total: number; reinforced: number; needsReview: number }) => void;
  onNavigateToFlashcards?: (set: StudySet) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({
  studySet,
  onBack,
  onRecordAnswer,
  onCompletePractice,
  onNavigateToFlashcards,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [reinforcedIds, setReinforcedIds] = useState<Set<string>>(new Set());
  const [reviewIds, setReviewIds] = useState<Set<string>>(new Set());
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const concepts = studySet.concepts;
  const currentConcept = concepts[currentIndex];
  const totalQuestions = concepts.length;

  const handleSelectOption = (optionIndex: number) => {
    if (isAnswered || !currentConcept) return;

    setSelectedOption(optionIndex);
    setIsAnswered(true);

    const isCorrect = optionIndex === currentConcept.correctOptionIndex;
    onRecordAnswer(currentConcept.id, isCorrect);

    if (isCorrect) {
      setReinforcedIds(prev => new Set(prev).add(currentConcept.id));
    } else {
      setReviewIds(prev => new Set(prev).add(currentConcept.id));
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      onCompletePractice({
        total: totalQuestions,
        reinforced: reinforcedIds.size + (selectedOption === currentConcept?.correctOptionIndex ? 1 : 0),
        needsReview: reviewIds.size + (selectedOption !== currentConcept?.correctOptionIndex ? 1 : 0),
      });
    }
  };

  if (!currentConcept) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="font-display font-black text-2xl uppercase">No practice questions available</h2>
        <button onClick={onBack} className="px-5 py-2 bg-[#D92B8A] text-white rounded font-display">
          RETURN TO SETS
        </button>
      </div>
    );
  }

  const isCorrect = selectedOption === currentConcept.correctOptionIndex;
  const progressPercentage = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // FORMATIVE PRACTICE COMPLETION SUMMARY SCREEN
  if (isCompleted) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 pb-16">
        <div className="bg-[#FFFFFF] border-2 border-[#161616] p-6 sm:p-8 rounded-none shadow-[6px_6px_0px_#161616] text-center space-y-5">
          <div className="inline-flex p-3.5 bg-[#FDEAF4] border-2 border-[#161616] rounded-full text-[#D92B8A]">
            <Sparkles className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-[#D92B8A] uppercase tracking-widest">
              FORMATIVE PRACTICE COMPLETE
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase text-[#161616]">
              Concept Reinforcement Summary
            </h1>
            <p className="text-sm text-[#6B6862] max-w-lg mx-auto font-medium">
              Practicing application strengthens long-term comprehension and mental models.
            </p>
          </div>

          {/* Breakdown of Concepts Reinforced vs Scheduled for Review */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
            <div className="p-4 bg-[#FAF7F0] border-2 border-[#161616] space-y-2">
              <span className="font-mono text-xs font-bold text-green-700 uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>CONCEPTS REINFORCED ({reinforcedIds.size})</span>
              </span>
              <div className="space-y-1">
                {Array.from(reinforcedIds).map(id => {
                  const c = concepts.find(item => item.id === id);
                  return (
                    <div key={id} className="text-xs text-[#161616] font-medium truncate">
                      • {c?.title || id}
                    </div>
                  );
                })}
                {reinforcedIds.size === 0 && (
                  <p className="text-xs text-[#6B6862] italic">None in this session.</p>
                )}
              </div>
            </div>

            <div className="p-4 bg-[#FAF7F0] border-2 border-[#161616] space-y-2">
              <span className="font-mono text-xs font-bold text-[#D92B8A] uppercase flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>QUEUED FOR SPACED REVIEW ({reviewIds.size})</span>
              </span>
              <div className="space-y-1">
                {Array.from(reviewIds).map(id => {
                  const c = concepts.find(item => item.id === id);
                  return (
                    <div key={id} className="text-xs text-[#161616] font-medium truncate">
                      • {c?.title || id}
                    </div>
                  );
                })}
                {reviewIds.size === 0 && (
                  <p className="text-xs text-green-700 italic">All concepts demonstrated strong understanding!</p>
                )}
              </div>
            </div>
          </div>

          {/* Next Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {onNavigateToFlashcards && (
              <button
                onClick={() => onNavigateToFlashcards(studySet)}
                className="flex-1 p-3.5 bg-[#D92B8A] text-white font-display text-xs font-black uppercase tracking-wider rounded-none tactile-btn flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>ACTIVE RECALL FLASHCARDS →</span>
              </button>
            )}

            <button
              onClick={onBack}
              className="flex-1 p-3.5 bg-[#161616] text-white font-display text-xs font-black uppercase tracking-wider rounded-none tactile-btn flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-[#FAF7F0]" />
              <span>RETURN TO STUDY SET</span>
            </button>
          </div>
        </div>

        {/* QUIZ CONNECTION (Optional CTA) */}
        <div className="bg-[#FAF7F0] border-2 border-[#161616] p-5 sm:p-6 rounded-none shadow-[4px_4px_0px_#161616] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#161616] text-[#FAF7F0] font-mono text-[10px] font-bold uppercase">
              <span>READY FOR A TIMED CHALLENGE?</span>
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
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Top Header & Breadcrumb */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#161616] hover:text-[#D92B8A] uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>EXIT PRACTICE</span>
          </button>

          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#161616]">
            <span className="px-2.5 py-0.5 bg-white border border-[#161616] shadow-[1px_1px_0px_#161616]">
              QUESTION {currentIndex + 1} OF {totalQuestions}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-[#FAF7F0] border-2 border-[#161616] overflow-hidden p-0.5">
          <div
            className="h-full bg-[#D92B8A] transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Practice Card */}
      <div className="bg-[#FFFFFF] border-2 border-[#161616] rounded-none shadow-[5px_5px_0px_#161616] p-6 sm:p-8 space-y-6">
        {/* Concept Pill & Title */}
        <div className="flex items-center justify-between border-b-2 border-[#161616]/15 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#161616] text-[#FAF7F0] font-mono text-[10px] font-bold uppercase">
              FORMATIVE PRACTICE
            </span>
            <span className="font-mono text-xs text-[#6B6862] font-semibold">
              {currentConcept.category || studySet.category}
            </span>
          </div>

          <span className="font-display font-bold text-xs uppercase text-[#D92B8A]">
            {currentConcept.title}
          </span>
        </div>

        {/* Question Prompt */}
        <div className="space-y-2">
          <h2 className="font-display font-black text-xl sm:text-2xl text-[#161616] leading-snug">
            {currentConcept.practiceQuestion || currentConcept.flashcardQuestion}
          </h2>
          <p className="font-mono text-[11px] text-[#6B6862]">
            Select the option that best reflects the core principle:
          </p>
        </div>

        {/* Multiple Choice Options */}
        <div className="space-y-2.5">
          {currentConcept.practiceOptions.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isThisCorrect = idx === currentConcept.correctOptionIndex;

            let optionStyle = 'bg-[#FAF7F0] border-[#161616] hover:bg-[#FDFBF7] text-[#161616]';

            if (isAnswered) {
              if (isThisCorrect) {
                optionStyle = 'bg-green-100 border-green-800 text-green-950 ring-2 ring-green-600';
              } else if (isSelected && !isThisCorrect) {
                optionStyle = 'bg-red-100 border-red-800 text-red-950 opacity-90';
              } else {
                optionStyle = 'bg-[#FAF7F0] border-[#161616]/30 text-[#6B6862] opacity-60';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
                className={`w-full p-4 text-left border-2 rounded-none transition-all flex items-start justify-between gap-3 ${optionStyle} ${
                  !isAnswered ? 'active:translate-x-[1px] active:translate-y-[1px] shadow-[2px_2px_0px_#161616]' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono font-bold text-sm mt-0.5 px-2.5 py-0.5 bg-white border border-[#161616]">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-display font-bold text-sm sm:text-base text-[#161616] leading-relaxed">
                    {option}
                  </span>
                </div>

                {isAnswered && isThisCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
                )}
                {isAnswered && isSelected && !isThisCorrect && (
                  <XCircle className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Educational Explanation */}
        {isAnswered && (
          <div className={`p-5 sm:p-6 border-2 rounded-none space-y-3 shadow-[3px_3px_0px_#161616] animate-fadeIn ${
            isCorrect ? 'bg-green-50 border-green-800' : 'bg-amber-50 border-amber-800'
          }`}>
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-green-700" />
              ) : (
                <HelpCircle className="w-5 h-5 text-amber-700" />
              )}
              <span className="font-display font-black text-sm sm:text-base uppercase tracking-wider">
                {isCorrect ? 'Accurate Understanding!' : 'Learning Insight'}
              </span>
            </div>

            <p className="text-base sm:text-lg text-[#161616] leading-relaxed font-normal whitespace-pre-line">
              {currentConcept.practiceExplanation || currentConcept.explanation}
            </p>

            {currentConcept.whyItMatters && (
              <div className="pt-2.5 border-t-2 border-[#161616]/10 text-sm text-[#2C2C2A] space-y-1">
                <span className="font-mono font-bold text-xs uppercase text-[#D92B8A] block">Why It Matters:</span>
                <p className="leading-relaxed">{currentConcept.whyItMatters}</p>
              </div>
            )}
          </div>
        )}

        {/* Action Button to Next Question */}
        {isAnswered && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-[#D92B8A] text-white font-display text-xs sm:text-sm font-black uppercase tracking-wider rounded-none tactile-btn flex items-center gap-2"
            >
              <span>{currentIndex === totalQuestions - 1 ? 'FINISH PRACTICE' : 'NEXT QUESTION'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
