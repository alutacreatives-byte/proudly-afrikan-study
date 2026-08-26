import React, { useState, useMemo } from 'react';
import { StudyPlanDuration, StudyConcept, StudySet } from '../types';
import { StorageService } from '../services/storageService';
import { 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  BookOpen, 
  Layers, 
  RotateCcw,
  Zap,
  Target,
  Flame,
  Check
} from 'lucide-react';

interface StudyPlanViewProps {
  onStartSession: (concepts: StudyConcept[], title: string, durationMinutes: number) => void;
  onExploreSets: () => void;
  onBack?: () => void;
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({
  onStartSession,
  onExploreSets,
  onBack,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<StudyPlanDuration>(10);

  const recommendation = useMemo(() => {
    return StorageService.getStudyPlanRecommendation(selectedDuration);
  }, [selectedDuration]);

  const durations: { min: StudyPlanDuration; label: string; tag: string; description: string }[] = [
    { 
      min: 5, 
      label: '5 Minutes', 
      tag: 'Micro-Burst', 
      description: 'Quick active recall on high-priority concepts. Ideal for rapid daily maintenance.' 
    },
    { 
      min: 10, 
      label: '10 Minutes', 
      tag: 'Standard Daily', 
      description: 'Balanced mix of spaced review reinforcement plus 1–2 new concepts.' 
    },
    { 
      min: 20, 
      label: '20 Minutes', 
      tag: 'Deep Focus', 
      description: 'Thorough review loop with formative practice and self-explanation checks.' 
    },
    { 
      min: 30, 
      label: '30 Minutes', 
      tag: 'Mastery Block', 
      description: 'Complete multi-concept deep dive across history, geography, and literature.' 
    },
  ];

  return (
    <div id="study-plan-view-root" className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Back Button */}
      {onBack && (
        <button
          id="planner-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 font-mono text-xs font-bold text-stone-600 hover:text-[#D92B8A] uppercase tracking-wider transition-colors px-3.5 py-1.5 bg-white border border-stone-200 rounded-full shadow-xs hover:border-pink-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      )}

      {/* Header */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-50 text-[#D92B8A] rounded-full border border-pink-200 font-mono text-xs font-bold uppercase">
          <Clock className="w-3.5 h-3.5" />
          <span>Time-Boxed Adaptive Learning</span>
        </div>
        <h1 className="font-display font-black text-2xl sm:text-4xl text-stone-900 tracking-tight">
          Study Planner
        </h1>
        <p className="text-sm sm:text-base text-stone-600 font-normal leading-relaxed max-w-2xl">
          Choose how much time you have right now. The algorithm automatically curates the highest-yield mix of concepts needing reinforcement and fresh curriculum.
        </p>
      </div>

      {/* Duration Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {durations.map(d => {
          const isSelected = selectedDuration === d.min;
          return (
            <button
              key={d.min}
              id={`duration-opt-${d.min}`}
              onClick={() => setSelectedDuration(d.min)}
              className={`p-5 border text-left transition-all rounded-3xl flex flex-col justify-between space-y-3 shadow-xs ${
                isSelected
                  ? 'bg-white border-[#D92B8A] ring-2 ring-[#D92B8A]/30 shadow-sm'
                  : 'bg-white border-stone-200 hover:border-pink-300 hover:bg-stone-50/50'
              }`}
            >
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-xs font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                    isSelected 
                      ? 'bg-pink-50 text-[#D92B8A] border-pink-200' 
                      : 'bg-stone-100 text-stone-600 border-stone-200'
                  }`}>
                    {d.tag}
                  </span>
                  <Clock className={`w-4 h-4 ${isSelected ? 'text-[#D92B8A]' : 'text-stone-400'}`} />
                </div>
                <h3 className="font-display font-black text-lg text-stone-900 pt-1">
                  {d.label}
                </h3>
              </div>

              <p className="text-sm text-stone-600 leading-relaxed font-normal">
                {d.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Current Tailored Recommendation Box */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-[#D92B8A] uppercase">
              Recommended Curated Plan
            </span>
            <h2 className="font-display font-black text-xl sm:text-2xl text-stone-900">
              {recommendation.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-3.5 py-1 bg-stone-100 border border-stone-200 uppercase rounded-full text-stone-800">
              {recommendation.concepts.length} {recommendation.concepts.length === 1 ? 'Concept' : 'Concepts'}
            </span>
          </div>
        </div>

        {/* Pedagogical Rationale */}
        <div className="p-4 bg-pink-50/50 border border-pink-200/80 rounded-2xl space-y-1.5">
          <span className="font-mono text-xs font-bold text-[#D92B8A] uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pedagogical Rationale</span>
          </span>
          <p className="text-sm text-stone-700 leading-relaxed font-normal">
            {recommendation.rationale}
          </p>
        </div>

        {/* Breakdown of items in this session */}
        <div className="space-y-3">
          <span className="font-mono text-xs font-bold uppercase text-stone-700 block">
            Curated Concepts in this Session:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendation.concepts.map((concept, idx) => (
              <div 
                key={concept.id} 
                className="p-3.5 bg-stone-50/70 border border-stone-200/80 rounded-2xl flex items-center justify-between gap-3 shadow-xs hover:bg-white hover:border-pink-200 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono font-bold text-xs bg-pink-50 text-[#D92B8A] border border-pink-200 px-2 py-0.5 rounded-full shrink-0">
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-display font-bold text-sm text-stone-900 truncate">
                      {concept.title}
                    </h4>
                    <span className="font-mono text-xs text-stone-500 block">
                      {concept.category}
                    </span>
                  </div>
                </div>

                <span className="font-mono text-xs px-2.5 py-0.5 bg-white border border-stone-200 uppercase text-stone-700 rounded-full shrink-0 font-bold">
                  {concept.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Launch Button */}
        <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono text-xs text-stone-500">
            <Target className="w-4 h-4 text-[#D92B8A]" />
            <span>Structured for maximum retention and active recall.</span>
          </div>

          <button
            id="start-planned-session-btn"
            onClick={() => onStartSession(recommendation.concepts, recommendation.title, selectedDuration)}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#D92B8A] hover:bg-[#c02479] text-white font-display text-xs sm:text-sm font-bold uppercase rounded-full shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Zap className="w-4 h-4" />
            <span>Start {selectedDuration}-Min Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
