import React from 'react';
import { StudySet, AppView, UserStats, StudyConcept } from '../types';
import { 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  RotateCcw, 
  FolderPlus, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Flame, 
  Check, 
  AlertTriangle,
  CalendarDays,
  ExternalLink,
  Target
} from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (view: AppView) => void;
  onSelectSet: (set: StudySet, defaultMode?: AppView) => void;
  featuredSets: StudySet[];
  reviewItemsCount: number;
  stats: UserStats;
  onCreateSetClick: () => void;
  onStartReview: () => void;
  onStartStudyPlan: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onSelectSet,
  featuredSets,
  reviewItemsCount,
  stats,
  onCreateSetClick,
  onStartReview,
  onStartStudyPlan,
}) => {
  const studyEngines = [
    {
      id: 'study' as AppView,
      title: 'LEARN',
      subtitle: 'Master material through clear concept lessons, analogies, and self-explanation.',
      icon: BookOpen,
      tag: 'LESSONS & INSIGHT',
      accentColor: 'bg-[#D92B8A]',
      btnText: 'START LEARNING',
    },
    {
      id: 'flashcards' as AppView,
      title: 'FLASHCARDS',
      subtitle: 'Test memory with active-recall prompts and 4-tier retention ratings.',
      icon: Layers,
      tag: 'ACTIVE RECALL',
      accentColor: 'bg-[#161616]',
      btnText: 'FLIP CARDS',
    },
    {
      id: 'practice' as AppView,
      title: 'PRACTISE',
      subtitle: 'Reinforce concepts with immediate formative feedback and explanations.',
      icon: CheckCircle2,
      tag: 'FORMATIVE REINFORCE',
      accentColor: 'bg-[#161616]',
      btnText: 'START PRACTICE',
    },
    {
      id: 'review' as AppView,
      title: 'REVIEW QUEUE',
      subtitle: 'Reinforce concepts that need attention using spaced and interleaved review.',
      icon: RotateCcw,
      tag: `${reviewItemsCount} IN QUEUE`,
      accentColor: 'bg-[#D92B8A]',
      btnText: 'OPEN REVIEW QUEUE',
      badge: reviewItemsCount > 0 ? `${reviewItemsCount} Due` : undefined,
    },
    {
      id: 'planner' as AppView,
      title: 'STUDY PLANNER',
      subtitle: 'Time-boxed 5, 10, 20, or 30-min sessions curated to your retention needs.',
      icon: CalendarDays,
      tag: 'TIME-BOXED SESSIONS',
      accentColor: 'bg-[#161616]',
      btnText: 'CHOOSE DURATION',
    },
    {
      id: 'sets' as AppView,
      title: 'MY STUDY SETS',
      subtitle: 'Browse all subject libraries, explore curriculum topics, or generate new sets.',
      icon: FolderPlus,
      tag: 'CURRICULUM ARCHIVE',
      accentColor: 'bg-[#161616]',
      btnText: 'BROWSE ALL SETS',
    },
  ];

  const quickCategories = [
    'AFRICAN HISTORY',
    'AFRICAN GEOGRAPHY',
    'AFRICAN CULTURE',
    'AFRICAN LANGUAGES',
    'AFRICAN PROVERBS',
    'AFRICAN LEADERS & ICONS',
    'BIBLE & WISDOM',
    'GENERAL KNOWLEDGE',
    'SCIENCE',
    'BUSINESS',
  ];

  return (
    <div className="space-y-10 sm:space-y-12 pb-16">
      {/* Editorial Hero Header matching the Quiz companion screenshot layout */}
      <section className="border-b-2 border-[#161616] pb-10 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Big Headline & Edition Badge */}
          <div className="lg:col-span-7 space-y-4">
            {/* Edition Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF7F0] border-2 border-[#161616] shadow-[2px_2px_0px_#161616] text-[11px] font-mono font-bold tracking-wider uppercase text-[#161616]">
              <span className="w-2.5 h-2.5 bg-[#D92B8A] inline-block"></span>
              <span>PROUDLY AFRIKAN STUDY • LEARNING COMPANION</span>
            </div>
            
            {/* Giant Oversized Display Headline */}
            <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl uppercase tracking-tighter text-[#161616] leading-[0.88]">
              LEARN DEEPLY.<br />
              <span className="text-[#D92B8A]">REMEMBER</span><br />
              <span className="text-[#D92B8A]">EVERYTHING.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#161616] opacity-90 max-w-xl font-normal leading-relaxed pt-2">
              Transform any subject, notes, or topic into active concept lessons, tactile flashcards, formative practice, and spaced retention queues.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={onCreateSetClick}
                className="px-6 py-3.5 bg-[#D92B8A] text-white font-display text-xs sm:text-sm font-black uppercase tracking-wider rounded-none tactile-btn shadow-[3px_3px_0px_#161616] flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>CREATE A STUDY SET</span>
              </button>

              <button
                onClick={onStartStudyPlan}
                className="px-6 py-3.5 bg-white border-2 border-[#161616] text-[#161616] font-display text-xs sm:text-sm font-black uppercase tracking-wider rounded-none shadow-[3px_3px_0px_#161616] hover:bg-[#FAF7F0] flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-[#D92B8A]" />
                <span>START 10-MIN PLAN</span>
              </button>
            </div>
          </div>

          {/* Right Column: Instant Inspiration & Live Metrics */}
          <div className="lg:col-span-5 space-y-4">
            {/* Instant Inspiration Box */}
            <div className="bg-[#FAF7F0] border-2 border-[#161616] shadow-[4px_4px_0px_#161616] p-4 sm:p-5 rounded-none space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#161616]/20 pb-2.5">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#161616]">
                  <Sparkles className="w-3.5 h-3.5 text-[#D92B8A]" />
                  <span>INSTANT INSPIRATION</span>
                </div>
                <span className="font-mono text-[10px] text-[#6B6862] font-semibold uppercase tracking-wider">
                  TAP TO LEARN
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { label: '👑 Kingdom of Mali', topic: 'The Mali Empire and Mansa Musa' },
                  { label: '🌍 Great Rift Valley', topic: 'Geography of the Great Rift Valley' },
                  { label: '📚 African Literature', topic: 'African Literature & Famous Authors' },
                  { label: '⚡ Renewable Energy', topic: 'Renewable Energy & Solar in Africa' },
                  { label: '🗣️ Swahili Language', topic: 'Swahili Greetings and Daily Vocabulary' },
                  { label: '🏛️ Great Zimbabwe', topic: 'Medieval Stone Architecture of Great Zimbabwe' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const matched = featuredSets.find(s => s.title.toLowerCase().includes(item.label.split(' ')[1].toLowerCase()));
                      if (matched) {
                        onSelectSet(matched, 'study');
                      } else {
                        onCreateSetClick();
                      }
                    }}
                    className="px-2.5 py-1.5 bg-[#FFFFFF] border-2 border-[#161616] hover:bg-[#D92B8A] hover:text-white font-mono text-xs font-medium transition-all shadow-[1.5px_1.5px_0px_#161616] active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 bg-[#FFFFFF] border-2 border-[#161616] p-3 rounded-none shadow-[3px_3px_0px_#161616]">
              <div className="text-center border-r-2 border-[#161616]/20 pr-2">
                <div className="font-mono text-lg sm:text-xl font-black text-[#D92B8A] flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 fill-[#D92B8A]" />
                  {stats.streakDays}
                </div>
                <div className="font-mono text-[10px] font-bold text-[#6B6862] uppercase tracking-wider">
                  Streak
                </div>
              </div>

              <div className="text-center border-r-2 border-[#161616]/20 px-2">
                <div className="font-mono text-lg sm:text-xl font-black text-[#161616]">
                  {stats.conceptsStudied}
                </div>
                <div className="font-mono text-[10px] font-bold text-[#6B6862] uppercase tracking-wider">
                  Learned
                </div>
              </div>

              <div className="text-center pl-2">
                <div className="font-mono text-lg sm:text-xl font-black text-[#D92B8A]">
                  {stats.sessionsCompleted}
                </div>
                <div className="font-mono text-[10px] font-bold text-[#6B6862] uppercase tracking-wider">
                  Sessions
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spaced Review Callout if user has items needing review */}
      {reviewItemsCount > 0 && (
        <section 
          id="home-review-alert"
          className="bg-[#FFFFFF] border-2 border-[#161616] rounded-none p-5 sm:p-6 shadow-[5px_5px_0px_#D92B8A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-[#FDEAF4] border-2 border-[#161616] rounded-none text-[#D92B8A]">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="inline-block px-2 py-0.5 bg-[#D92B8A] text-white font-mono text-[10px] font-bold uppercase rounded-none mb-1 border border-[#161616]">
                SPACED REPETITION QUEUE
              </div>
              <h2 className="font-display text-lg sm:text-xl font-black uppercase text-[#161616]">
                {reviewItemsCount} {reviewItemsCount === 1 ? 'Concept Needs' : 'Concepts Need'} Active Reinforcement
              </h2>
              <p className="text-xs sm:text-sm text-[#6B6862] mt-0.5 font-medium">
                Revisit flagged concepts today to prevent memory decay and lock into long-term recall.
              </p>
            </div>
          </div>

          <button
            onClick={onStartReview}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#D92B8A] text-white font-display text-xs sm:text-sm font-black tracking-wider uppercase rounded-none tactile-btn flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>START REVIEW QUEUE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      )}

      {/* The 6 Study Engines Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-[10px] font-bold text-[#D92B8A] uppercase">
              PEDAGOGICAL ARCHITECTURE
            </span>
            <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-[#161616]">
              6 STUDY ENGINES
            </h2>
          </div>
          <span className="font-mono text-xs font-semibold text-[#6B6862]">
            LEARN • UNDERSTAND • PRACTISE • REMEMBER • REVIEW
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {studyEngines.map(engine => {
            const Icon = engine.icon;
            const isPrimary = engine.id === 'study';

            return (
              <div
                key={engine.id}
                onClick={() => onNavigate(engine.id)}
                className={`bg-[#FFFFFF] border-2 border-[#161616] p-5 sm:p-6 flex flex-col justify-between cursor-pointer group shadow-[4px_4px_0px_#161616] hover:shadow-[6px_6px_0px_#D92B8A] transition-all relative ${
                  isPrimary ? 'ring-2 ring-[#D92B8A]' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 border-2 border-[#161616] flex items-center justify-center shadow-[2px_2px_0px_#161616] ${
                      isPrimary ? 'bg-[#D92B8A] text-white' : 'bg-[#FAF7F0] text-[#161616]'
                    }`}>
                      <Icon className="w-5 h-5 stroke-[2.5]" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {engine.badge && (
                        <span className="px-2 py-0.5 bg-[#D92B8A] text-white text-[10px] font-mono font-bold uppercase border border-[#161616]">
                          {engine.badge}
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-[#FAF7F0] text-[#161616] text-[10px] font-mono font-bold uppercase border border-[#161616]">
                        {engine.tag}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display font-black text-2xl uppercase text-[#161616] group-hover:text-[#D92B8A] transition-colors leading-tight mb-2">
                    {engine.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#6B6862] leading-relaxed font-medium">
                    {engine.subtitle}
                  </p>
                </div>

                {/* Bottom Action CTA */}
                <div className="mt-6 pt-4 border-t-2 border-[#161616]/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-display text-xs font-black uppercase text-[#161616] tracking-wider group-hover:translate-x-1 transition-transform">
                    <span className="w-8 sm:w-10 h-[2px] bg-[#D92B8A] transition-all group-hover:w-12"></span>
                    <span>{engine.btnText}</span>
                  </div>
                  <div className="w-7 h-7 border border-[#161616] bg-[#161616] text-white flex items-center justify-center group-hover:bg-[#D92B8A] group-hover:border-[#D92B8A] transition-colors shadow-[1px_1px_0px_#161616]">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured / Core African Curriculum Sets */}
      <section className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-[#161616]">
              FEATURED STUDY SETS
            </h2>
            <p className="text-xs sm:text-sm text-[#6B6862] font-medium">
              Curated, deep-retention learning sets from the Proudly Afrikan curriculum.
            </p>
          </div>

          <button
            onClick={() => onNavigate('sets')}
            className="self-start sm:self-auto font-display text-xs font-bold uppercase tracking-wider text-[#D92B8A] hover:underline flex items-center gap-1"
          >
            <span>VIEW ALL SETS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {featuredSets.slice(0, 3).map(set => (
            <div
              key={set.id}
              className="bg-[#FFFFFF] border-2 border-[#161616] rounded-none p-5 sm:p-6 flex flex-col justify-between shadow-[4px_4px_0px_#161616]"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 bg-[#FAF7F0] text-[#161616] border border-[#161616] text-[10px] font-mono font-bold uppercase">
                    {set.category || 'General Knowledge'}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-[#6B6862]">
                    <Clock className="w-3.5 h-3.5" />
                    {set.estimatedMinutes || 10} MINS
                  </span>
                </div>

                <h3 className="font-display font-black text-lg sm:text-xl text-[#161616] uppercase leading-tight mb-2">
                  {set.title}
                </h3>

                <p className="text-xs text-[#6B6862] line-clamp-2 leading-relaxed">
                  {set.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t-2 border-[#161616]/10 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#161616]">
                  <span>{(set.concepts || []).length} CONCEPTS</span>
                  <span className="text-[#D92B8A]">READY TO STUDY</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectSet(set, 'study')}
                    className="w-full py-2 bg-[#D92B8A] text-white font-display text-xs font-black uppercase rounded-none tactile-btn"
                  >
                    LEARN
                  </button>
                  <button
                    onClick={() => onSelectSet(set, 'flashcards')}
                    className="w-full py-2 bg-[#FFFFFF] border-2 border-[#161616] text-[#161616] font-display text-xs font-black uppercase rounded-none hover:bg-[#FAF7F0] shadow-[2px_2px_0px_#161616]"
                  >
                    CARDS
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Category Browser Pills */}
      <section className="bg-[#FFFFFF] border-2 border-[#161616] rounded-none p-5 sm:p-6 shadow-[4px_4px_0px_#161616] space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-black text-base sm:text-lg uppercase text-[#161616]">
            BROWSE BY DISCIPLINE & SUBJECT
          </h2>
          <button
            onClick={() => onNavigate('sets')}
            className="text-xs font-mono font-bold text-[#D92B8A] hover:underline uppercase"
          >
            All Subjects →
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {quickCategories.map(cat => (
            <button
              key={cat}
              onClick={() => onNavigate('sets')}
              className="px-3 py-1.5 bg-[#FAF7F0] hover:bg-[#D92B8A] hover:text-white border-[1.5px] border-[#161616] text-xs font-display font-bold uppercase transition-all shadow-[1.5px_1.5px_0px_#161616] active:translate-x-[1px] active:translate-y-[1px]"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* QUIZ CONNECTION (Optional CTA at bottom) */}
      <section className="bg-[#FAF7F0] border-2 border-[#161616] p-6 sm:p-8 rounded-none shadow-[5px_5px_0px_#161616] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#161616] text-[#FAF7F0] font-mono text-[10px] font-bold uppercase">
            <span>SEPARATE PRODUCT: PROUDLY AFRIKAN QUIZ</span>
          </div>
          <h3 className="font-display font-black text-2xl uppercase text-[#161616] tracking-tight">
            READY TO TEST YOUR KNOWLEDGE?
          </h3>
          <p className="text-xs sm:text-sm text-[#6B6862] leading-relaxed">
            Proudly Afrikan Study is built to help you learn, understand, and remember. When you are ready for a timed, competitive challenge with scoring, head over to the Quiz platform.
          </p>
        </div>

        <a
          href="https://proudlyafrikan.com/quiz"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3.5 bg-[#D92B8A] text-white hover:bg-[#BF1E75] font-display text-xs sm:text-sm font-black uppercase tracking-wider rounded-none tactile-btn shadow-[3px_3px_0px_#161616] transition-all flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0"
        >
          <span>TAKE THE PROUDLY AFRIKAN QUIZ →</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </section>
    </div>
  );
};
