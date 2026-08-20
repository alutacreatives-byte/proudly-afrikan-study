import React, { useState, useEffect, useMemo } from 'react';
import { 
  AppView, 
  StudySet, 
  StudyConcept, 
  UserStats, 
  FlashcardRating, 
  SessionResult,
  UserProfile
} from './types';
import { StorageService } from './services/storageService';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { SubjectExplorer } from './components/SubjectExplorer';
import { FlashcardsView } from './components/FlashcardsView';
import { PracticeView } from './components/PracticeView';
import { StudySessionView } from './components/StudySessionView';
import { StudyPlanView } from './components/StudyPlanView';
import { ReviewView } from './components/ReviewView';
import { ProgressView } from './components/ProgressView';
import { ArchiveView } from './components/ArchiveView';
import { CreateSetModal } from './components/CreateSetModal';
import { StudySetDetailView } from './components/StudySetDetailView';
import { SessionSummaryModal } from './components/SessionSummaryModal';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => StorageService.getCurrentUser());
  const [studySets, setStudySets] = useState<StudySet[]>([]);
  const [activeSet, setActiveSet] = useState<StudySet | null>(null);
  const [stats, setStats] = useState<UserStats>(StorageService.getUserStats());
  const [reviewItems, setReviewItems] = useState(StorageService.getConceptsNeedingReview());
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [sessionSummary, setSessionSummary] = useState<{
    isOpen: boolean;
    total: number;
    confident: number;
    struggled: number;
    setTitle?: string;
  }>({
    isOpen: false,
    total: 0,
    confident: 0,
    struggled: 0,
  });

  // Load sets & stats on mount
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const sets = StorageService.getAllSets();
    setStudySets(sets);
    if (!activeSet && sets.length > 0) {
      setActiveSet(sets[0]);
    }
    setStats(StorageService.getUserStats());
    setReviewItems(StorageService.getConceptsNeedingReview());
    setCurrentUser(StorageService.getCurrentUser());
  };

  const handleUserChanged = (newUser: UserProfile) => {
    setCurrentUser(newUser);
    refreshData();
  };

  const featuredSets = useMemo(() => {
    return studySets.filter(s => s.featured || s.isCustom);
  }, [studySets]);

  // Navigation & Set Selection
  const handleSelectSet = (set: StudySet, targetMode?: AppView) => {
    setActiveSet(set);
    if (targetMode) {
      setCurrentView(targetMode);
    } else {
      setCurrentView('set-detail');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: AppView) => {
    // If navigating directly to a mode that needs an active set, ensure activeSet is set
    if (['study', 'flashcards', 'practice'].includes(view) && !activeSet && studySets.length > 0) {
      setActiveSet(studySets[0]);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Recording interactions
  const handleRecordFlashcardRating = (conceptId: string, rating: FlashcardRating) => {
    StorageService.recordFlashcardRating(conceptId, rating);
    refreshData();
  };

  const handleRecordPracticeAnswer = (conceptId: string, isCorrect: boolean) => {
    StorageService.recordPracticeAnswer(conceptId, isCorrect);
    refreshData();
  };

  // Session completion
  const handleCompleteFlashcards = (result: { total: number; confident: number; struggled: number }) => {
    if (activeSet) {
      StorageService.recordSessionResult({
        setId: activeSet.id,
        setTitle: activeSet.title,
        durationMinutes: 5,
        totalConcepts: result.total,
        confidentCount: result.confident,
        struggledCount: result.struggled,
        struggledConceptIds: [],
        timestamp: new Date().toISOString(),
        mode: 'flashcards',
      });
    }
    refreshData();
    setSessionSummary({
      isOpen: true,
      total: result.total,
      confident: result.confident,
      struggled: result.struggled,
      setTitle: activeSet?.title,
    });
  };

  const handleCompletePractice = (result: { total: number; correct: number; incorrect: number }) => {
    if (activeSet) {
      StorageService.recordSessionResult({
        setId: activeSet.id,
        setTitle: activeSet.title,
        durationMinutes: 5,
        totalConcepts: result.total,
        confidentCount: result.correct,
        struggledCount: result.incorrect,
        struggledConceptIds: [],
        timestamp: new Date().toISOString(),
        mode: 'practice',
      });
    }
    refreshData();
    setSessionSummary({
      isOpen: true,
      total: result.total,
      confident: result.correct,
      struggled: result.incorrect,
      setTitle: activeSet?.title,
    });
  };

  const handleCompleteGuidedStudy = (result: { total: number; confident: number; struggled: number; minutes: number }) => {
    if (activeSet) {
      StorageService.recordSessionResult({
        setId: activeSet.id,
        setTitle: activeSet.title,
        durationMinutes: result.minutes,
        totalConcepts: result.total,
        confidentCount: result.confident,
        struggledCount: result.struggled,
        struggledConceptIds: [],
        timestamp: new Date().toISOString(),
        mode: 'study',
      });
    }
    refreshData();
    setSessionSummary({
      isOpen: true,
      total: result.total,
      confident: result.confident,
      struggled: result.struggled,
      setTitle: activeSet?.title,
    });
  };

  // Launch review session for specific concepts
  const handleStartReviewSession = (conceptsToReview: StudyConcept[], categoryName?: string) => {
    const reviewSet: StudySet = {
      id: `review-${Date.now()}`,
      title: categoryName ? `Review: ${categoryName}` : 'Adaptive Spaced Review',
      description: `Targeted review session containing ${conceptsToReview.length} concepts that need memory reinforcement.`,
      category: categoryName || 'SPACED REVIEW',
      estimatedMinutes: Math.ceil(conceptsToReview.length * 1.5),
      createdAt: new Date().toISOString(),
      concepts: conceptsToReview,
    };
    setActiveSet(reviewSet);
    setCurrentView('flashcards');
  };

  // Create custom set
  const handleSetCreated = (newSet: StudySet, autoLaunchMode?: AppView) => {
    StorageService.saveCustomSet(newSet);
    refreshData();
    setActiveSet(newSet);
    if (autoLaunchMode) {
      setCurrentView(autoLaunchMode);
    } else {
      setCurrentView('set-detail');
    }
  };

  const handleDeleteCustomSet = (setId: string) => {
    StorageService.deleteCustomSet(setId);
    refreshData();
    if (activeSet?.id === setId) {
      setActiveSet(studySets[0] || null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#161616] flex flex-col selection:bg-[#D92B8A] selection:text-white">
      {/* Primary Brand Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        stats={stats}
        reviewCount={reviewItems.length}
        onCreateSetClick={() => setIsCreateModalOpen(true)}
        currentUser={currentUser}
        onLogout={() => {
          const guest = StorageService.logoutUser();
          handleUserChanged(guest);
        }}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentView === 'home' && (
          <HomeScreen
            onNavigate={handleNavigate}
            onSelectSet={handleSelectSet}
            featuredSets={featuredSets}
            reviewItemsCount={reviewItems.length}
            stats={stats}
            onCreateSetClick={() => setIsCreateModalOpen(true)}
            onStartReview={() => {
              if (reviewItems.length > 0) {
                handleStartReviewSession(reviewItems.map(r => r.concept));
              } else {
                setCurrentView('review');
              }
            }}
            onStartStudyPlan={() => setCurrentView('planner')}
          />
        )}

        {currentView === 'archive' && (
          <ArchiveView
            currentUser={currentUser}
            studySets={studySets}
            onSelectSet={handleSelectSet}
            onExploreSets={() => setCurrentView('sets')}
            onUserChanged={handleUserChanged}
          />
        )}

        {currentView === 'sets' && (
          <SubjectExplorer
            studySets={studySets}
            onSelectSet={handleSelectSet}
            onCreateSetClick={() => setIsCreateModalOpen(true)}
            onDeleteCustomSet={handleDeleteCustomSet}
          />
        )}

        {currentView === 'set-detail' && activeSet && (
          <StudySetDetailView
            studySet={activeSet}
            onBack={() => setCurrentView('sets')}
            onLaunchMode={(mode) => setCurrentView(mode)}
            onLaunchConceptLesson={(conceptIndex) => {
              setCurrentView('study');
            }}
          />
        )}

        {currentView === 'study' && activeSet && (
          <StudySessionView
            studySet={activeSet}
            onBack={() => setCurrentView('set-detail')}
            onFinishLesson={(setId, count) => {
              handleCompleteGuidedStudy({
                total: activeSet.concepts.length,
                confident: count,
                struggled: activeSet.concepts.length - count,
                minutes: activeSet.estimatedMinutes || 10,
              });
            }}
            onNavigateToFlashcards={(set) => {
              setActiveSet(set);
              setCurrentView('flashcards');
            }}
            onNavigateToPractice={(set) => {
              setActiveSet(set);
              setCurrentView('practice');
            }}
          />
        )}

        {currentView === 'flashcards' && activeSet && (
          <FlashcardsView
            studySet={activeSet}
            onBack={() => setCurrentView('set-detail')}
            onRecordRating={handleRecordFlashcardRating}
            onCompleteSession={handleCompleteFlashcards}
          />
        )}

        {currentView === 'practice' && activeSet && (
          <PracticeView
            studySet={activeSet}
            onBack={() => setCurrentView('set-detail')}
            onRecordAnswer={handleRecordPracticeAnswer}
            onCompletePractice={(result) => {
              handleCompletePractice({
                total: result.total,
                correct: result.reinforced,
                incorrect: result.needsReview,
              });
            }}
            onNavigateToFlashcards={(set) => {
              setActiveSet(set);
              setCurrentView('flashcards');
            }}
          />
        )}

        {currentView === 'planner' && (
          <StudyPlanView
            onStartSession={(concepts, title, durationMinutes) => {
              const planSet: StudySet = {
                id: `plan-${Date.now()}`,
                title: title,
                description: `Time-boxed ${durationMinutes}-minute study session curated for your retention.`,
                category: 'TIME-BOXED STUDY',
                estimatedMinutes: durationMinutes,
                createdAt: new Date().toISOString(),
                concepts: concepts,
              };
              setActiveSet(planSet);
              setCurrentView('study');
            }}
            onExploreSets={() => setCurrentView('sets')}
          />
        )}

        {currentView === 'review' && (
          <ReviewView
            reviewItems={reviewItems}
            onStartReviewSession={handleStartReviewSession}
            onExploreSets={() => setCurrentView('sets')}
          />
        )}

        {currentView === 'progress' && (
          <ProgressView
            stats={stats}
            onExploreSets={() => setCurrentView('sets')}
            onNavigateToArchive={() => setCurrentView('archive')}
            onStartReview={() => {
              if (reviewItems.length > 0) {
                handleStartReviewSession(reviewItems.map(r => r.concept));
              } else {
                setCurrentView('review');
              }
            }}
          />
        )}
      </main>

      {/* Create Set Modal */}
      <CreateSetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSetCreated={handleSetCreated}
      />

      {/* Session Summary Modal */}
      <SessionSummaryModal
        isOpen={sessionSummary.isOpen}
        onClose={() => setSessionSummary(prev => ({ ...prev, isOpen: false }))}
        result={sessionSummary}
        onReviewNow={() => {
          setSessionSummary(prev => ({ ...prev, isOpen: false }));
          if (reviewItems.length > 0) {
            handleStartReviewSession(reviewItems.map(r => r.concept));
          } else {
            setCurrentView('review');
          }
        }}
        onBackToStudy={() => {
          setSessionSummary(prev => ({ ...prev, isOpen: false }));
          setCurrentView('study');
        }}
        onGoHome={() => {
          setSessionSummary(prev => ({ ...prev, isOpen: false }));
          setCurrentView('home');
        }}
      />

      {/* Geometric Balance Editorial Footer */}
      <footer className="border-t-2 border-[#1A1A1A] bg-[#FDFCF8] mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch">
          {/* Active Progress Bar Preview */}
          <div className="flex-1 flex items-center px-4 sm:px-8 py-4 md:py-0 border-b-2 md:border-b-0 md:border-r-2 border-[#1A1A1A]">
            <div className="w-full space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
                <span>CURRICULUM MASTERY &bull; AFRICAN HISTORY & KNOWLEDGE</span>
                <span className="text-[#D92B8A]">
                  {stats.subjectMastery['AFRICAN HISTORY'] ? `${stats.subjectMastery['AFRICAN HISTORY'].percentage}%` : '82%'}
                </span>
              </div>
              <div className="w-full h-3 border border-[#1A1A1A] bg-white p-[2px] rounded-sm">
                <div 
                  className="h-full bg-[#D92B8A] transition-all duration-500" 
                  style={{ width: `${stats.subjectMastery['AFRICAN HISTORY'] ? Math.max(stats.subjectMastery['AFRICAN HISTORY'].percentage, 10) : 82}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Navigation Controls */}
          <nav className="flex items-center text-xs font-display font-black uppercase tracking-wider divide-x-2 divide-[#1A1A1A]">
            <button 
              onClick={() => handleNavigate('sets')}
              className={`px-4 sm:px-6 py-4.5 hover:bg-white transition-colors ${currentView === 'sets' ? 'bg-[#1A1A1A] text-white' : 'text-[#1A1A1A]'}`}
            >
              EXPLORE
            </button>
            <button 
              onClick={() => handleNavigate('archive')}
              className={`px-4 sm:px-6 py-4.5 hover:bg-white transition-colors ${currentView === 'archive' ? 'bg-[#1A1A1A] text-white' : 'text-[#1A1A1A]'}`}
            >
              ARCHIVE
            </button>
            <button 
              onClick={() => handleNavigate('progress')}
              className={`px-4 sm:px-6 py-4.5 hover:bg-white transition-colors ${currentView === 'progress' ? 'bg-[#1A1A1A] text-white' : 'text-[#1A1A1A]'}`}
            >
              STATS
            </button>
            <button 
              onClick={() => handleNavigate('home')}
              className={`px-4 sm:px-6 py-4.5 transition-colors ${currentView === 'home' ? 'bg-[#1A1A1A] text-white' : 'hover:bg-white text-[#1A1A1A]'}`}
            >
              HOME
            </button>
          </nav>
        </div>
      </footer>
    </div>
  );
}
