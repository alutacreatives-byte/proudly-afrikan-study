import React, { useState, useMemo } from 'react';
import { StudySet, AppView } from '../types';
import { 
  Search, 
  Plus, 
  Clock, 
  Layers, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  Trash2, 
  Sparkles,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

interface SubjectExplorerProps {
  studySets: StudySet[];
  onSelectSet: (set: StudySet, mode?: AppView) => void;
  onCreateSetClick: () => void;
  onDeleteCustomSet: (setId: string) => void;
}

const CATEGORIES = [
  'ALL SUBJECTS',
  'MY CUSTOM SETS',
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
  'LANGUAGES',
  'EXAM PREPARATION',
];

export const SubjectExplorer: React.FC<SubjectExplorerProps> = ({
  studySets,
  onSelectSet,
  onCreateSetClick,
  onDeleteCustomSet,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL SUBJECTS');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSets = useMemo(() => {
    return (studySets || []).filter(set => {
      if (!set) return false;
      const setCategory = (set.category || 'General Knowledge').toUpperCase();

      // Category filter
      if (selectedCategory === 'MY CUSTOM SETS' && !set.isCustom) {
        return false;
      }
      if (
        selectedCategory !== 'ALL SUBJECTS' &&
        selectedCategory !== 'MY CUSTOM SETS' &&
        setCategory !== selectedCategory
      ) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (set.title || '').toLowerCase().includes(q);
        const matchesDesc = (set.description || '').toLowerCase().includes(q);
        const matchesConcepts = Array.isArray(set.concepts) && set.concepts.some(
          c =>
            c &&
            ((c.title || '').toLowerCase().includes(q) ||
            (c.flashcardQuestion || '').toLowerCase().includes(q) ||
            (Array.isArray(c.tags) && c.tags.some(t => t.toLowerCase().includes(q))))
        );
        return matchesTitle || matchesDesc || matchesConcepts;
      }

      return true;
    });
  }, [studySets, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Editorial Header */}
      <div className="border-b-[2.5px] border-[#161616] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#FAF7F0] border border-[#161616] text-[#161616] font-mono text-xs font-bold uppercase rounded mb-2">
            <span>CURRICULUM & ARCHIVE</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-[#161616]">
            SUBJECT EXPLORER
          </h1>
          <p className="text-sm sm:text-base text-[#6B6862] font-medium mt-1">
            Browse core African disciplines, general knowledge modules, or your custom sets.
          </p>
        </div>

        <button
          id="explorer-create-set-btn"
          onClick={onCreateSetClick}
          className="px-5 py-3 bg-[#D92B8A] text-white font-display text-xs sm:text-sm font-black tracking-wider uppercase rounded-md tactile-btn flex items-center justify-center gap-2 whitespace-nowrap self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>CREATE A STUDY SET</span>
        </button>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6862]" />
          <input
            id="subject-search-input"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search subjects, concepts, historical figures, topics..."
            className="w-full bg-[#FFFFFF] border-[2.5px] border-[#161616] rounded-lg py-3.5 pl-12 pr-4 text-sm font-medium text-[#161616] placeholder:text-[#6B6862] shadow-[3px_3px_0px_#161616] focus:outline-none focus:ring-2 focus:ring-[#D92B8A]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#6B6862] hover:text-[#161616]"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Categories Horizontal Scroll / Wrap */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`cat-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-md font-display text-xs font-bold uppercase tracking-wider whitespace-nowrap border-[2px] transition-all ${
                  isSelected
                    ? 'bg-[#161616] text-white border-[#161616] shadow-[2px_2px_0px_#D92B8A]'
                    : 'bg-[#FFFFFF] text-[#161616] border-[#161616] hover:bg-[#F0EAE0]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Study Sets */}
      {filteredSets.length === 0 ? (
        <div className="bg-[#FFFFFF] border-[2.5px] border-[#161616] rounded-xl p-8 sm:p-12 text-center space-y-4 shadow-[4px_4px_0px_#161616]">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF7F0] border-2 border-[#161616] flex items-center justify-center text-[#D92B8A]">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="font-display font-black text-xl uppercase text-[#161616]">
            No study sets found
          </h3>
          <p className="text-xs sm:text-sm text-[#6B6862] max-w-md mx-auto">
            {searchQuery
              ? `No results matching "${searchQuery}". Try a different keyword or create a custom set.`
              : 'No sets available in this category yet.'}
          </p>
          <button
            onClick={onCreateSetClick}
            className="px-5 py-2.5 bg-[#D92B8A] text-white font-display text-xs font-black uppercase rounded-md tactile-btn inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE THIS STUDY SET NOW</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSets.map(set => (
            <div
              key={set.id}
              id={`study-set-card-${set.id}`}
              className="tactile-card bg-[#FFFFFF] rounded-xl p-5 sm:p-6 flex flex-col justify-between group relative"
            >
              {/* Top Meta */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-[#FAF7F0] text-[#161616] border border-[#161616] rounded text-[10px] font-mono font-bold uppercase">
                      {set.category || 'GENERAL'}
                    </span>
                    {set.isCustom && (
                      <span className="px-2 py-0.5 bg-[#D92B8A] text-white rounded text-[10px] font-mono font-bold uppercase border border-[#161616]">
                        CUSTOM
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-[#6B6862]">
                      <Clock className="w-3.5 h-3.5" />
                      {set.estimatedMinutes || 10}m
                    </span>
                    {set.isCustom && (
                      <button
                        title="Delete custom set"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete "${set.title}"?`)) {
                            onDeleteCustomSet(set.id);
                          }
                        }}
                        className="p-1 text-[#6B6862] hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 
                  onClick={() => onSelectSet(set, 'set-detail')}
                  className="font-display font-black text-xl text-[#161616] uppercase leading-snug mb-2 cursor-pointer group-hover:text-[#D92B8A] transition-colors"
                >
                  {set.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#6B6862] line-clamp-2 leading-relaxed mb-4">
                  {set.description}
                </p>

                {/* Concept preview chips */}
                <div className="space-y-1.5">
                  <span className="text-xs font-mono font-bold text-[#6B6862] uppercase tracking-wider">
                    {(set.concepts || []).length} CONCEPTS INCLUDE:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(set.concepts || []).slice(0, 3).map(c => (
                      <span
                        key={c.id}
                        className="px-2 py-0.5 bg-[#FAF7F0] border border-[#161616]/40 text-[#161616] text-xs font-semibold rounded truncate max-w-[220px]"
                      >
                        {c.title}
                      </span>
                    ))}
                    {(set.concepts || []).length > 3 && (
                      <span className="px-2 py-0.5 bg-[#FAF7F0] text-[#6B6862] text-xs font-mono font-bold">
                        +{(set.concepts || []).length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Quick Launch Bar (No Quiz) */}
              <div className="mt-6 pt-4 border-t-2 border-[#161616]/10 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id={`set-study-btn-${set.id}`}
                    onClick={() => onSelectSet(set, 'study')}
                    className="py-2 bg-[#D92B8A] text-white font-display text-xs font-black uppercase rounded-none tactile-btn flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>LEARN</span>
                  </button>

                  <button
                    id={`set-cards-btn-${set.id}`}
                    onClick={() => onSelectSet(set, 'flashcards')}
                    className="py-2 bg-[#FFFFFF] border-2 border-[#161616] text-[#161616] font-display text-xs font-black uppercase rounded-none hover:bg-[#FAF7F0] shadow-[2px_2px_0px_#161616] flex items-center justify-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#D92B8A]" />
                    <span>CARDS</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    id={`set-practice-btn-${set.id}`}
                    onClick={() => onSelectSet(set, 'practice')}
                    className="py-1.5 bg-[#FAF7F0] hover:bg-[#F0EAE0] text-[#161616] font-display text-[11px] font-bold uppercase rounded-none border border-[#161616] flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#161616]" />
                    <span>PRACTISE</span>
                  </button>

                  <button
                    id={`set-detail-btn-${set.id}`}
                    onClick={() => onSelectSet(set, 'set-detail')}
                    className="py-1.5 bg-[#FAF7F0] hover:bg-[#F0EAE0] text-[#161616] font-display text-[11px] font-bold uppercase rounded-none border border-[#161616] flex items-center justify-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3 text-[#D92B8A]" />
                    <span>DETAILS</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
