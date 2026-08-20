import React, { useState } from 'react';
import { Logo } from './Logo';
import { AppView, UserStats, UserProfile } from '../types';
import { 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  RotateCcw, 
  FolderPlus, 
  BarChart3, 
  Flame, 
  Menu, 
  X,
  Plus,
  CalendarDays,
  FileText,
  User,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  stats: UserStats;
  reviewCount: number;
  onCreateSetClick: () => void;
  currentUser?: UserProfile;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  stats,
  reviewCount,
  onCreateSetClick,
  currentUser,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { id: AppView; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'home', label: 'HOME', icon: BookOpen },
    { id: 'study', label: 'LEARN', icon: BookOpen },
    { id: 'flashcards', label: 'FLASHCARDS', icon: Layers },
    { id: 'practice', label: 'PRACTISE', icon: CheckCircle2 },
    { id: 'review', label: 'REVIEW', icon: RotateCcw, badge: reviewCount },
    { id: 'planner', label: 'PLANNER', icon: CalendarDays },
    { id: 'sets', label: 'MY SETS', icon: FolderPlus },
    { id: 'archive', label: 'MY ARCHIVE', icon: FileText },
    { id: 'progress', label: 'PROGRESS', icon: BarChart3 },
  ];

  const handleNavClick = (view: AppView) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Black Mono Bar matching Quiz edition header */}
      <div className="bg-[#121212] text-[#F8F5EE] border-b border-[#121212] px-4 sm:px-6 lg:px-8 py-1.5 flex justify-between items-center text-[10px] sm:text-[11px] font-mono tracking-wider uppercase select-none">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#D92B8A]"></span>
          <span className="font-bold text-white">PROUDLY AFRIKAN EDUCATION</span>
          <span className="text-[#888888] hidden sm:inline">|</span>
          <span className="text-[#AAAAAA] hidden sm:inline">TOOL 02: THE AI STUDY COMPANION</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[#DDDDDD] font-bold">
          {currentUser && (
            <button
              onClick={() => handleNavClick('archive')}
              className="flex items-center gap-1.5 text-white hover:text-[#D92B8A] transition-colors"
              title="View your study notes and account"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
              <span className="font-mono text-[10px] uppercase font-bold">{currentUser.name.split(' ')[0]}</span>
            </button>
          )}
          <span className="text-[#888888]">|</span>
          <span className="hidden sm:inline">FREE & UNLIMITED</span>
          <span className="text-[#D92B8A]">⚡</span>
          <span>GEMINI 3.7 FLASH</span>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-[#FAF7F0] border-b-[2.5px] border-[#161616] px-4 sm:px-6 lg:px-8 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Logo 
            size="md" 
            showTagline={false} 
            onClick={() => handleNavClick('home')} 
          />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3 py-1.5 font-display text-xs xl:text-xs font-bold tracking-wider rounded-none border-[2px] transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#D92B8A] text-white border-[#161616] shadow-[2px_2px_0px_#161616]'
                      : 'bg-transparent text-[#161616] border-transparent hover:border-[#161616] hover:bg-[#F0EAE0]'
                  }`}
                >
                  <span>{item.label}</span>
                  {Boolean(item.badge && item.badge > 0) && (
                    <span className={`px-1.5 py-0.2 text-[10px] font-mono font-bold border border-[#161616] ${
                      isActive ? 'bg-[#161616] text-[#FAF7F0]' : 'bg-[#D92B8A] text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Create Set & Streak & Account */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFFFF] border-[2px] border-[#161616] rounded-none shadow-[2px_2px_0px_#161616]">
              <Flame className="w-4 h-4 text-[#D92B8A] fill-[#D92B8A]" />
              <span className="font-mono text-xs font-bold text-[#161616]">
                {stats.streakDays} <span className="text-[10px] text-[#6B6862]">DAYS</span>
              </span>
            </div>

            {/* Quick Create Study Set */}
            <button
              id="header-create-set-btn"
              onClick={onCreateSetClick}
              className="px-3.5 py-1.5 bg-[#161616] text-white hover:bg-[#D92B8A] font-display text-xs font-bold tracking-wider uppercase rounded-none border-[2px] border-[#161616] shadow-[2px_2px_0px_#161616] transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>NEW SET</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onCreateSetClick}
              className="p-2 bg-[#D92B8A] text-white border-2 border-[#161616] rounded-none"
              title="Create Study Set"
            >
              <Plus className="w-4 h-4" />
            </button>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-[#FFFFFF] border-2 border-[#161616] rounded-none shadow-[2px_2px_0px_#161616]"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#161616]" />
              ) : (
                <Menu className="w-5 h-5 text-[#161616]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t-2 border-[#161616] space-y-1.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full px-4 py-2.5 rounded-none font-display text-xs font-bold uppercase tracking-wider flex items-center justify-between border-2 ${
                    isActive
                      ? 'bg-[#D92B8A] text-white border-[#161616]'
                      : 'bg-[#FFFFFF] text-[#161616] border-[#161616]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {Boolean(item.badge && item.badge > 0) && (
                    <span className="px-2 py-0.5 bg-[#161616] text-white text-[10px] font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>
    </>
  );
};
