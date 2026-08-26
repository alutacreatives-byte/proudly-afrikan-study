import React from 'react';
import { AppView, StudySet } from '../types';
import { GeneratorMode, InputMethod } from './CreateSetModal';
import { 
  Sparkles, 
  Type, 
  ClipboardList, 
  FileUp, 
  ArrowUpRight, 
  ArrowDown, 
  ArrowLeft,
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Layers, 
  FileSpreadsheet, 
  Presentation, 
  GraduationCap, 
  Target, 
  Compass, 
  Upload, 
  Clock, 
  Lightbulb,
  FileQuestion
} from 'lucide-react';

interface CreateViewProps {
  onNavigate: (view: AppView) => void;
  onCreateSetClick: (method?: InputMethod, topic?: string, mode?: GeneratorMode) => void;
  onSelectSet: (set: StudySet, mode?: AppView) => void;
  featuredSets: StudySet[];
  onBack?: () => void;
}

export const CreateView: React.FC<CreateViewProps> = ({
  onNavigate,
  onCreateSetClick,
  onSelectSet,
  featuredSets,
  onBack,
}) => {
  const inspirationTopics = [
    { label: '👑 Kingdom of Kush', topic: 'The Kingdom of Kush: Trade, Iron Metallurgy and Pyramids' },
    { label: '🌍 Great Rift Valley', topic: 'Geography and Geology of the Great Rift Valley' },
    { label: '📚 African Literature', topic: 'African Literature & Post-Colonial Authors' },
    { label: '⚙️ Solar In Africa', topic: 'Renewable Solar Energy and Microgrids in Africa' },
    { label: '🌱 Sustainable Agro', topic: 'Sustainable Agriculture and Soil Conservation' },
    { label: '🔬 Nubian Pyramids & Tech', topic: 'Nubian Pyramids, Astronomy and Ancient Engineering' },
    { label: '💡 Mansa Musa & Mali', topic: 'Mansa Musa, the Mali Empire and Trans-Saharan Trade Routes' },
    { label: '🌊 Swahili Coast Trade', topic: 'The Swahili Coast: Dhow Navigation, Kilwa and Monsoon Trade' },
  ];

  const generatorSuite = [
    {
      num: '01',
      tag: 'ASSESSMENT & TESTING',
      title: 'EXAM GENERATOR',
      subtitle: 'Build structured exams with multiple choice, essays, mark breakdowns, and teacher answer keys.',
      btnText: 'BUILD EXAM →',
      mode: 'exam' as GeneratorMode,
      icon: FileQuestion,
    },
    {
      num: '02',
      tag: 'PRACTICE & EXERCISES',
      title: 'WORKSHEET GENERATOR',
      subtitle: 'Create engaging classroom worksheets with matching activities, fill-in-blanks, and full answer solutions.',
      btnText: 'BUILD WORKSHEET →',
      mode: 'worksheet' as GeneratorMode,
      icon: FileSpreadsheet,
    },
    {
      num: '03',
      tag: 'TEACHING & PEDAGOGY',
      title: 'LESSON PLAN GENERATOR',
      subtitle: "Create pedagogical lesson plans with timed phases, Bloom's taxonomy objectives, and assessment checks.",
      btnText: 'BUILD LESSON PLAN →',
      mode: 'lesson-plan' as GeneratorMode,
      icon: BookOpen,
    },
    {
      num: '04',
      tag: 'DOCUMENT ANALYSIS',
      title: 'PDF → QUIZ',
      subtitle: 'Upload course PDFs or textbook chapters to generate grounded multiple-choice & analytical quiz questions.',
      btnText: 'UPLOAD PDF / DOC →',
      mode: 'pdf-quiz' as GeneratorMode,
      inputMethod: 'upload' as const,
      icon: Upload,
    },
    {
      num: '05',
      tag: 'DOCUMENT ANALYSIS',
      title: 'PDF → STUDY GUIDE',
      subtitle: 'Extract core key concepts, terminology, and memory triggers from any uploaded document.',
      btnText: 'EXTRACT STUDY GUIDE →',
      mode: 'study-guide' as GeneratorMode,
      inputMethod: 'upload' as const,
      icon: FileText,
    },
    {
      num: '06',
      tag: 'SLIDES & LECTURE',
      title: 'PRESENTATION GENERATOR',
      subtitle: 'Generate structured slide outlines with presenter notes, discussion prompts, and visual cues.',
      btnText: 'BUILD SLIDES →',
      mode: 'slides' as GeneratorMode,
      icon: Presentation,
    },
    {
      num: '07',
      tag: 'CURRICULUM & MODULES',
      title: 'COURSE MODULE BUILDER',
      subtitle: 'Design sequential multi-week curriculum modules with learning objectives and outcomes.',
      btnText: 'BUILD COURSE →',
      mode: 'course' as GeneratorMode,
      icon: Layers,
    },
    {
      num: '08',
      tag: 'STUDENT JOURNEY',
      title: 'LEARNING ROADMAP',
      subtitle: 'Construct personalized step-by-step learning pathways tailored to mastery level.',
      btnText: 'BUILD ROADMAP →',
      mode: 'roadmap' as GeneratorMode,
      icon: Compass,
    },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Back Button */}
      {onBack && (
        <button
          id="create-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 font-mono text-xs font-bold text-stone-600 hover:text-[#D92B8A] uppercase tracking-wider transition-colors px-3.5 py-1.5 bg-white border border-stone-200 rounded-full shadow-xs hover:border-pink-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      )}

      {/* Header Banner */}
      <section className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-pink-50 border border-pink-200 rounded-full text-xs font-mono font-bold tracking-wider uppercase text-[#D92B8A]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>RESOURCE CREATION & GENERATOR SUITE</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-[#161616] leading-none">
              CREATE. <span className="text-[#D92B8A]">BUILD ANYTHING.</span>
            </h1>
            <p className="text-base sm:text-lg text-stone-700 font-normal leading-relaxed">
              Transform any subject topic, pasted notes, or uploaded educational PDF into interactive study packs, exams, lesson plans, and worksheets in seconds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
            <button
              id="create-view-main-cta"
              onClick={() => onCreateSetClick('topic')}
              className="px-7 py-4 bg-[#D92B8A] hover:bg-[#c02479] text-white font-display text-xs sm:text-sm font-black uppercase tracking-wider rounded-full shadow-[0_4px_16px_rgba(217,43,138,0.35)] transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>LAUNCH BUILDER</span>
            </button>
            <button
              onClick={() => onNavigate('sets')}
              className="px-6 py-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-display text-xs sm:text-sm font-black uppercase tracking-wider rounded-full border border-stone-300 transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>BROWSE EXISTING SETS</span>
            </button>
          </div>
        </div>
      </section>

      {/* 1. THREE WAYS TO CREATE */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <span className="text-xs sm:text-sm font-mono font-bold text-[#D92B8A] uppercase tracking-widest block mb-1.5">
              PRIMARY INPUT METHODS
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-[#161616] tracking-tight uppercase leading-none">
              THREE WAYS TO CREATE.
            </h2>
          </div>
          <p className="text-sm font-mono text-stone-600 max-w-md">
            Choose your preferred input method to start generating your custom resource.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 01: TYPE IT */}
          <div
            id="create-view-card-type"
            onClick={() => onCreateSetClick('topic')}
            className="rounded-3xl bg-white border border-stone-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_45px_rgba(217,43,138,0.14)] hover:border-pink-300 hover:-translate-y-0.5 transition-all p-7 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-display font-black text-3xl text-stone-300 group-hover:text-[#D92B8A] transition-colors">
                  01
                </span>
                <span className="rounded-full px-3 py-1 bg-gradient-to-r from-[#D92B8A] to-[#f43f5e] text-white text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
                  FASTEST
                </span>
              </div>

              <div className="w-12 h-12 rounded-full bg-[#18181B] text-[#D92B8A] flex items-center justify-center my-4 group-hover:scale-105 transition-transform shadow-sm">
                <Type className="w-6 h-6 text-[#D92B8A] stroke-[2.2]" />
              </div>

              <h3 className="font-display font-black text-2xl uppercase text-[#161616] tracking-tight mb-1">
                TYPE IT.
              </h3>
              <div className="text-xs font-mono font-bold text-[#D92B8A] uppercase tracking-wider mb-2">
                TOPIC & IDEA MODE
              </div>
              <p className="text-sm text-stone-700 font-normal leading-relaxed">
                Enter any topic, curriculum subject, or concept and synthesize a structured resource instantly.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:text-[#D92B8A] transition-colors">
                LAUNCH BUILDER
              </span>
              <div className="w-7 h-7 rounded-full bg-[#18181B] text-white flex items-center justify-center group-hover:bg-[#D92B8A] transition-colors shadow-sm">
                <ArrowDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 02: PASTE IT */}
          <div
            id="create-view-card-paste"
            onClick={() => onCreateSetClick('paste')}
            className="rounded-3xl bg-white border border-stone-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_45px_rgba(217,43,138,0.14)] hover:border-pink-300 hover:-translate-y-0.5 transition-all p-7 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-display font-black text-3xl text-stone-300 group-hover:text-[#D92B8A] transition-colors">
                  02
                </span>
                <span className="rounded-full px-3 py-1 bg-stone-100 text-stone-800 border border-stone-200 text-xs font-mono font-bold uppercase tracking-wider">
                  DEEP CONTEXT
                </span>
              </div>

              <div className="w-12 h-12 rounded-full bg-[#18181B] text-[#D92B8A] flex items-center justify-center my-4 group-hover:scale-105 transition-transform shadow-sm">
                <ClipboardList className="w-6 h-6 text-[#D92B8A] stroke-[2.2]" />
              </div>

              <h3 className="font-display font-black text-2xl uppercase text-[#161616] tracking-tight mb-1">
                PASTE IT.
              </h3>
              <div className="text-xs font-mono font-bold text-[#D92B8A] uppercase tracking-wider mb-2">
                NOTES & ARTICLES
              </div>
              <p className="text-sm text-stone-700 font-normal leading-relaxed">
                Paste syllabus paragraphs, lesson transcripts, or curriculum excerpts to ground the generated questions.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:text-[#D92B8A] transition-colors">
                LAUNCH BUILDER
              </span>
              <div className="w-7 h-7 rounded-full bg-[#18181B] text-white flex items-center justify-center group-hover:bg-[#D92B8A] transition-colors shadow-sm">
                <ArrowDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 03: UPLOAD IT */}
          <div
            id="create-view-card-upload"
            onClick={() => onCreateSetClick('upload')}
            className="rounded-3xl bg-white border border-stone-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_45px_rgba(217,43,138,0.14)] hover:border-pink-300 hover:-translate-y-0.5 transition-all p-7 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-display font-black text-3xl text-stone-300 group-hover:text-[#D92B8A] transition-colors">
                  03
                </span>
                <span className="rounded-full px-3 py-1 bg-[#18181B] text-white text-xs font-mono font-bold uppercase tracking-wider">
                  PDF • DOC • DOCX
                </span>
              </div>

              <div className="w-12 h-12 rounded-full bg-[#18181B] text-[#D92B8A] flex items-center justify-center my-4 group-hover:scale-105 transition-transform shadow-sm">
                <FileUp className="w-6 h-6 text-[#D92B8A] stroke-[2.2]" />
              </div>

              <h3 className="font-display font-black text-2xl uppercase text-[#161616] tracking-tight mb-1">
                UPLOAD IT.
              </h3>
              <div className="text-xs font-mono font-bold text-[#D92B8A] uppercase tracking-wider mb-2">
                DOCUMENT & PDF MODE
              </div>
              <p className="text-sm text-stone-700 font-normal leading-relaxed">
                Drop in textbook chapters, PDFs, Word docs, or test drafts to extract context and synthesize classroom packs.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-900 group-hover:text-[#D92B8A] transition-colors">
                LAUNCH BUILDER
              </span>
              <div className="w-7 h-7 rounded-full bg-[#18181B] text-white flex items-center justify-center group-hover:bg-[#D92B8A] transition-colors shadow-sm">
                <ArrowDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ALL 8 GENERATORS */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <span className="text-xs sm:text-sm font-mono font-bold text-[#D92B8A] uppercase tracking-widest block mb-1.5">
              SPECIALIZED RESOURCE GENERATORS
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-[#161616] tracking-tight uppercase leading-none">
              STUDY TOOLS
            </h2>
          </div>
          <span className="text-xs font-mono font-semibold text-stone-500 uppercase tracking-wider">
            EACH GENERATOR SUPPORTS TEXT, TOPICS & DOCUMENT UPLOADS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {generatorSuite.map((gen) => {
            const Icon = gen.icon;
            return (
              <div
                key={gen.num}
                onClick={() => onCreateSetClick(gen.inputMethod || 'topic', '', gen.mode)}
                className="rounded-3xl bg-white border border-stone-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_18px_40px_rgba(217,43,138,0.12)] hover:border-pink-200 transition-all p-6 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display font-black text-2xl text-stone-300 group-hover:text-[#D92B8A] transition-colors">
                      {gen.num}
                    </span>
                    <span className="rounded-full px-2.5 py-1 bg-stone-100 text-stone-700 text-[11px] font-mono font-bold uppercase tracking-wider border border-stone-200">
                      {gen.tag}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-[#18181B] text-[#D92B8A] flex items-center justify-center my-3 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5 text-[#D92B8A]" />
                  </div>

                  <h3 className="font-display font-black text-lg uppercase text-[#161616] mb-2 leading-tight">
                    {gen.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-700 font-normal leading-relaxed">
                    {gen.subtitle}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="font-display font-black text-xs uppercase tracking-wider text-stone-900 group-hover:text-[#D92B8A] transition-colors">
                    {gen.btnText}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#D92B8A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. INSTANT TOPIC INSPIRATION */}
      <section className="bg-[#FAF8F5] border-2 border-stone-200/90 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2 font-display text-sm font-black uppercase tracking-wider text-stone-900">
            <Lightbulb className="w-4 h-4 text-[#D92B8A]" />
            <span>INSTANT CURRICULUM TOPIC INSPIRATION</span>
          </div>
          <span className="font-mono text-xs text-stone-500 font-bold uppercase tracking-wider">
            TAP ANY TOPIC TO PRE-POPULATE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {inspirationTopics.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                const matched = featuredSets.find(s => 
                  s.title.toLowerCase().includes(item.label.split(' ')[1]?.toLowerCase() || '')
                );
                if (matched) {
                  onSelectSet(matched, 'study');
                } else {
                  onCreateSetClick('topic', item.topic);
                }
              }}
              className="px-3.5 py-3 bg-white hover:bg-pink-50/70 border border-stone-200 hover:border-pink-300 text-stone-800 hover:text-[#D92B8A] font-medium text-xs sm:text-sm rounded-2xl transition-all shadow-sm flex items-center justify-between text-left cursor-pointer"
            >
              <span className="truncate font-semibold">{item.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 shrink-0 ml-1" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
