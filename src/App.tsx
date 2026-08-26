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
import { CreateSetModal, GeneratorMode, InputMethod } from './components/CreateSetModal';
import { StudySetDetailView } from './components/StudySetDetailView';
import { SessionSummaryModal } from './components/SessionSummaryModal';
import { StudyTutorModal } from './components/StudyTutorModal';
import { HomeworkView } from './components/HomeworkView';
import { CreateView } from './components/CreateView';
import { StudyHubView } from './components/StudyHubView';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [viewHistory, setViewHistory] = useState<AppView[]>(['home']);
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => StorageService.getCurrentUser());
  const [studySets, setStudySets] = useState<StudySet[]>([]);
  const [activeSet, setActiveSet] = useState<StudySet | null>(null);
  const [stats, setStats] = useState<UserStats>(StorageService.getUserStats());
  const [reviewItems, setReviewItems] = useState(StorageService.getConceptsNeedingReview());
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [createModalMethod, setCreateModalMethod] = useState<InputMethod>('topic');
  const [createModalTopic, setCreateModalTopic] = useState<string>('');
  const [createModalMode, setCreateModalMode] = useState<GeneratorMode>('lesson-plan');

  const [isGlobalTutorOpen, setIsGlobalTutorOpen] = useState<boolean>(false);
  const [globalTutorInitialMode, setGlobalTutorInitialMode] = useState<'tutor' | 'homework'>('homework');
  const [explorerCategory, setExplorerCategory] = useState<string>('ALL SUBJECTS');
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
    const nextView = targetMode || 'set-detail';
    setViewHistory(prev => (prev[prev.length - 1] === nextView ? prev : [...prev, nextView]));
    setCurrentView(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: AppView, categoryFilter?: string) => {
    if (categoryFilter) {
      setExplorerCategory(categoryFilter);
    }
    // If navigating directly to a mode that needs an active set, ensure activeSet is set
    if (['study', 'flashcards', 'practice'].includes(view) && !activeSet && studySets.length > 0) {
      setActiveSet(studySets[0]);
    }
    setViewHistory(prev => (prev[prev.length - 1] === view ? prev : [...prev, view]));
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    setViewHistory(prev => {
      if (prev.length > 1) {
        const nextHistory = prev.slice(0, -1);
        const previousView = nextHistory[nextHistory.length - 1];
        setCurrentView(previousView);
        return nextHistory;
      } else {
        setCurrentView('home');
        return ['home'];
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCreateModal = (
    method: InputMethod = 'topic',
    topic: string = '',
    mode: GeneratorMode = 'lesson-plan'
  ) => {
    setCreateModalMethod(method);
    setCreateModalTopic(topic);
    setCreateModalMode(mode);
    setIsCreateModalOpen(true);
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

  const handleOpenGlobalTutor = (mode: 'tutor' | 'homework' = 'homework') => {
    setGlobalTutorInitialMode(mode);
    setIsGlobalTutorOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#161616] flex flex-col selection:bg-[#D92B8A] selection:text-white">
      {/* Primary Brand Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        stats={stats}
        reviewCount={reviewItems.length}
        onCreateSetClick={(method, topic) => handleOpenCreateModal(method || 'topic', topic || '')}
        onOpenTutor={handleOpenGlobalTutor}
        currentUser={currentUser}
        onLogout={() => {
          const guest = StorageService.logoutUser();
          handleUserChanged(guest);
        }}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {currentView === 'home' && (
          <HomeScreen
            onNavigate={handleNavigate}
            onSelectSet={handleSelectSet}
            featuredSets={featuredSets}
            reviewItemsCount={reviewItems.length}
            stats={stats}
            onCreateSetClick={(method, topic, mode) => handleOpenCreateModal(method || 'topic', topic || '', mode || 'lesson-plan')}
            onOpenTutor={handleOpenGlobalTutor}
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

        {currentView === 'create' && (
          <CreateView
            onNavigate={handleNavigate}
            onCreateSetClick={(method, topic, mode) => handleOpenCreateModal(method || 'topic', topic || '', mode || 'lesson-plan')}
            onSelectSet={handleSelectSet}
            featuredSets={featuredSets}
            onBack={handleGoBack}
          />
        )}

        {(currentView === 'study-hub' || (currentView === 'study' && !activeSet)) && (
          <StudyHubView
            studySets={studySets}
            activeSet={activeSet}
            onSelectSet={handleSelectSet}
            onNavigate={handleNavigate}
            reviewItemsCount={reviewItems.length}
            stats={stats}
            onCreateSetClick={() => handleOpenCreateModal('topic', '')}
            onBack={handleGoBack}
          />
        )}

        {currentView === 'homework' && (
          <HomeworkView
            studySets={studySets}
            activeSet={activeSet}
            onSelectSet={handleSelectSet}
            onNavigate={handleNavigate}
            onBack={handleGoBack}
          />
        )}

        {currentView === 'archive' && (
          <ArchiveView
            currentUser={currentUser}
            studySets={studySets}
            onSelectSet={handleSelectSet}
            onExploreSets={() => handleNavigate('sets')}
            onUserChanged={handleUserChanged}
            onBack={handleGoBack}
          />
        )}

        {currentView === 'sets' && (
          <SubjectExplorer
            studySets={studySets}
            initialCategory={explorerCategory}
            onSelectSet={handleSelectSet}
            onCreateSetClick={() => handleOpenCreateModal('topic', '')}
            onDeleteCustomSet={handleDeleteCustomSet}
            onOpenTutor={handleOpenGlobalTutor}
            onBack={handleGoBack}
          />
        )}

        {currentView === 'set-detail' && activeSet && (
          <StudySetDetailView
            studySet={activeSet}
            onBack={handleGoBack}
            onLaunchMode={(mode) => handleNavigate(mode)}
            onLaunchConceptLesson={(conceptIndex) => {
              handleNavigate('study');
            }}
          />
        )}

        {currentView === 'study' && activeSet && (
          <StudySessionView
            studySet={activeSet}
            onBack={() => handleNavigate('home')}
            onFinishLesson={(setId, count) => {
              handleCompleteGuidedStudy({
                total: activeSet.concepts.length,
                confident: count,
                struggled: activeSet.concepts.length - count,
                minutes: activeSet.estimatedMinutes || 10,
              });
            }}
            onNavigateToFlashcards={(set) => {
              handleSelectSet(set, 'flashcards');
            }}
            onNavigateToPractice={(set) => {
              handleSelectSet(set, 'practice');
            }}
          />
        )}

        {currentView === 'flashcards' && activeSet && (
          <FlashcardsView
            studySet={activeSet}
            onBack={handleGoBack}
            onRecordRating={handleRecordFlashcardRating}
            onCompleteSession={handleCompleteFlashcards}
          />
        )}

        {currentView === 'practice' && activeSet && (
          <PracticeView
            studySet={activeSet}
            onBack={handleGoBack}
            onRecordAnswer={handleRecordPracticeAnswer}
            onCompletePractice={(result) => {
              handleCompletePractice({
                total: result.total,
                correct: result.reinforced,
                incorrect: result.needsReview,
              });
            }}
            onNavigateToFlashcards={(set) => {
              handleSelectSet(set, 'flashcards');
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
              handleNavigate('study');
            }}
            onExploreSets={() => handleNavigate('sets')}
            onBack={handleGoBack}
          />
        )}

        {currentView === 'review' && (
          <ReviewView
            reviewItems={reviewItems}
            onStartReviewSession={handleStartReviewSession}
            onExploreSets={() => handleNavigate('sets')}
            onBack={handleGoBack}
          />
        )}

        {currentView === 'progress' && (
          <ProgressView
            stats={stats}
            onExploreSets={() => handleNavigate('sets')}
            onNavigateToArchive={() => handleNavigate('archive')}
            onStartReview={() => {
              if (reviewItems.length > 0) {
                handleStartReviewSession(reviewItems.map(r => r.concept));
              } else {
                handleNavigate('review');
              }
            }}
            onBack={handleGoBack}
          />
        )}
      </main>

      {/* Create Set Modal with full Generator Mode & Input Method support */}
      <CreateSetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSetCreated={handleSetCreated}
        initialMethod={createModalMethod}
        initialTopic={createModalTopic}
        initialGeneratorMode={createModalMode}
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

      {/* Global AI Study Tutor & Homework Help Modal */}
      <StudyTutorModal
        isOpen={isGlobalTutorOpen}
        onClose={() => setIsGlobalTutorOpen(false)}
        studySet={activeSet}
        availableSets={studySets}
        initialMode={globalTutorInitialMode}
      />

      {/* Modern Refined Footer */}
      <footer className="border-t border-stone-200/90 bg-[#FAF8F5] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Active Progress Bar Preview */}
          <div className="w-full md:max-w-md bg-white border border-stone-200/90 rounded-2xl px-4 py-3 shadow-sm">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-[#161616]">
                <span>CURRICULUM MASTERY &bull; AFRICAN HISTORY</span>
                <span className="text-[#D92B8A]">
                  {stats.subjectMastery['AFRICAN HISTORY'] ? `${stats.subjectMastery['AFRICAN HISTORY'].percentage}%` : '82%'}
                </span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden p-[1px]">
                <div 
                  className="h-full bg-gradient-to-r from-[#D92B8A] to-[#f43f5e] rounded-full transition-all duration-500" 
                  style={{ width: `${stats.subjectMastery['AFRICAN HISTORY'] ? Math.max(stats.subjectMastery['AFRICAN HISTORY'].percentage, 10) : 82}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Navigation Controls */}
          <nav className="flex items-center gap-1.5 bg-white border border-stone-200/90 p-1.5 rounded-full shadow-sm">
            <button 
              onClick={() => handleNavigate('sets')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-display font-black uppercase tracking-wider transition-all ${
                currentView === 'sets' 
                  ? 'bg-[#18181B] text-white shadow-sm' 
                  : 'text-stone-700 hover:text-[#161616] hover:bg-stone-50'
              }`}
            >
              EXPLORE
            </button>
            <button 
              onClick={() => handleNavigate('archive')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-display font-black uppercase tracking-wider transition-all ${
                currentView === 'archive' 
                  ? 'bg-[#18181B] text-white shadow-sm' 
                  : 'text-stone-700 hover:text-[#161616] hover:bg-stone-50'
              }`}
            >
              ARCHIVE
            </button>
            <button 
              onClick={() => handleNavigate('progress')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-display font-black uppercase tracking-wider transition-all ${
                currentView === 'progress' 
                  ? 'bg-[#18181B] text-white shadow-sm' 
                  : 'text-stone-700 hover:text-[#161616] hover:bg-stone-50'
              }`}
            >
              STATS
            </button>
            <button 
              onClick={() => handleNavigate('home')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-display font-black uppercase tracking-wider transition-all ${
                currentView === 'home' 
                  ? 'bg-[#18181B] text-white shadow-sm' 
                  : 'text-stone-700 hover:text-[#161616] hover:bg-stone-50'
              }`}
            >
              HOME
            </button>
          </nav>
        </div>
      </footer>
    </div>
  );
}
