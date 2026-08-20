import React, { useState, useRef } from 'react';
import { StudySet, StudyConcept, AppView } from '../types';
import { AIService } from '../services/aiService';
import { 
  X, 
  Sparkles, 
  FileText, 
  Upload, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  HelpCircle, 
  ArrowRight, 
  Loader2,
  AlertCircle
} from 'lucide-react';

interface CreateSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetCreated: (newSet: StudySet, autoLaunchMode?: AppView) => void;
}

type InputMethod = 'topic' | 'paste' | 'upload';

export const CreateSetModal: React.FC<CreateSetModalProps> = ({
  isOpen,
  onClose,
  onSetCreated,
}) => {
  const [method, setMethod] = useState<InputMethod>('topic');
  const [topicInput, setTopicInput] = useState<string>('');
  const [notesInput, setNotesInput] = useState<string>('');
  const [categoryInput, setCategoryInput] = useState<string>('GENERAL KNOWLEDGE');
  const [conceptCount, setConceptCount] = useState<number>(6);
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedSet, setGeneratedSet] = useState<StudySet | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const topicPresets = [
    { title: 'The South African Constitution & Bill of Rights', cat: 'AFRICAN HISTORY' },
    { title: 'Great Zimbabwe & Ancient Shona Architecture', cat: 'AFRICAN HISTORY' },
    { title: 'Swahili Essential Grammar & Noun Classes', cat: 'AFRICAN LANGUAGES' },
    { title: 'FinTech, M-PESA & Digital Banking in Africa', cat: 'BUSINESS' },
    { title: 'Cellular Respiration & Photosynthesis', cat: 'SCIENCE' },
    { title: 'Wisdom Literature & Parables of Solomon', cat: 'BIBLE & WISDOM' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setNotesInput(content);
      if (!topicInput) {
        setTopicInput(file.name.replace(/\.[^/.]+$/, ''));
      }
      setMethod('paste');
    };
    reader.readAsText(file);
  };

  const handleGenerate = async () => {
    setGenerationError(null);
    setIsGenerating(true);
    setGeneratedSet(null);

    try {
      const result = await AIService.generateStudySet({
        topic: topicInput,
        notesText: method === 'topic' ? undefined : notesInput,
        category: categoryInput,
        count: conceptCount,
      });

      setGeneratedSet(result);
    } catch (err: any) {
      setGenerationError(err.message || 'Failed to generate study set. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAndLaunch = (mode?: AppView) => {
    if (!generatedSet) return;
    onSetCreated(generatedSet, mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#161616]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div 
        id="create-set-modal"
        className="tactile-card bg-[#FFFFFF] rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn my-auto"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b-[2.5px] border-[#161616] flex items-center justify-between bg-[#FAF7F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#D92B8A] text-white flex items-center justify-center border-2 border-[#161616] shadow-[2px_2px_0px_#161616]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#D92B8A] block">
                STUDY MATERIAL ENGINE
              </span>
              <h2 className="font-display font-black text-xl sm:text-2xl uppercase text-[#161616] leading-none">
                CREATE A STUDY SET
              </h2>
            </div>
          </div>

          <button
            id="close-create-set-modal-btn"
            onClick={onClose}
            className="p-2 rounded-md hover:bg-[#FAF7F0] border-2 border-[#161616] shadow-[2px_2px_0px_#161616] active:translate-x-[1px] active:translate-y-[1px]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-[#161616]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {!generatedSet ? (
            <>
              {/* Input Method Selector */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-[#FAF7F0] border-2 border-[#161616] rounded-xl">
                <button
                  id="tab-enter-topic"
                  onClick={() => setMethod('topic')}
                  className={`py-2.5 px-3 rounded-lg font-display text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 ${
                    method === 'topic'
                      ? 'bg-[#161616] text-white shadow-[2px_2px_0px_#D92B8A]'
                      : 'text-[#161616] hover:bg-[#FFFFFF]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>ENTER TOPIC</span>
                </button>

                <button
                  id="tab-paste-text"
                  onClick={() => setMethod('paste')}
                  className={`py-2.5 px-3 rounded-lg font-display text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 ${
                    method === 'paste'
                      ? 'bg-[#161616] text-white shadow-[2px_2px_0px_#D92B8A]'
                      : 'text-[#161616] hover:bg-[#FFFFFF]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>PASTE NOTES</span>
                </button>

                <button
                  id="tab-upload-material"
                  onClick={() => setMethod('upload')}
                  className={`py-2.5 px-3 rounded-lg font-display text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 ${
                    method === 'upload'
                      ? 'bg-[#161616] text-white shadow-[2px_2px_0px_#D92B8A]'
                      : 'text-[#161616] hover:bg-[#FFFFFF]'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>UPLOAD FILE</span>
                </button>
              </div>

              {/* Method 1: Enter Topic */}
              {method === 'topic' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-display font-black text-xs uppercase text-[#161616] block">
                      WHAT SUBJECT OR TOPIC DO YOU WANT TO MASTER?
                    </label>
                    <input
                      id="topic-input-field"
                      type="text"
                      value={topicInput}
                      onChange={e => setTopicInput(e.target.value)}
                      placeholder="e.g., The South African Constitution, Cellular Biology, Swahili Verbs..."
                      className="w-full bg-[#FAF7F0] border-[2.5px] border-[#161616] rounded-xl p-3.5 text-sm font-semibold text-[#161616] placeholder:text-[#6B6862] shadow-[2.5px_2.5px_0px_#161616] focus:outline-none focus:ring-2 focus:ring-[#D92B8A]"
                    />
                  </div>

                  {/* Topic Presets */}
                  <div className="space-y-2">
                    <span className="font-mono text-[10px] font-bold uppercase text-[#6B6862]">
                      OR TRY A SUGGESTED TOPIC:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {topicPresets.map(preset => (
                        <button
                          key={preset.title}
                          onClick={() => {
                            setTopicInput(preset.title);
                            setCategoryInput(preset.cat);
                          }}
                          className="text-left p-2.5 bg-[#FAF7F0] hover:bg-[#F0EAE0] border-[1.5px] border-[#161616] rounded-lg text-xs font-semibold text-[#161616] transition-all truncate"
                        >
                          &ldquo;{preset.title}&rdquo;
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Method 2: Paste Notes */}
              {method === 'paste' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-display font-black text-xs uppercase text-[#161616] block">
                      PASTE YOUR STUDY NOTES, SYLLABUS, OR TEXT
                    </label>
                    <textarea
                      id="notes-textarea-input"
                      rows={6}
                      value={notesInput}
                      onChange={e => setNotesInput(e.target.value)}
                      placeholder="Paste your lecture notes, textbook passages, definitions, or study bullet points here..."
                      className="w-full bg-[#FAF7F0] border-[2.5px] border-[#161616] rounded-xl p-3.5 text-xs sm:text-sm font-medium text-[#161616] placeholder:text-[#6B6862] shadow-[2.5px_2.5px_0px_#161616] focus:outline-none focus:ring-2 focus:ring-[#D92B8A]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-display font-black text-xs uppercase text-[#161616]">
                      OPTIONAL SET TITLE
                    </label>
                    <input
                      type="text"
                      value={topicInput}
                      onChange={e => setTopicInput(e.target.value)}
                      placeholder="Give this study set a title..."
                      className="w-full bg-[#FAF7F0] border-[2px] border-[#161616] rounded-lg p-2.5 text-xs font-semibold text-[#161616]"
                    />
                  </div>
                </div>
              )}

              {/* Method 3: Upload Material */}
              {method === 'upload' && (
                <div className="space-y-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".txt,.md,.json,.csv,.doc"
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#161616] bg-[#FAF7F0] hover:bg-[#F0EAE0] rounded-xl p-8 text-center cursor-pointer space-y-3 transition-colors"
                  >
                    <div className="w-12 h-12 mx-auto rounded-full bg-[#FFFFFF] border-2 border-[#161616] flex items-center justify-center text-[#D92B8A]">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-display font-black text-base uppercase text-[#161616]">
                        CLICK TO UPLOAD STUDY NOTES
                      </div>
                      <div className="text-xs text-[#6B6862] mt-1">
                        Supports text files (.txt, .md, .csv)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Concept Count Selector */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="font-display font-black text-xs uppercase text-[#161616]">
                    CATEGORY
                  </label>
                  <select
                    value={categoryInput}
                    onChange={e => setCategoryInput(e.target.value)}
                    className="w-full bg-[#FAF7F0] border-[2px] border-[#161616] rounded-lg p-2.5 text-xs font-semibold text-[#161616]"
                  >
                    <option value="AFRICAN HISTORY">African History</option>
                    <option value="AFRICAN GEOGRAPHY">African Geography</option>
                    <option value="AFRICAN CULTURE">African Culture</option>
                    <option value="AFRICAN LANGUAGES">African Languages</option>
                    <option value="AFRICAN PROVERBS">African Proverbs</option>
                    <option value="AFRICAN LEADERS & ICONS">African Leaders & Icons</option>
                    <option value="BIBLE & WISDOM">Bible & Wisdom</option>
                    <option value="SCIENCE">Science & Technology</option>
                    <option value="BUSINESS">Business & Economics</option>
                    <option value="GENERAL KNOWLEDGE">General Knowledge</option>
                    <option value="EXAM PREPARATION">Exam Preparation</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-display font-black text-xs uppercase text-[#161616]">
                    TARGET CONCEPTS
                  </label>
                  <select
                    value={conceptCount}
                    onChange={e => setConceptCount(Number(e.target.value))}
                    className="w-full bg-[#FAF7F0] border-[2px] border-[#161616] rounded-lg p-2.5 text-xs font-semibold text-[#161616]"
                  >
                    <option value={4}>4 Concepts (Fast ~5m)</option>
                    <option value={6}>6 Concepts (Standard ~10m)</option>
                    <option value={8}>8 Concepts (Comprehensive ~15m)</option>
                    <option value={12}>12 Concepts (Deep ~25m)</option>
                  </select>
                </div>
              </div>

              {generationError && (
                <div className="p-3 bg-red-50 border-2 border-red-700 rounded-lg flex items-center gap-2 text-xs font-semibold text-red-900">
                  <AlertCircle className="w-4 h-4 text-red-700 flex-shrink-0" />
                  <span>{generationError}</span>
                </div>
              )}
            </>
          ) : (
            /* Generated Results Preview Screen */
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 bg-[#FDEAF4] border-[2px] border-[#161616] rounded-xl flex items-center justify-between">
                <div>
                  <div className="inline-block px-2 py-0.5 bg-[#D92B8A] text-white font-mono text-[10px] font-bold uppercase rounded border border-[#161616] mb-1">
                    ANALYSIS COMPLETE
                  </div>
                  <h3 className="font-display font-black text-xl uppercase text-[#161616]">
                    {generatedSet.concepts.length} CONCEPTS IDENTIFIED
                  </h3>
                  <p className="text-xs text-[#6B6862] font-medium">
                    Ready for Learn & Understand, Flashcards, Practise, and Spaced Review.
                  </p>
                </div>
              </div>

              {/* Concepts Preview List */}
              <div className="space-y-3">
                <span className="font-display font-black text-xs uppercase tracking-wider text-[#6B6862]">
                  EXTRACTED STUDY CONCEPTS:
                </span>
                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {generatedSet.concepts.map((c, i) => (
                    <div
                      key={c.id}
                      className="p-3 bg-[#FAF7F0] border-[1.5px] border-[#161616] rounded-lg space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display font-black text-xs uppercase text-[#161616]">
                          {i + 1}. {c.title}
                        </span>
                        <span className="text-[10px] font-mono text-[#D92B8A] font-bold">
                          {c.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B6862] line-clamp-2">
                        {c.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t-[2.5px] border-[#161616] bg-[#FAF7F0] flex flex-col sm:flex-row items-center justify-between gap-3">
          {!generatedSet ? (
            <>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 text-[#161616] font-display text-xs font-bold uppercase"
              >
                CANCEL
              </button>

              <button
                id="generate-study-set-submit-btn"
                disabled={isGenerating || (method === 'topic' && !topicInput.trim()) || (method === 'paste' && !notesInput.trim())}
                onClick={handleGenerate}
                className="w-full sm:w-auto px-6 py-3 bg-[#D92B8A] disabled:opacity-50 text-white font-display text-xs sm:text-sm font-black uppercase tracking-wider rounded-md tactile-btn flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>ANALYSING MATERIAL...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>GENERATE STUDY SET</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => setGeneratedSet(null)}
                className="w-full sm:w-auto px-4 py-2 text-[#161616] font-display text-xs font-bold uppercase"
              >
                EDIT INPUT
              </button>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleSaveAndLaunch('flashcards')}
                  className="px-4 py-2.5 bg-[#FFFFFF] text-[#161616] font-display text-xs font-black uppercase rounded-md tactile-btn flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>FLASHCARDS</span>
                </button>

                <button
                  onClick={() => handleSaveAndLaunch('study')}
                  className="px-5 py-2.5 bg-[#D92B8A] text-white font-display text-xs font-black uppercase rounded-md tactile-btn flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>STUDY NOW</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
