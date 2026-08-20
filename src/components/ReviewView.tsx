import React, { useState, useMemo } from 'react';
import { StudyConcept, StudySet, ConceptPerformance } from '../types';
import { StorageService } from '../services/storageService';
import { 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  AlertTriangle,
  FolderOpen,
  Shuffle,
  Clock,
  ExternalLink
} from 'lucide-react';

interface ReviewItemWrapper {
  concept: StudyConcept;
  performance?: ConceptPerformance;
  set?: StudySet;
}

interface ReviewViewProps {
  reviewItems: StudyConcept[] | ReviewItemWrapper[];
  onStartReviewSession: (conceptsToReview: StudyConcept[], categoryName?: string) => void;
  onExploreSets: () => void;
}

export const ReviewView: React.FC<ReviewViewProps> = ({
  reviewItems,
  onStartReviewSession,
  onExploreSets,
}) => {
  const [activeTab, setActiveTab] = useState<'spaced' | 'interleaved'>('spaced');

  // Normalize review items to ensure safe access whether passed as StudyConcept[] or wrapper objects
  const normalizedItems: ReviewItemWrapper[] = useMemo(() => {
    const allSets = StorageService.getAllSets();
    return (reviewItems || []).map(item => {
      if (!item) return null;
      // Check if item is already a wrapper with .concept
      if ('concept' in item && (item as ReviewItemWrapper).concept) {
        const wrapper = item as ReviewItemWrapper;
        const set = wrapper.set || allSets.find(s => s.id === wrapper.concept.setId);
        return { concept: wrapper.concept, performance: wrapper.performance, set };
      }
      // Otherwise item is a direct StudyConcept
      const concept = item as StudyConcept;
      const set = allSets.find(s => s.id === concept.setId);
      return { concept, set };
    }).filter((i): i is ReviewItemWrapper => Boolean(i && i.concept && i.concept.id));
  }, [reviewItems]);

  // Group review items by subject category
  const groupedByCategory = useMemo(() => {
    const map: Record<string, ReviewItemWrapper[]> = {};
    normalizedItems.forEach(item => {
      const cat = item.concept.category || item.set?.category || 'GENERAL';
      if (!map[cat]) map[cat] = [];
      map[cat].push(item);
    });
    return map;
  }, [normalizedItems]);

  // Interleaved pool generated from StorageService
  const interleavedConcepts = useMemo(() => {
    return StorageService.getInterleavedReviewConcepts(12);
  }, [reviewItems]);

  const totalCount = normalizedItems.length;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Editorial Header */}
      <div className="border-b-[2.5px] border-[#161616] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#161616] text-[#FAF7F0] font-mono text-xs font-bold uppercase rounded-none mb-2">
            <span>SPACED & INTERLEAVED RETENTION ENGINE</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-[#161616]">
            REVIEW QUEUE
          </h1>
          <p className="text-sm sm:text-base text-[#6B6862] font-medium mt-1">
            {totalCount > 0
              ? `${totalCount} ${totalCount === 1 ? 'concept needs' : 'concepts need'} active reinforcement to solidify into long-term memory.`
              : 'Your review queue is currently clear! Review interleaved concepts across topics below.'}
          </p>
        </div>

        {totalCount > 0 && (
          <button
            onClick={() => onStartReviewSession(normalizedItems.map(r => r.concept))}
            className="px-6 py-3 bg-[#D92B8A] text-white font-display text-xs sm:text-sm font-black tracking-wider uppercase rounded-none tactile-btn flex items-center justify-center gap-2 whitespace-nowrap self-start sm:self-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>START SPACED REVIEW ({totalCount})</span>
          </button>
        )}
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex gap-2 border-b-2 border-[#161616]">
        <button
          onClick={() => setActiveTab('spaced')}
          className={`px-5 py-2.5 font-display text-xs sm:text-sm font-black uppercase tracking-wider border-t-2 border-x-2 transition-all flex items-center gap-2 ${
            activeTab === 'spaced'
              ? 'bg-white text-[#161616] border-[#161616] -mb-[2px] shadow-[2px_0px_0px_#161616]'
              : 'bg-[#FAF7F0] text-[#6B6862] border-transparent hover:text-[#161616]'
          }`}
        >
          <RotateCcw className="w-4 h-4 text-[#D92B8A]" />
          <span>SPACED REVIEW QUEUE ({totalCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('interleaved')}
          className={`px-5 py-2.5 font-display text-xs sm:text-sm font-black uppercase tracking-wider border-t-2 border-x-2 transition-all flex items-center gap-2 ${
            activeTab === 'interleaved'
              ? 'bg-white text-[#161616] border-[#161616] -mb-[2px] shadow-[2px_0px_0px_#161616]'
              : 'bg-[#FAF7F0] text-[#6B6862] border-transparent hover:text-[#161616]'
          }`}
        >
          <Shuffle className="w-4 h-4 text-[#D92B8A]" />
          <span>INTERLEAVED MULTI-TOPIC ({interleavedConcepts.length})</span>
        </button>
      </div>

      {/* TAB 1: SPACED REVIEW QUEUE */}
      {activeTab === 'spaced' && (
        <>
          {totalCount === 0 ? (
            <div className="bg-[#FFFFFF] border-2 border-[#161616] rounded-none p-8 sm:p-12 text-center space-y-4 shadow-[5px_5px_0px_#161616]">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-50 border-2 border-[#161616] flex items-center justify-center text-green-700 shadow-[2px_2px_0px_#161616]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-display font-black text-2xl uppercase text-[#161616]">
                ALL CAUGHT UP!
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6862] max-w-md mx-auto">
                You don&apos;t have any flagged concepts in your review queue right now. As you rate flashcards, any concepts you need to revisit will appear here automatically.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => onStartReviewSession(interleavedConcepts, 'Interleaved Practice')}
                  className="px-6 py-3 bg-[#D92B8A] text-white font-display text-xs sm:text-sm font-black uppercase rounded-none tactile-btn inline-flex items-center justify-center gap-2"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>TRY INTERLEAVED PRACTICE</span>
                </button>
                <button
                  onClick={onExploreSets}
                  className="px-6 py-3 bg-white border-2 border-[#161616] text-[#161616] font-display text-xs sm:text-sm font-black uppercase rounded-none tactile-btn inline-flex items-center justify-center gap-2"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>EXPLORE STUDY SETS</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {(Object.entries(groupedByCategory) as [string, ReviewItemWrapper[]][]).map(([category, items]) => (
                <div key={category} className="bg-white border-2 border-[#161616] rounded-none p-5 sm:p-6 shadow-[4px_4px_0px_#161616] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#161616]/15 pb-3">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-[#D92B8A] uppercase">
                        SUBJECT CATEGORY
                      </span>
                      <h3 className="font-display font-black text-lg uppercase text-[#161616]">
                        {category} ({items.length} {items.length === 1 ? 'Concept' : 'Concepts'})
                      </h3>
                    </div>

                    <button
                      onClick={() => onStartReviewSession(items.map(i => i.concept), category)}
                      className="px-4 py-2 bg-[#161616] text-white font-display text-xs font-black uppercase tracking-wider rounded-none tactile-btn flex items-center gap-1.5"
                    >
                      <span>REVIEW THIS SUBJECT</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {items.map(({ concept, performance, set }) => (
                      <div key={concept.id} className="p-4 bg-[#FAF7F0] border-2 border-[#161616] space-y-2 shadow-[2px_2px_0px_#161616]">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-display font-bold text-sm sm:text-base uppercase text-[#161616]">
                            {concept.title}
                          </span>
                          <span className="font-mono text-xs font-bold px-2 py-0.5 bg-red-100 border border-red-800 text-red-800 uppercase whitespace-nowrap">
                            Needs Review
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#2C2C2A] leading-relaxed line-clamp-3">
                          {concept.summary}
                        </p>
                        <div className="font-mono text-xs text-[#6B6862] pt-1">
                          From set: <span className="font-bold text-[#161616]">{set?.title || concept.category || 'Study Set'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* TAB 2: INTERLEAVED MULTI-TOPIC REVIEW */}
      {activeTab === 'interleaved' && (
        <div className="bg-white border-2 border-[#161616] p-6 sm:p-8 rounded-none shadow-[5px_5px_0px_#161616] space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#FDEAF4] text-[#D92B8A] font-mono text-[10px] font-bold uppercase border border-[#D92B8A]">
              <span>COGNITIVE SCIENCE PRINCIPLE</span>
            </div>
            <h2 className="font-display font-black text-2xl uppercase text-[#161616]">
              Why Interleaved Review Works
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6862] max-w-2xl font-medium leading-relaxed">
              Practicing multiple topics mixed together forces your brain to continually discriminate between concepts, preventing the false sense of mastery caused by single-topic repetition.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {interleavedConcepts.map((concept, idx) => (
              <div key={concept.id} className="p-3 bg-[#FAF7F0] border border-[#161616] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[10px] text-[#D92B8A]">
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 bg-white border border-[#161616] uppercase">
                    {concept.category}
                  </span>
                </div>
                <h4 className="font-display font-black text-xs uppercase text-[#161616] truncate">
                  {concept.title}
                </h4>
                <p className="text-[11px] text-[#6B6862] line-clamp-2">
                  {concept.summary}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#161616]/15 flex justify-end">
            <button
              onClick={() => onStartReviewSession(interleavedConcepts, 'Interleaved Multi-Topic Session')}
              className="px-6 py-3 bg-[#D92B8A] text-white font-display text-xs sm:text-sm font-black uppercase tracking-wider rounded-none tactile-btn flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              <span>START INTERLEAVED SESSION ({interleavedConcepts.length} CONCEPTS) →</span>
            </button>
          </div>
        </div>
      )}

      {/* QUIZ CONNECTION (Optional CTA) */}
      <div className="bg-[#FAF7F0] border-2 border-[#161616] p-5 sm:p-6 rounded-none shadow-[4px_4px_0px_#161616] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#161616] text-[#FAF7F0] font-mono text-[10px] font-bold uppercase">
            <span>SEPARATE PLATFORM</span>
          </div>
          <h3 className="font-display font-black text-lg uppercase text-[#161616]">
            READY TO TEST YOUR KNOWLEDGE?
          </h3>
          <p className="text-xs text-[#6B6862]">
            Take the timed quiz on the separate Proudly Afrikan Quiz platform.
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
};
