import React from 'react';
import { UserStats } from '../types';
import { StorageService } from '../services/storageService';
import { 
  Flame, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  RotateCcw,
  Clock,
  FileText,
  ExternalLink
} from 'lucide-react';

interface ProgressViewProps {
  stats: UserStats;
  onExploreSets: () => void;
  onStartReview: () => void;
  onNavigateToArchive?: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  stats,
  onExploreSets,
  onStartReview,
  onNavigateToArchive,
}) => {
  const sessionHistory = StorageService.getSessionHistory();
  const userNotes = StorageService.getUserNotes();
  const notesCount = userNotes.length;
  const needingReviewCount = StorageService.getConceptsNeedingReview().length;

  return (
    <div className="space-y-10 pb-16">
      {/* Top Editorial Header */}
      <div className="border-b-[2.5px] border-[#161616] pb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#FAF7F0] border border-[#161616] text-[#161616] font-mono text-xs font-bold uppercase mb-2">
          <span>LEARNING MASTERY RECORD</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-[#161616]">
          YOUR STUDY PROGRESS
        </h1>
        <p className="text-sm sm:text-base text-[#6B6862] font-medium mt-1">
          Tracking your active recall sessions, lessons completed, and concepts in long-term memory.
        </p>
      </div>

      {/* 4 Large Editorial Stat Blocks */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-[#FFFFFF] border-2 border-[#161616] rounded-none p-5 sm:p-6 space-y-2 shadow-[4px_4px_0px_#161616]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-[#6B6862]">
              DAILY STREAK
            </span>
            <Flame className="w-5 h-5 text-[#D92B8A] fill-[#D92B8A]" />
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-black text-[#D92B8A]">
            {stats.streakDays} <span className="text-xs font-bold text-[#161616]">DAYS</span>
          </div>
          <p className="text-[11px] text-[#6B6862] font-medium">
            Consecutive days studied
          </p>
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#161616] rounded-none p-5 sm:p-6 space-y-2 shadow-[4px_4px_0px_#161616]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-[#6B6862]">
              SESSIONS COMPLETED
            </span>
            <BookOpen className="w-5 h-5 text-[#161616]" />
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-black text-[#161616]">
            {stats.sessionsCompleted}
          </div>
          <p className="text-[11px] text-[#6B6862] font-medium">
            Lessons, cards & practice
          </p>
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#161616] rounded-none p-5 sm:p-6 space-y-2 shadow-[4px_4px_0px_#161616]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-[#6B6862]">
              CONCEPTS LEARNED
            </span>
            <Layers className="w-5 h-5 text-[#D92B8A]" />
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-black text-[#D92B8A]">
            {stats.conceptsStudied}
          </div>
          <p className="text-[11px] text-[#6B6862] font-medium">
            Active concepts explored
          </p>
        </div>

        <div className="bg-[#FFFFFF] border-2 border-[#161616] rounded-none p-5 sm:p-6 space-y-2 shadow-[4px_4px_0px_#161616]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-[#6B6862]">
              QUEUED FOR REVIEW
            </span>
            <RotateCcw className="w-5 h-5 text-[#161616]" />
          </div>
          <div className="font-mono text-3xl sm:text-4xl font-black text-[#161616]">
            {needingReviewCount}
          </div>
          <p className="text-[11px] text-[#6B6862] font-medium">
            Spaced repetition items
          </p>
        </div>
      </div>

      {/* Recent Study Activity */}
      <div className="bg-white border-2 border-[#161616] p-6 sm:p-8 rounded-none shadow-[5px_5px_0px_#161616] space-y-5">
        <div className="flex items-center justify-between border-b-2 border-[#161616]/15 pb-3">
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold text-[#D92B8A] uppercase">
              STUDY LOG
            </span>
            <h2 className="font-display font-black text-xl uppercase text-[#161616]">
              RECENT STUDY SESSIONS
            </h2>
          </div>

          <button
            onClick={onExploreSets}
            className="font-mono text-xs font-bold uppercase text-[#D92B8A] hover:underline"
          >
            Study More →
          </button>
        </div>

        {sessionHistory.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF7F0] border border-[#161616] space-y-2">
            <p className="text-xs text-[#6B6862] font-medium">
              No sessions completed yet. Start your first lesson to see your learning activity recorded here.
            </p>
            <button
              onClick={onExploreSets}
              className="px-4 py-2 bg-[#D92B8A] text-white font-display text-xs font-black uppercase rounded-none tactile-btn"
            >
              START STUDYING NOW
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sessionHistory.slice(0, 8).map((session, idx) => (
              <div key={`${session.timestamp}-${idx}`} className="p-3.5 bg-[#FAF7F0] border border-[#161616] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-[#161616] text-[#FAF7F0] font-mono text-[9px] font-bold uppercase">
                    {session.mode}
                  </span>
                  <div>
                    <h4 className="font-display font-bold text-xs uppercase text-[#161616]">
                      {session.setTitle}
                    </h4>
                    <span className="font-mono text-[10px] text-[#6B6862]">
                      {new Date(session.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="font-mono text-xs font-bold text-[#161616]">
                  {session.totalConcepts} Concepts
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Personal Notes Archive Preview */}
      <div className="bg-white border-2 border-[#161616] p-6 sm:p-8 rounded-none shadow-[5px_5px_0px_#161616] space-y-5">
        <div className="flex items-center justify-between border-b-2 border-[#161616]/15 pb-3">
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold text-[#D92B8A] uppercase">
              KNOWLEDGE VAULT
            </span>
            <h2 className="font-display font-black text-xl uppercase text-[#161616]">
              SAVED STUDY NOTES ({notesCount})
            </h2>
          </div>

          {onNavigateToArchive && (
            <button
              onClick={onNavigateToArchive}
              className="font-mono text-xs font-bold uppercase text-[#D92B8A] hover:underline flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View All Notes Archive →</span>
            </button>
          )}
        </div>

        {userNotes.length === 0 ? (
          <div className="p-6 text-center bg-[#FAF7F0] border border-[#161616] space-y-2">
            <p className="text-xs text-[#6B6862] font-medium">
              No personal notes saved yet. Take notes in your lessons and they will be archived here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userNotes.slice(0, 4).map((note) => (
              <div key={note.id} className="p-4 bg-[#FAF7F0] border border-[#161616] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] font-bold uppercase px-1.5 py-0.5 bg-white border border-[#161616] text-[#161616]">
                    {note.targetTitle}
                  </span>
                  <span className="font-mono text-[9px] text-[#6B6862]">
                    {new Date(note.updatedAt || note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-xs text-[#2C2C2A] line-clamp-3 leading-relaxed font-medium">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QUIZ CONNECTION (Optional CTA at bottom) */}
      <div className="bg-[#FAF7F0] border-2 border-[#161616] p-5 sm:p-6 rounded-none shadow-[4px_4px_0px_#161616] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#161616] text-[#FAF7F0] font-mono text-[10px] font-bold uppercase">
            <span>SEPARATE PRODUCT</span>
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
