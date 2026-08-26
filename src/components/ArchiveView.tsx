import React, { useState, useMemo } from 'react';
import { UserStudyNote, UserProfile, StudySet, AppView } from '../types';
import { StorageService } from '../services/storageService';
import { 
  FileText, 
  Search, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  BookOpen, 
  FolderPlus, 
  Clock, 
  User, 
  LogOut, 
  LogIn, 
  Sparkles,
  ExternalLink,
  Tag,
  AlertCircle,
  FolderOpen,
  ArrowRight,
  ArrowLeft,
  Shield
} from 'lucide-react';

interface ArchiveViewProps {
  currentUser: UserProfile;
  studySets: StudySet[];
  onSelectSet: (set: StudySet, mode?: AppView) => void;
  onExploreSets: () => void;
  onUserChanged: (newUser: UserProfile) => void;
  onBack?: () => void;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({
  currentUser,
  studySets,
  onSelectSet,
  onExploreSets,
  onUserChanged,
  onBack,
}) => {
  const [notes, setNotes] = useState<UserStudyNote[]>(() => StorageService.getUserNotes(currentUser.id));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  
  // Note editing state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editError, setEditError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // User switcher state
  const [isSwitchingUser, setIsSwitchingUser] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const allUsers = StorageService.getAllUsers();

  const refreshNotes = (userId?: string) => {
    const updated = StorageService.getUserNotes(userId || currentUser.id);
    setNotes(updated);
  };

  // Categories list derived from saved notes
  const categories = useMemo(() => {
    const set = new Set<string>();
    notes.forEach(n => {
      if (n.category) set.add(n.category);
    });
    return ['ALL', ...Array.from(set)];
  }, [notes]);

  // Filtered notes
  const filteredNotes = useMemo(() => {
    return notes.filter(n => {
      // Category filter
      if (selectedCategory !== 'ALL' && n.category !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesContent = n.content.toLowerCase().includes(q);
        const matchesTitle = n.targetTitle.toLowerCase().includes(q);
        const matchesCat = (n.category || '').toLowerCase().includes(q);
        return matchesContent || matchesTitle || matchesCat;
      }
      return true;
    });
  }, [notes, selectedCategory, searchQuery]);

  const handleStartEdit = (note: UserStudyNote) => {
    setEditingNoteId(note.id);
    setEditText(note.content);
    setEditError(null);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditText('');
    setEditError(null);
  };

  const handleSaveEdit = (noteId: string) => {
    if (!editText.trim()) {
      setEditError('Note content cannot be blank.');
      return;
    }

    const res = StorageService.updateNote(noteId, editText.trim());
    if (res.success) {
      refreshNotes();
      setEditingNoteId(null);
      setEditText('');
      setEditError(null);
      showFeedback('Note updated successfully!');
    } else {
      setEditError(res.error || 'Failed to save note changes.');
    }
  };

  const handleDelete = (noteId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete your note for "${title}"?`)) {
      const res = StorageService.deleteNote(noteId);
      if (res.success) {
        refreshNotes();
        showFeedback('Note deleted from your archive.');
      }
    }
  };

  const showFeedback = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleNavigateToStudyItem = (note: UserStudyNote) => {
    // Find study set
    const matchedSet = studySets.find(s => 
      s.id === note.targetId || s.concepts.some(c => c.id === note.targetId)
    );

    if (matchedSet) {
      onSelectSet(matchedSet, 'study');
    } else {
      onExploreSets();
    }
  };

  const handleSwitchUserAccount = (user: UserProfile) => {
    StorageService.switchUser(user.id);
    onUserChanged(user);
    refreshNotes(user.id);
    setIsSwitchingUser(false);
    showFeedback(`Logged in as ${user.name}`);
  };

  const handleCreateAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    const user = StorageService.loginUser(newEmail, newName);
    onUserChanged(user);
    refreshNotes(user.id);
    setNewEmail('');
    setNewName('');
    setIsSwitchingUser(false);
    showFeedback(`Logged in as ${user.name} (${user.email})`);
  };

  const handleLogout = () => {
    const guest = StorageService.logoutUser();
    onUserChanged(guest);
    refreshNotes(guest.id);
    showFeedback('Logged out. Switched to Guest Scholar account.');
  };

  return (
    <div id="archive-view-root" className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Back Button */}
      {onBack && (
        <button
          id="archive-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 font-mono text-xs font-bold text-stone-600 hover:text-[#D92B8A] uppercase tracking-wider transition-colors px-3.5 py-1.5 bg-white border border-stone-200 rounded-full shadow-xs hover:border-pink-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      )}

      {/* Top Header & User Card */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-50 text-[#D92B8A] rounded-full border border-pink-200 font-mono text-xs font-bold uppercase">
            <Shield className="w-3.5 h-3.5" />
            <span>Personal Knowledge Vault</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-stone-900 tracking-tight">
            My Study Notes Archive
          </h1>
          <p className="text-sm sm:text-base text-stone-600 font-normal leading-relaxed">
            All your personal study takeaways, concept hooks, and synthesis notes preserved securely.
          </p>
        </div>

        {/* User Account Capsule */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-start md:self-auto">
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center gap-3 shadow-xs">
            <div className="w-9 h-9 rounded-full bg-[#D92B8A] text-white flex items-center justify-center font-display font-black text-xs shadow-xs">
              {currentUser.avatarInitials || 'US'}
            </div>
            <div>
              <div className="font-display font-bold text-xs text-stone-900">
                {currentUser.name}
              </div>
              <div className="font-mono text-xs text-stone-500 truncate max-w-[180px]">
                {currentUser.email}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              id="switch-user-btn"
              onClick={() => setIsSwitchingUser(!isSwitchingUser)}
              className="px-4 py-2.5 bg-white hover:bg-stone-50 border border-stone-200 font-display text-xs font-bold uppercase rounded-full shadow-xs transition-all text-stone-800"
            >
              {isSwitchingUser ? 'Close' : 'Switch User'}
            </button>
            <button
              id="user-logout-btn"
              onClick={handleLogout}
              title="Log out"
              className="p-2.5 bg-white border border-stone-200 text-stone-500 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200 rounded-full shadow-xs transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Success Feedback Alert */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 font-mono text-xs font-bold uppercase rounded-2xl flex items-center gap-2.5 shadow-xs animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* User Login & Switcher Panel */}
      {isSwitchingUser && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="font-display font-black text-xl text-stone-900">
              Switch or Log In as a Different Scholar
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 font-normal mt-1">
              Notes are strictly isolated per account. Logging into another account retrieves that user&apos;s private notes archive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Existing Accounts */}
            <div className="space-y-3">
              <span className="font-mono text-xs font-bold uppercase text-stone-700 block">
                Available Scholar Accounts:
              </span>
              <div className="space-y-2.5">
                {allUsers.map(user => {
                  const isCurrent = user.id === currentUser.id;
                  const userNotesCount = StorageService.getUserNotes(user.id).length;
                  return (
                    <div
                      key={user.id}
                      onClick={() => !isCurrent && handleSwitchUserAccount(user)}
                      className={`p-3.5 border rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-pink-50/60 border-pink-300 ring-1 ring-[#D92B8A]/30'
                          : 'bg-stone-50/60 border-stone-200 hover:bg-white hover:border-pink-200 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center font-mono font-bold text-xs">
                          {user.avatarInitials || 'US'}
                        </div>
                        <div>
                          <div className="font-display font-bold text-xs text-stone-900 flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 bg-[#D92B8A] text-white font-mono text-xs font-bold rounded-full">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-xs text-stone-500">
                            {user.email} &bull; {userNotesCount} {userNotesCount === 1 ? 'saved note' : 'saved notes'}
                          </div>
                        </div>
                      </div>

                      {!isCurrent && (
                        <button className="px-3.5 py-1.5 bg-stone-900 hover:bg-[#D92B8A] text-white font-display text-xs font-bold uppercase rounded-full transition-colors">
                          Switch
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Log in with Custom Email */}
            <form onSubmit={handleCreateAndLogin} className="space-y-3.5 bg-stone-50/80 p-5 rounded-2xl border border-stone-200">
              <span className="font-mono text-xs font-bold uppercase text-stone-700 block">
                Log In with Another Email:
              </span>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Full Name (e.g. Kwame Mensah)"
                className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-full text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D92B8A]/30 focus:border-[#D92B8A]"
              />
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Email Address (e.g. user@example.com)"
                className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-full text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D92B8A]/30 focus:border-[#D92B8A]"
              />
              <button
                type="submit"
                className="w-full py-3 bg-[#D92B8A] hover:bg-[#c02479] text-white font-display text-xs font-bold uppercase tracking-wider rounded-full shadow-sm transition-all active:scale-95"
              >
                Log In & Retrieve Notes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row gap-3.5 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            id="archive-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within your saved notes & topics..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-stone-200 rounded-full text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D92B8A]/30 focus:border-[#D92B8A] shadow-xs"
          />
        </div>

        {/* Category Pills - Responsive Wrapping */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 font-mono text-xs font-bold uppercase rounded-full border whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid or Empty State */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white border border-stone-200 p-8 sm:p-14 text-center rounded-3xl shadow-sm space-y-4">
          <div className="w-14 h-14 bg-pink-50 border border-pink-200 rounded-full flex items-center justify-center mx-auto text-[#D92B8A]">
            <FileText className="w-7 h-7" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="font-display font-black text-xl sm:text-2xl text-stone-900">
              {searchQuery ? 'No Matching Study Notes Found' : 'Your Study Notes Archive is Empty'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed">
              {searchQuery
                ? `No notes match "${searchQuery}". Try a different keyword or reset category filters.`
                : `While learning concepts or exploring study sets, type your takeaways in the "Personal Study Notes" section or save generated study guides to archive them here.`}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onExploreSets}
              className="px-6 py-3 bg-[#D92B8A] hover:bg-[#c02479] text-white font-display text-xs sm:text-sm font-bold uppercase rounded-full shadow-sm transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Curriculum & Take Notes</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredNotes.map(note => {
            const isEditing = editingNoteId === note.id;

            return (
              <div
                key={note.id}
                className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-sm hover:border-pink-200 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                {/* Note Top Bar */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 bg-stone-100 border border-stone-200 text-xs font-mono font-bold uppercase text-stone-700 rounded-full">
                        {note.category || 'General'}
                      </span>
                      <span className="px-2.5 py-0.5 bg-pink-50 border border-pink-200 text-[#D92B8A] text-xs font-mono font-bold uppercase rounded-full">
                        {note.targetType === 'concept' ? 'Lesson Note' : 'Set Note'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-mono text-stone-500">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{new Date(note.updatedAt || note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg text-stone-900 leading-snug">
                    {note.targetTitle}
                  </h3>

                  {/* Note Body (Editable or View Mode) */}
                  {isEditing ? (
                    <div className="space-y-2.5 pt-1">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={5}
                        className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D92B8A]/30 focus:border-[#D92B8A] resize-none leading-relaxed"
                      />
                      {editError && (
                        <p className="text-xs font-mono text-rose-700 font-bold">
                          {editError}
                        </p>
                      )}
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-1.5 bg-white hover:bg-stone-50 border border-stone-200 font-display text-xs font-bold uppercase rounded-full transition-colors text-stone-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(note.id)}
                          className="px-5 py-1.5 bg-[#D92B8A] hover:bg-[#c02479] text-white font-display text-xs font-bold uppercase rounded-full shadow-xs flex items-center gap-1.5 transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-stone-50/70 border border-stone-200/80 rounded-2xl text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-wrap font-normal max-h-56 overflow-y-auto">
                      {note.content}
                    </div>
                  )}
                </div>

                {/* Card Actions Bottom Bar */}
                {!isEditing && (
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    <button
                      onClick={() => handleNavigateToStudyItem(note)}
                      className="font-mono text-xs font-bold uppercase text-[#D92B8A] hover:underline flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Study Lesson</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStartEdit(note)}
                        title="Edit Note"
                        className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id, note.targetTitle)}
                        title="Delete Note"
                        className="p-2 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
