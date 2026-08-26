import React, { useState } from 'react';
import { Logo } from './Logo';
import { AppView, UserStats, UserProfile } from '../types';
import { 
  BookOpen, 
  RotateCcw, 
  Flame, 
  Menu, 
  X,
  Plus,
  CalendarDays,
  FileText,
  Download,
  GraduationCap,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  stats: UserStats;
  reviewCount: number;
  onCreateSetClick: (initialMethod?: 'topic' | 'paste' | 'upload', initialTopic?: string) => void;
  onOpenTutor?: (mode?: 'tutor' | 'homework') => void;
  currentUser?: UserProfile;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  stats,
  reviewCount,
  onCreateSetClick,
  onOpenTutor,
  currentUser,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // The 6 Main Navigation Menu Items
  const primaryNavItems: { 
    id: string; 
    targetView: AppView; 
    label: string; 
    icon: React.ComponentType<{ className?: string }>; 
    badge?: number;
    matchViews: AppView[];
  }[] = [
    { 
      id: 'create', 
      targetView: 'create', 
      label: 'CREATE', 
      icon: Sparkles,
      matchViews: ['create'],
    },
    { 
      id: 'study', 
      targetView: 'study-hub', 
      label: 'STUDY', 
      icon: BookOpen,
      matchViews: ['study-hub', 'study', 'learn', 'flashcards', 'practice', 'sets', 'set-detail'],
    },
    { 
      id: 'tutor', 
      targetView: 'homework', 
      label: 'TUTOR', 
      icon: GraduationCap,
      matchViews: ['homework'],
    },
    { 
      id: 'review', 
      targetView: 'review', 
      label: 'REVIEW', 
      icon: RotateCcw, 
      badge: reviewCount,
      matchViews: ['review'],
    },
    { 
      id: 'plan', 
      targetView: 'planner', 
      label: 'PLAN', 
      icon: CalendarDays,
      matchViews: ['planner'],
    },
    { 
      id: 'archive', 
      targetView: 'archive', 
      label: 'ARCHIVE', 
      icon: FileText,
      matchViews: ['archive', 'progress'],
    },
  ];

  const handleNavClick = (view: AppView) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* Top Black Mono Ticker */}
      <div className="bg-[#121212] text-[#F8F5EE] border-b border-[#242424] px-3 sm:px-6 lg:px-8 py-2 flex justify-between items-center text-xs font-mono tracking-wider uppercase select-none w-full overflow-x-hidden">
        <div className="flex items-center gap-2 min-w-0 truncate">
          <span className="inline-block w-2 h-2 rounded-full bg-[#D92B8A] animate-pulse flex-shrink-0"></span>
          <span className="font-bold text-white truncate text-xs">PROUDLY AFRIKAN EDUCATION</span>
          <span className="text-[#666666] hidden md:inline">|</span>
          <span className="text-[#CCCCCC] hidden md:inline truncate text-xs">THE STUDY COMPANION</span>
        </div>
        <div className="flex items-center gap-2.5 sm:gap-3 text-xs text-[#EAEAEA] font-bold flex-shrink-0">
          <a
            href="/api/download-zip"
            download="proudly-afrikan-study-companion.zip"
            className="hidden xs:inline-flex items-center gap-1.5 text-[#F8F5EE] hover:text-[#D92B8A] transition-colors border border-[#444] px-2.5 py-1 rounded-full bg-[#222]"
            title="Download full project source code as .ZIP"
          >
            <Download className="w-3.5 h-3.5 text-[#D92B8A]" />
            <span className="font-mono text-xs uppercase font-bold">SOURCE .ZIP</span>
          </a>
          {currentUser && (
            <>
              <span className="text-[#666666] hidden sm:inline">|</span>
              <button
                onClick={() => handleNavClick('archive')}
                className="hidden sm:flex items-center gap-1.5 text-white hover:text-[#D92B8A] transition-colors"
                title="View your study notes and account"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                <span className="font-mono text-xs uppercase font-bold truncate max-w-[100px]">{currentUser.name.split(' ')[0]}</span>
              </button>
            </>
          )}
          <span className="text-[#666666] hidden sm:inline">|</span>
          <span className="hidden sm:inline text-stone-200">UNLIMITED</span>
          <span className="text-[#D92B8A]">●</span>
          <span className="text-white font-mono text-xs">STUDY SUITE</span>
        </div>
      </div>

      {/* Floating Capsule Header Container */}
      <div className="sticky top-2 z-40 px-2 sm:px-4 lg:px-8 py-1.5 w-full max-w-7xl mx-auto">
        <header className="w-full rounded-full bg-white/95 backdrop-blur-md border border-stone-200 shadow-[0_10px_30px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.05)] px-3 sm:px-5 py-2 flex items-center justify-between gap-2 sm:gap-3">
          {/* Brand Logo */}
          <div className="flex items-center flex-shrink-0">
            <Logo 
              size="md" 
              showTagline={false} 
              onClick={() => handleNavClick('home')} 
            />
          </div>

          {/* Clean 6-Item Desktop Navigation (Visible from md: 768px upwards) */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1.5 xl:gap-2">
            {primaryNavItems.map(item => {
              const isActive = item.matchViews.includes(currentView);
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => handleNavClick(item.targetView)}
                  className={`relative px-2.5 lg:px-3.5 py-1.5 font-display text-xs lg:text-[13px] font-bold tracking-wider rounded-full transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#18181B] text-white shadow-sm'
                      : item.id === 'tutor'
                      ? 'text-stone-700 hover:text-[#D92B8A] hover:bg-pink-50/80'
                      : 'text-stone-700 hover:text-[#18181B] hover:bg-stone-100/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : item.id === 'tutor' ? 'text-[#D92B8A]' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                  {Boolean(item.badge && item.badge > 0) && (
                    <span className="px-2 py-0.5 text-[11px] font-mono font-bold rounded-full bg-[#D92B8A] text-white leading-none">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Area (Desktop & Tablet) */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {/* Streak Counter pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 border border-stone-200 rounded-full" title="Active Study Streak">
              <Flame className="w-4 h-4 text-[#D92B8A] fill-[#D92B8A]" />
              <span className="font-mono text-xs font-bold text-stone-800">
                {stats.streakDays}d
              </span>
            </div>

            {/* MAKE RESOURCE CTA BUTTON */}
            <button
              id="header-create-set-btn"
              onClick={() => onCreateSetClick('topic')}
              className="px-3.5 lg:px-4 py-2 bg-[#D92B8A] hover:bg-[#c02479] text-white font-display text-xs font-black tracking-wider uppercase rounded-full shadow-[0_4px_12px_rgba(217,43,138,0.3)] transition-all flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
            >
              <span>MAKE RESOURCE</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>

          {/* Mobile Controls (< md screens) */}
          <div className="flex items-center gap-2 md:hidden flex-shrink-0">
            {/* Quick Streak on Mobile */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-stone-100 border border-stone-200 rounded-full">
              <Flame className="w-3.5 h-3.5 text-[#D92B8A] fill-[#D92B8A]" />
              <span className="font-mono text-xs font-bold text-stone-800">
                {stats.streakDays}d
              </span>
            </div>

            {/* Quick New Set CTA */}
            <button
              id="header-mobile-create-set-btn"
              onClick={() => onCreateSetClick('topic')}
              className="px-3.5 py-1.5 bg-[#D92B8A] hover:bg-[#c02479] text-white font-display text-xs font-black rounded-full flex items-center gap-1 shadow-sm whitespace-nowrap"
              title="Create Study Set"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>NEW</span>
            </button>

            {/* Responsive Menu Hamburger Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-full transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4 text-[#161616]" />
              ) : (
                <Menu className="w-4 h-4 text-[#161616]" />
              )}
            </button>
          </div>
        </header>

        {/* Mobile & Tablet Full Navigation Drawer with the 6 menu items */}
        {isMobileMenuOpen && (
          <div 
            id="mobile-nav-drawer"
            className="md:hidden mt-2 p-4 bg-white/98 backdrop-blur-md border border-stone-200 rounded-3xl shadow-2xl space-y-2 animate-fadeIn"
          >
            <div className="text-xs font-mono font-bold uppercase text-stone-500 px-2 pt-1 pb-1">
              PROUDLY AFRIKAN STUDY NAVIGATION
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {primaryNavItems.map(item => {
                const Icon = item.icon;
                const isActive = item.matchViews.includes(currentView);
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-item-${item.id}`}
                    onClick={() => handleNavClick(item.targetView)}
                    className={`w-full px-3.5 py-2.5 rounded-2xl font-display text-xs font-bold uppercase tracking-wider flex items-center justify-between border transition-all ${
                      isActive
                        ? 'bg-[#18181B] text-white border-[#18181B] shadow-sm'
                        : item.id === 'tutor'
                        ? 'bg-pink-50 text-[#D92B8A] border-pink-200 hover:bg-pink-100'
                        : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.id === 'tutor' ? 'text-[#D92B8A]' : 'text-stone-600'}`} />
                      <span>{item.label}</span>
                    </div>
                    {Boolean(item.badge && item.badge > 0) && (
                      <span className="px-2 py-0.5 bg-[#D92B8A] text-white text-xs font-mono font-bold rounded-full">
                        {item.badge} DUE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  onCreateSetClick('topic');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 bg-[#D92B8A] text-white rounded-2xl font-display text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>MAKE NEW STUDY RESOURCE</span>
              </button>

              <a
                href="/api/download-zip"
                download="proudly-afrikan-study-companion.zip"
                className="w-full px-4 py-2.5 bg-[#18181B] text-white rounded-2xl font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-[#D92B8A]" />
                <span>DOWNLOAD SOURCE (.ZIP)</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

