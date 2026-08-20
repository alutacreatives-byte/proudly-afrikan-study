import React, { useState } from 'react';
import { StudySet, StudyConcept, AppView } from '../types';
import { StorageService } from '../services/storageService';
import { 
  ArrowLeft, 
  Clock, 
  Layers, 
  BookOpen, 
  CheckCircle2, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  ExternalLink,
  BookMarked,
  FileText,
  Zap,
  Tag
} from 'lucide-react';

interface StudySetDetailViewProps {
  studySet: StudySet;
  onBack: () => void;
  onLaunchMode: (mode: AppView) => void;
  onLaunchConceptLesson?: (conceptIndex: number) => void;
}

export const StudySetDetailView: React.FC<StudySetDetailViewProps> = ({
  studySet,
  onBack,
  onLaunchMode,
  onLaunchConceptLesson,
}) => {
  const [expandedConceptId, setExpandedConceptId] = useState<string | null>(null);
  const [setNote, setSetNote] = useState<string>(() => StorageService.getNote(studySet.id));
  const [isNoteSaved, setIsNoteSaved] = useState(false);
  const [noteErrorAlert, setNoteErrorAlert] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedConceptId(prev => (prev === id ? null : id));
  };

  const handleSaveSetNote = () => {
    if (!setNote.trim()) {
      setNoteErrorAlert('Note cannot be empty');
      setTimeout(() => setNoteErrorAlert(null), 2500);
      return;
    }

    const res = StorageService.saveNote({
      targetId: studySet.id,
      targetTitle: studySet.title,
      targetType: 'set',
      category: studySet.category || 'General Knowledge',
      content: setNote.trim(),
    });

    if (res.success) {
      setIsNoteSaved(true);
      setNoteErrorAlert(null);
      setTimeout(() => setIsNoteSaved(false), 2000);
    } else {
      setNoteErrorAlert(res.error || 'Failed to save note');
      setTimeout(() => setNoteErrorAlert(null), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#6B6862] hover:text-[#161616] uppercase tracking-wider transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO STUDY SETS</span>
      </button>

      {/* Hero Study Set Overview Card */}
      <div className="bg-[#FFFFFF] border-2 border-[#161616] rounded-none p-6 sm:p-8 space-y-6 shadow-[6px_6px_0px_#161616]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 bg-[#161616] text-[#FAF7F0] font-mono text-[10px] font-bold uppercase">
              {studySet.category || 'General Knowledge'}
            </span>
            {studySet.isCustom && (
              <span className="px-2.5 py-0.5 bg-[#D92B8A] text-white font-mono text-[10px] font-bold uppercase">
                CUSTOM SET
              </span>
            )}
            <span className="flex items-center gap-1 text-xs font-mono font-semibold text-[#6B6862]">
              <Clock className="w-3.5 h-3.5" />
              ~{studySet.estimatedMinutes || Math.ceil((studySet.concepts || []).length * 2)} MINS ESTIMATED
            </span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-4xl uppercase text-[#161616] leading-tight mb-3">
            {studySet.title}
          </h1>

          <p className="text-sm sm:text-base text-[#6B6862] leading-relaxed font-medium">
            {studySet.description}
          </p>
        </div>

        {/* 4 Primary Learning Actions (NO QUIZ) */}
        <div className="pt-3 border-t-2 border-[#161616]/15 space-y-3">
          <span className="font-mono text-[11px] font-bold text-[#161616] uppercase tracking-wider block">
            HOW WOULD YOU LIKE TO STUDY THIS SET?
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => onLaunchMode('study')}
              className="p-3.5 bg-[#D92B8A] text-white font-display text-xs font-black uppercase rounded-none tactile-btn flex flex-col items-center justify-center gap-1.5 shadow-[2px_2px_0px_#161616]"
            >
              <BookOpen className="w-4 h-4" />
              <span>LEARN & TEACH</span>
            </button>

            <button
              onClick={() => onLaunchMode('flashcards')}
              className="p-3.5 bg-[#FFFFFF] border-2 border-[#161616] text-[#161616] font-display text-xs font-black uppercase rounded-none hover:bg-[#FAF7F0] shadow-[2px_2px_0px_#161616] flex flex-col items-center justify-center gap-1.5"
            >
              <Layers className="w-4 h-4 text-[#D92B8A]" />
              <span>FLASHCARDS</span>
            </button>

            <button
              onClick={() => onLaunchMode('practice')}
              className="p-3.5 bg-[#FAF7F0] border-2 border-[#161616] text-[#161616] font-display text-xs font-black uppercase rounded-none hover:bg-[#F0EAE0] shadow-[2px_2px_0px_#161616] flex flex-col items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-[#161616]" />
              <span>PRACTISE</span>
            </button>

            <button
              onClick={() => onLaunchMode('review')}
              className="p-3.5 bg-[#FAF7F0] border-2 border-[#161616] text-[#161616] font-display text-xs font-black uppercase rounded-none hover:bg-[#F0EAE0] shadow-[2px_2px_0px_#161616] flex flex-col items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4 text-[#D92B8A]" />
              <span>REVIEW QUEUE</span>
            </button>
          </div>
        </div>

        {/* Set Notes Editor */}
        <div className="pt-3 border-t-2 border-[#161616]/15 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold text-[#161616] uppercase flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#6B6862]" />
              <span>MY STUDY NOTES FOR THIS SET:</span>
            </span>
            {isNoteSaved && (
              <span className="font-mono text-[10px] text-green-700 font-bold uppercase animate-fadeIn">
                Saved ✓
              </span>
            )}
            {noteErrorAlert && (
              <span className="font-mono text-[10px] text-red-600 font-bold uppercase animate-fadeIn">
                {noteErrorAlert}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={setNote}
              onChange={(e) => setSetNote(e.target.value)}
              onBlur={handleSaveSetNote}
              placeholder="Add your summary notes, key ideas, or personal takeaways..."
              className="flex-1 p-2 bg-[#FAF7F0] border border-[#161616] text-xs text-[#161616] focus:bg-white focus:outline-none"
            />
            <button
              onClick={handleSaveSetNote}
              className="px-3 py-1 bg-white border border-[#161616] font-display text-xs font-bold uppercase hover:bg-[#FAF7F0]"
            >
              SAVE NOTE
            </button>
          </div>
        </div>
      </div>

      {/* KEY CONCEPTS MENTAL MAP */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-black text-xl uppercase text-[#161616]">
            KEY CONCEPTS IN THIS SET ({studySet.concepts.length})
          </h2>
          <span className="text-xs font-mono text-[#6B6862]">
            Click any concept to inspect details
          </span>
        </div>

        <div className="space-y-3">
          {studySet.concepts.map((concept, index) => {
            const isExpanded = expandedConceptId === concept.id;

            return (
              <div
                key={concept.id}
                className="bg-[#FFFFFF] border-2 border-[#161616] rounded-none shadow-[3px_3px_0px_#161616] overflow-hidden transition-all"
              >
                <div
                  onClick={() => toggleExpand(concept.id)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-[#FAF7F0] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 bg-[#161616] text-[#FAF7F0] flex items-center justify-center font-mono font-bold text-xs">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-display font-black text-base sm:text-lg uppercase text-[#161616]">
                        {concept.title}
                      </h3>
                      <p className="text-xs text-[#6B6862] line-clamp-1 font-medium">
                        {concept.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#FAF7F0] border border-[#161616] rounded-none text-[10px] font-mono font-bold uppercase text-[#6B6862]">
                      {concept.difficulty}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-[#161616]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#161616]" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 sm:p-6 border-t-2 border-[#161616] bg-[#FAF7F0] space-y-4 animate-fadeIn">
                    <div className="space-y-2">
                      <span className="font-mono text-xs font-bold uppercase text-[#D92B8A]">
                        EXPLANATION & CONTEXT
                      </span>
                      <p className="text-base text-[#161616] leading-relaxed whitespace-pre-line">
                        {concept.explanation || concept.summary}
                      </p>
                    </div>

                    {concept.keyFacts && concept.keyFacts.length > 0 && (
                      <div className="space-y-2 pt-2 border-t-2 border-[#161616]/15">
                        <span className="font-mono text-xs font-bold uppercase text-[#161616]">
                          KEY FACTS
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {concept.keyFacts.map((fact, fIdx) => (
                            <div key={fIdx} className="p-3 bg-white border-2 border-[#161616] text-sm text-[#161616] font-medium leading-relaxed shadow-[1.5px_1.5px_0px_#161616]">
                              • {fact}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onLaunchConceptLesson) {
                            onLaunchConceptLesson(index);
                          } else {
                            onLaunchMode('study');
                          }
                        }}
                        className="px-5 py-2.5 bg-[#D92B8A] text-white font-display text-xs sm:text-sm font-black uppercase rounded-none tactile-btn flex items-center gap-2 shadow-[2px_2px_0px_#161616]"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>OPEN FULL LESSON FOR THIS CONCEPT →</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* GO DEEPER (Recommended Resources & Reading) */}
      {studySet.goDeeperResources && studySet.goDeeperResources.length > 0 && (
        <div className="bg-white border-2 border-[#161616] p-6 sm:p-8 rounded-none shadow-[5px_5px_0px_#161616] space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-[#161616]/15 pb-3">
            <BookMarked className="w-5 h-5 text-[#D92B8A]" />
            <h2 className="font-display font-black text-xl uppercase text-[#161616]">
              GO DEEPER: RECOMMENDED RESOURCES
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {studySet.goDeeperResources.map(res => (
              <div key={res.id} className="p-4 bg-[#FAF7F0] border border-[#161616] space-y-2 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-white border border-[#161616] text-[#D92B8A] font-bold">
                      {res.type}
                    </span>
                    <span className="font-mono text-[10px] text-[#6B6862]">
                      {res.topicMatch}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-xs uppercase text-[#161616] pt-1">
                    {res.title}
                  </h4>
                  <p className="font-mono text-[11px] text-[#6B6862]">
                    By {res.authorOrSource}
                  </p>
                  <p className="text-[11px] text-[#2C2C2A] leading-snug pt-1">
                    {res.description}
                  </p>
                </div>

                {res.externalUrl && (
                  <a
                    href={res.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-[#D92B8A] hover:underline pt-2"
                  >
                    <span>Read resource</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUIZ CONNECTION (Optional CTA at bottom) */}
      <div className="bg-[#FAF7F0] border-2 border-[#161616] p-5 sm:p-6 rounded-none shadow-[4px_4px_0px_#161616] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#161616] text-[#FAF7F0] font-mono text-[10px] font-bold uppercase">
            <span>SEPARATE PRODUCT</span>
          </div>
          <h3 className="font-display font-black text-lg uppercase text-[#161616]">
            FEEL READY TO TEST YOUR KNOWLEDGE?
          </h3>
          <p className="text-xs text-[#6B6862]">
            Proudly Afrikan Quiz is designed specifically for competitive testing and scoring.
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
