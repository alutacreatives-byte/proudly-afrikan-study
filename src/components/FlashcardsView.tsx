import React, { useState, useEffect } from 'react';
import { StudySet, StudyConcept, FlashcardRating } from '../types';
import { 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Lightbulb, 
  Check, 
  RotateCcw,
  ArrowLeft,
  Volume2
} from 'lucide-react';

interface FlashcardsViewProps {
  studySet: StudySet;
  onBack: () => void;
  onRecordRating: (conceptId: string, rating: FlashcardRating) => void;
  onCompleteSession: (result: { total: number; confident: number; struggled: number }) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  studySet,
  onBack,
  onRecordRating,
  onCompleteSession,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [sessionRatings, setSessionRatings] = useState<Record<string, FlashcardRating>>({});

  const concepts = studySet.concepts;
  const currentConcept = concepts[currentIndex];
  const totalCards = concepts.length;

  const currentRating = currentConcept ? sessionRatings[currentConcept.id] : undefined;

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is in an input field
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyN') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyP') {
        e.preventDefault();
        handlePrev();
      } else if (isFlipped) {
        if (e.key === '1') handleRate('did_not_know');
        if (e.key === '2') handleRate('almost');
        if (e.key === '3') handleRate('knew_it');
        if (e.key === '4') handleRate('easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, currentIndex, currentConcept]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRate = (rating: FlashcardRating) => {
    if (!currentConcept) return;

    onRecordRating(currentConcept.id, rating);
    const updatedRatings = { ...sessionRatings, [currentConcept.id]: rating };
    setSessionRatings(updatedRatings);

    // Auto advance if not last card
    if (currentIndex < totalCards - 1) {
      setTimeout(() => {
        setIsFlipped(false);
        setShowHint(false);
        setCurrentIndex(prev => prev + 1);
      }, 180);
    } else {
      // Completed session
      const confident = Object.values(updatedRatings).filter(
        r => r === 'knew_it' || r === 'easy'
      ).length;
      const struggled = Object.values(updatedRatings).filter(
        r => r === 'did_not_know' || r === 'almost'
      ).length;

      onCompleteSession({
        total: totalCards,
        confident,
        struggled,
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setIsFlipped(false);
      setShowHint(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setShowHint(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (!currentConcept) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="font-display font-black text-2xl uppercase">No flashcards found</h2>
        <button onClick={onBack} className="px-5 py-2 bg-[#D92B8A] text-white rounded font-display">
          GO BACK
        </button>
      </div>
    );
  }

  const progressPercentage = Math.round(((currentIndex + 1) / totalCards) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Top Header & Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            id="flashcards-back-btn"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 font-display text-xs font-bold text-[#161616] hover:text-[#D92B8A] uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>EXIT FLASHCARDS</span>
          </button>

          <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#161616]">
            <span className="px-2 py-0.5 bg-[#FFFFFF] border border-[#161616] rounded shadow-[1px_1px_0px_#161616]">
              CARD {currentIndex + 1} OF {totalCards}
            </span>
            <span className="text-[#D92B8A] font-bold">
              {progressPercentage}%
            </span>
          </div>
        </div>

        {/* Tactile Progress Bar */}
        <div className="w-full h-3 bg-[#FAF7F0] border-2 border-[#161616] rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-[#D92B8A] rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Set Title Banner */}
      <div className="flex items-center justify-between px-1">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-[#6B6862]">
            {studySet.category}
          </span>
          <h2 className="font-display font-black text-lg sm:text-xl uppercase text-[#161616]">
            {studySet.title}
          </h2>
        </div>

        <button
          onClick={handleFlip}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFFFFF] border-[1.5px] border-[#161616] rounded text-xs font-mono font-bold text-[#161616] shadow-[1.5px_1.5px_0px_#161616] active:translate-x-[1px] active:translate-y-[1px]"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>FLIP [SPACE]</span>
        </button>
      </div>

      {/* The Tactile 3D Flashcard */}
      <div
        id="interactive-flashcard"
        onClick={handleFlip}
        className={`tactile-card min-h-[360px] sm:min-h-[420px] rounded-2xl p-6 sm:p-10 flex flex-col justify-between cursor-pointer transition-all duration-200 select-none relative ${
          isFlipped 
            ? 'bg-[#FFFFFF] ring-2 ring-[#D92B8A]' 
            : 'bg-[#FAF7F0] hover:bg-[#FDFBF7]'
        }`}
      >
        {/* Card Top Pill & Mode Tag */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase border border-[#161616] ${
                isFlipped ? 'bg-[#D92B8A] text-white' : 'bg-[#161616] text-[#FAF7F0]'
              }`}>
                {isFlipped ? 'ANSWER / SUMMARY' : 'QUESTION'}
              </span>

              <span className="text-xs font-mono font-semibold text-[#6B6862]">
                {currentConcept.difficulty}
              </span>
            </div>

            {currentRating && (
              <span className="px-2 py-0.5 bg-[#FAF7F0] border border-[#161616] text-[10px] font-mono font-bold uppercase text-[#D92B8A]">
                RATED: {currentRating.replace(/_/g, ' ')}
              </span>
            )}
          </div>

          <h3 className="font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-[#6B6862] mb-3">
            {currentConcept.title}
          </h3>

          {/* Card Content: Question or Answer */}
          {!isFlipped ? (
            <div className="space-y-4 pt-2 sm:pt-4">
              <p className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#161616] leading-tight">
                {currentConcept.flashcardQuestion}
              </p>

              {currentConcept.flashcardHint && (
                <div className="pt-2">
                  {!showHint ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHint(true);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#6B6862] hover:text-[#D92B8A] underline"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Show Hint</span>
                    </button>
                  ) : (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="p-3 bg-[#FFFFFF] border-2 border-[#161616] rounded-md text-xs font-medium text-[#161616] shadow-[2px_2px_0px_#161616] animate-fadeIn"
                    >
                      <span className="font-mono font-bold text-[#D92B8A] mr-1">HINT:</span>
                      {currentConcept.flashcardHint}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 pt-2 sm:pt-4 animate-fadeIn">
              <p className="font-display font-extrabold text-xl sm:text-2xl lg:text-3xl text-[#161616] leading-snug">
                {currentConcept.flashcardAnswer}
              </p>

              {currentConcept.summary && currentConcept.summary !== currentConcept.flashcardAnswer && (
                <div className="p-4 sm:p-5 bg-[#FAF7F0] border-2 border-[#161616] rounded-none mt-4 shadow-[2px_2px_0px_#161616]">
                  <span className="font-mono text-xs font-bold text-[#D92B8A] uppercase block mb-1">
                    KEY CONTEXT
                  </span>
                  <p className="text-sm sm:text-base text-[#161616] leading-relaxed">
                    {currentConcept.summary}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Prompts / Reveal Action */}
        <div className="pt-6 border-t-2 border-[#161616]/15 flex items-center justify-between">
          {!isFlipped ? (
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-mono text-[#6B6862] font-semibold">
                Click or press Space to reveal
              </span>
              <button
                id="flashcard-reveal-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(true);
                }}
                className="px-5 py-2.5 bg-[#D92B8A] text-white font-display text-xs sm:text-sm font-black uppercase tracking-wider rounded-md tactile-btn"
              >
                REVEAL ANSWER
              </button>
            </div>
          ) : (
            <div className="w-full space-y-3" onClick={(e) => e.stopPropagation()}>
              <div className="text-center font-display text-xs sm:text-sm font-black uppercase text-[#161616] tracking-wide">
                HOW WELL DID YOU KNOW THIS?
              </div>

              {/* 4 Active Recall Rating Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  id="rating-did-not-know-btn"
                  onClick={() => handleRate('did_not_know')}
                  className="py-2.5 px-2 bg-[#FFFFFF] hover:bg-red-50 text-red-700 font-display text-xs font-black uppercase rounded-md border-[2px] border-[#161616] shadow-[2px_2px_0px_#161616] active:translate-x-[1px] active:translate-y-[1px] flex flex-col items-center justify-center gap-0.5"
                >
                  <span>DID NOT KNOW</span>
                  <span className="font-mono text-[9px] text-[#6B6862]">[1]</span>
                </button>

                <button
                  id="rating-almost-btn"
                  onClick={() => handleRate('almost')}
                  className="py-2.5 px-2 bg-[#FFFFFF] hover:bg-amber-50 text-amber-700 font-display text-xs font-black uppercase rounded-md border-[2px] border-[#161616] shadow-[2px_2px_0px_#161616] active:translate-x-[1px] active:translate-y-[1px] flex flex-col items-center justify-center gap-0.5"
                >
                  <span>ALMOST</span>
                  <span className="font-mono text-[9px] text-[#6B6862]">[2]</span>
                </button>

                <button
                  id="rating-knew-it-btn"
                  onClick={() => handleRate('knew_it')}
                  className="py-2.5 px-2 bg-[#FFFFFF] hover:bg-emerald-50 text-emerald-800 font-display text-xs font-black uppercase rounded-md border-[2px] border-[#161616] shadow-[2px_2px_0px_#161616] active:translate-x-[1px] active:translate-y-[1px] flex flex-col items-center justify-center gap-0.5"
                >
                  <span>KNEW IT</span>
                  <span className="font-mono text-[9px] text-[#6B6862]">[3]</span>
                </button>

                <button
                  id="rating-easy-btn"
                  onClick={() => handleRate('easy')}
                  className="py-2.5 px-2 bg-[#D92B8A] hover:bg-[#BF1E75] text-white font-display text-xs font-black uppercase rounded-md border-[2px] border-[#161616] shadow-[2px_2px_0px_#161616] active:translate-x-[1px] active:translate-y-[1px] flex flex-col items-center justify-center gap-0.5"
                >
                  <span>EASY</span>
                  <span className="font-mono text-[9px] text-[#FDEAF4]">[4]</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls (Prev / Next) */}
      <div className="flex items-center justify-between pt-2">
        <button
          id="flashcard-prev-btn"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-[#FFFFFF] disabled:opacity-40 disabled:pointer-events-none text-[#161616] font-display text-xs font-black uppercase rounded-md border-[2px] border-[#161616] shadow-[2px_2px_0px_#161616] active:translate-x-[1px] active:translate-y-[1px] inline-flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>PREVIOUS</span>
        </button>

        <span className="text-[11px] font-mono text-[#6B6862]">
          Shortcuts: Space (Flip), 1–4 (Rate), ← → (Navigate)
        </span>

        <button
          id="flashcard-next-btn"
          onClick={handleNext}
          disabled={currentIndex === totalCards - 1}
          className="px-4 py-2 bg-[#FFFFFF] disabled:opacity-40 disabled:pointer-events-none text-[#161616] font-display text-xs font-black uppercase rounded-md border-[2px] border-[#161616] shadow-[2px_2px_0px_#161616] active:translate-x-[1px] active:translate-y-[1px] inline-flex items-center gap-1.5"
        >
          <span>NEXT</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
