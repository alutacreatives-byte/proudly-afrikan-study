import React, { useState, useMemo } from 'react';
import { StudyPlanDuration, StudyConcept, StudySet } from '../types';
import { StorageService } from '../services/storageService';
import { 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  RotateCcw,
  Zap,
  Target
} from 'lucide-react';

interface StudyPlanViewProps {
  onStartSession: (concepts: StudyConcept[], title: string, durationMinutes: number) => void;
  onExploreSets: () => void;
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({
  onStartSession,
  onExploreSets,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<StudyPlanDuration>(10);

  const recommendation = useMemo(() => {
    return StorageService.getStudyPlanRecommendation(selectedDuration);
  }, [selectedDuration]);

  const durations: { min: StudyPlanDuration; label: string; tag: string; description: string }[] = [
    { 
      min: 5, 
      label: '5 MINUTES', 
      tag: 'Micro-Burst', 
      description: 'Quick active recall on high-priority concepts. Ideal for rapid daily maintenance.' 
    },
    { 
      min: 10, 
      label: '10 MINUTES', 
      tag: 'Standard Daily', 
      description: 'Balanced mix of spaced review reinforcement plus 1-2 new concepts.' 
    },
    { 
      min: 20, 
      label: '20 MINUTES', 
      tag: 'Deep Focus', 
      description: 'Thorough review loop with formative practice and self-explanation checks.' 
    },
    { 
      min: 30, 
      label: '30 MINUTES', 
      tag: 'Mastery Block', 
      description: 'Complete multi-concept deep dive across history, geography, and literature.' 
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="border-b-[2.5px] border-[#161616] pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#161616] text-[#FAF7F0] font-mono text-xs font-bold uppercase rounded-none">
          <span>TIME-BOXED COGNITIVE ADAPTATION</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-[#161616]">
          STUDY PLANNER
        </h1>
        <p className="text-sm sm:text-base text-[#6B6862] font-medium max-w-2xl">
          Choose how much time you have right now. The algorithm automatically curates the highest-yield mix of concepts needing reinforcement and fresh curriculum.
        </p>
      </div>

      {/* Duration Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {durations.map(d => {
          const isSelected = selectedDuration === d.min;
          return (
            <button
              key={d.min}
              onClick={() => setSelectedDuration(d.min)}
              className={`p-4 border-2 text-left transition-all rounded-none flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-white border-[#161616] shadow-[4px_4px_0px_#D92B8A] ring-2 ring-[#D92B8A]'
                  : 'bg-[#FAF7F0] border-[#161616] hover:bg-white shadow-[2px_2px_0px_#161616]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 bg-[#FAF7F0] border border-[#161616] text-[#161616]">
                    {d.tag}
                  </span>
                  <Clock className={`w-4 h-4 ${isSelected ? 'text-[#D92B8A]' : 'text-[#6B6862]'}`} />
                </div>
                <h3 className="font-display font-black text-xl uppercase text-[#161616]">
                  {d.label}
                </h3>
              </div>

              <p className="text-xs text-[#6B6862] leading-snug">
                {d.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Current Tailored Recommendation Box */}
      <div className="bg-white border-2 border-[#161616] p-6 sm:p-8 rounded-none shadow-[6px_6px_0px_#161616] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#161616]/15 pb-4">
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-[#D92B8A] uppercase">
              RECOMMENDED CURATED PLAN
            </span>
            <h2 className="font-display font-black text-2xl uppercase text-[#161616]">
              {recommendation.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-3 py-1 bg-[#FAF7F0] border border-[#161616] uppercase text-[#161616]">
              {recommendation.concepts.length} CONCEPTS
            </span>
          </div>
        </div>

        <div className="p-4 bg-[#FAF7F0] border border-[#161616] space-y-1">
          <span className="font-mono text-[10px] font-bold text-[#161616] uppercase block">
            PEDAGOGICAL RATIONALE:
          </span>
          <p className="text-xs sm:text-sm text-[#2C2C2A] font-medium leading-relaxed">
            {recommendation.rationale}
          </p>
        </div>

        {/* Breakdown of items in this session */}
        <div className="space-y-2">
          <span className="font-mono text-xs font-bold uppercase text-[#161616]">
            CURATED CONCEPTS IN THIS SESSION:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {recommendation.concepts.map((concept, idx) => (
              <div key={concept.id} className="p-3 bg-[#FAF7F0] border border-[#161616] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono font-bold text-xs text-[#D92B8A]">
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-display font-bold text-xs uppercase text-[#161616] truncate">
                      {concept.title}
                    </h4>
                    <span className="font-mono text-[10px] text-[#6B6862]">
                      {concept.category}
                    </span>
                  </div>
                </div>

                <span className="font-mono text-[9px] px-1.5 py-0.5 bg-white border border-[#161616] uppercase text-[#6B6862] flex-shrink-0">
                  {concept.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Launch Button */}
        <div className="pt-3 border-t-2 border-[#161616]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono text-xs text-[#6B6862]">
            <Target className="w-4 h-4 text-[#D92B8A]" />
            <span>Structured for maximum retention and active recall.</span>
          </div>

          <button
            onClick={() => onStartSession(recommendation.concepts, recommendation.title, selectedDuration)}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#D92B8A] text-white font-display text-xs sm:text-sm font-black uppercase tracking-wider rounded-none tactile-btn flex items-center justify-center gap-2 shadow-[3px_3px_0px_#161616]"
          >
            <Zap className="w-4 h-4" />
            <span>START {selectedDuration}-MIN SESSION →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
