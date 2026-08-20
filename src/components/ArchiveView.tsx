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
  AlertCircle
} from 'lucide-react';

interface ArchiveViewProps {
  currentUser: UserProfile;
  studySets: StudySet[];
  onSelectSet: (set: StudySet, mode?: AppView) => void;
  onExploreSets: () => void;
  onUserChanged: (newUser: UserProfile) => void;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({
  currentUser,
  studySets,
  onSelectSet,
  onExploreSets,
  onUserChanged,
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
    <div className="space-y-8 pb-16">
      {/* Top Editorial Header */}
      <div className="border-b-[2.5px] border-[#161616] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#FAF7F0] border border-[#161616] text-[#161616] font-mono text-xs font-bold uppercase mb-2">
            <span>PERSONAL KNOWLEDGE VAULT</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-[#161616]">
            MY STUDY NOTES ARCHIVE
          </h1>
          <p className="text-sm sm:text-base text-[#6B6862] font-medium mt-1">
            All your personal study takeaways, concept hooks, and synthesis notes preserved securely.
          </p>
        </div>

        {/* User Account Pill & Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="p-2.5 bg-white border-2 border-[#161616] shadow-[2px_2px_0px_#161616] flex items-center gap-3">
            <div className="w-8 h-8 rounded-none bg-[#D92B8A] text-white flex items-center justify-center font-display font-black text-xs border border-[#161616]">
              {currentUser.avatarInitials || 'US'}
            </div>
            <div>
              <div className="font-display font-bold text-xs uppercase text-[#161616]">
                {currentUser.name}
              </div>
              <div className="font-mono text-[10px] text-[#6B6862]">
                {currentUser.email}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsSwitchingUser(!isSwitchingUser)}
              className="px-3 py-2 bg-white border-2 border-[#161616] font-display text-xs font-black uppercase hover:bg-[#FAF7F0] shadow-[2px_2px_0px_#161616] transition-all"
            >
              {isSwitchingUser ? 'CLOSE' : 'SWITCH USER'}
            </button>
            <button
              onClick={handleLogout}
              title="Log out"
              className="p-2 bg-white border-2 border-[#161616] text-[#6B6862] hover:text-red-700 hover:bg-red-50 shadow-[2px_2px_0px_#161616]"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Success Toast */}
      {actionSuccess && (
        <div className="p-3 bg-green-50 border-2 border-green-800 text-green-900 font-mono text-xs font-bold uppercase flex items-center gap-2 shadow-[2px_2px_0px_#161616] animate-fadeIn">
          <Check className="w-4 h-4 text-green-700" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* User Login & Switcher Modal Panel */}
      {isSwitchingUser && (
        <div className="bg-white border-2 border-[#161616] p-5 sm:p-6 shadow-[5px_5px_0px_#161616] space-y-5 animate-fadeIn">
          <div className="border-b-2 border-[#161616]/15 pb-3">
            <h3 className="font-display font-black text-lg uppercase text-[#161616]">
              SWITCH OR LOG IN AS A DIFFERENT SCHOLAR
            </h3>
            <p className="text-xs text-[#6B6862] font-medium">
              Notes are strictly isolated per account. Logging into another account retrieves that user's private notes archive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Existing Accounts */}
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold uppercase text-[#161616] block">
                AVAILABLE SCHOLAR ACCOUNTS:
              </span>
              <div className="space-y-2">
                {allUsers.map(user => {
                  const isCurrent = user.id === currentUser.id;
                  const userNotesCount = StorageService.getUserNotes(user.id).length;
                  return (
                    <div
                      key={user.id}
                      onClick={() => !isCurrent && handleSwitchUserAccount(user)}
                      className={`p-3 border-2 border-[#161616] flex items-center justify-between transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#FAF7F0] border-l-8 border-l-[#D92B8A]'
                          : 'bg-white hover:bg-[#FAF7F0] shadow-[2px_2px_0px_#161616]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-[#161616] text-white flex items-center justify-center font-mono font-bold text-xs">
                          {user.avatarInitials || 'US'}
                        </div>
                        <div>
                          <div className="font-display font-bold text-xs uppercase text-[#161616]">
                            {user.name} {isCurrent && '(CURRENT)'}
                          </div>
                          <div className="font-mono text-[10px] text-[#6B6862]">
                            {user.email} &bull; {userNotesCount} {userNotesCount === 1 ? 'saved note' : 'saved notes'}
                          </div>
                        </div>
                      </div>

                      {!isCurrent && (
                        <button className="px-3 py-1 bg-[#161616] text-white font-display text-[10px] font-black uppercase">
                          SWITCH
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Log in with Custom Email */}
            <form onSubmit={handleCreateAndLogin} className="space-y-3 bg-[#FAF7F0] p-4 border border-[#161616]">
              <span className="font-mono text-xs font-bold uppercase text-[#161616] block">
                LOG IN WITH ANOTHER EMAIL:
              </span>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Full Name (e.g. Kwame Mensah)"
                className="w-full p-2.5 bg-white border border-[#161616] text-xs focus:outline-none"
              />
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Email Address (e.g. user@example.com)"
                className="w-full p-2.5 bg-white border border-[#161616] text-xs focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-[#D92B8A] text-white font-display text-xs font-black uppercase tracking-wider tactile-btn"
              >
                LOG IN & RETRIEVE NOTES
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6862]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within your saved notes & topics..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#161616] text-xs sm:text-sm text-[#161616] placeholder:text-[#6B6862] focus:outline-none shadow-[2px_2px_0px_#161616]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 font-mono text-[11px] font-bold uppercase rounded-none border whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#161616] text-white border-[#161616] shadow-[2px_2px_0px_#161616]'
                  : 'bg-white text-[#161616] border-[#161616] hover:bg-[#FAF7F0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid or Empty State */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white border-2 border-[#161616] p-8 sm:p-12 text-center rounded-none shadow-[5px_5px_0px_#161616] space-y-4">
          <div className="w-12 h-12 bg-[#FAF7F0] border-2 border-[#161616] flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6 text-[#D92B8A]" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-display font-black text-xl uppercase text-[#161616]">
              {searchQuery ? 'NO MATCHING STUDY NOTES FOUND' : 'YOUR STUDY NOTES ARCHIVE IS EMPTY'}
            </h3>
            <p className="text-xs sm:text-sm text-[#6B6862] font-medium leading-relaxed">
              {searchQuery
                ? `No notes match "${searchQuery}". Try a different keyword or reset filters.`
                : `While learning concepts or exploring study sets, type your takeaway in the "MY PERSONAL STUDY NOTES" section and click "SAVE NOTE" to archive it here.`}
            </p>
          </div>

          <div>
            <button
              onClick={onExploreSets}
              className="px-6 py-3 bg-[#D92B8A] text-white font-display text-xs font-black uppercase rounded-none tactile-btn"
            >
              EXPLORE CURRICULUM & TAKE NOTES
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
                className="bg-white border-2 border-[#161616] rounded-none p-5 sm:p-6 shadow-[4px_4px_0px_#161616] flex flex-col justify-between space-y-4 group"
              >
                {/* Note Top Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 border-b border-[#161616]/15 pb-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 bg-[#FAF7F0] border border-[#161616] text-[9px] font-mono font-bold uppercase text-[#161616]">
                        {note.category || 'AFRICAN KNOWLEDGE'}
                      </span>
                      <span className="px-1.5 py-0.5 bg-[#161616] text-white text-[9px] font-mono font-bold uppercase">
                        {note.targetType === 'concept' ? 'CONCEPT NOTE' : 'SET NOTE'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] font-mono text-[#6B6862]">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(note.updatedAt || note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <h3 className="font-display font-black text-lg uppercase text-[#161616] leading-tight">
                    {note.targetTitle}
                  </h3>

                  {/* Note Body (Editable or View Mode) */}
                  {isEditing ? (
                    <div className="space-y-2 pt-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={4}
                        className="w-full p-3 bg-[#FAF7F0] border-2 border-[#161616] text-sm text-[#161616] focus:bg-white focus:outline-none resize-none leading-relaxed"
                      />
                      {editError && (
                        <p className="text-xs font-mono text-red-700 font-bold">
                          {editError}
                        </p>
                      )}
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1.5 bg-white border border-[#161616] font-display text-xs font-bold uppercase hover:bg-[#FAF7F0]"
                        >
                          CANCEL
                        </button>
                        <button
                          onClick={() => handleSaveEdit(note.id)}
                          className="px-4 py-1.5 bg-[#D92B8A] text-white font-display text-xs font-black uppercase rounded-none tactile-btn flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>SAVE CHANGES</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-[#FAF7F0] border border-[#161616] text-sm text-[#2C2C2A] leading-relaxed whitespace-pre-wrap font-medium">
                      {note.content}
                    </div>
                  )}
                </div>

                {/* Card Actions Bottom Bar */}
                {!isEditing && (
                  <div className="flex items-center justify-between pt-3 border-t border-[#161616]/15">
                    <button
                      onClick={() => handleNavigateToStudyItem(note)}
                      className="font-mono text-xs font-bold uppercase text-[#D92B8A] hover:underline flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Study Concept →</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEdit(note)}
                        title="Edit Note"
                        className="p-1.5 text-[#161616] hover:bg-[#FAF7F0] border border-transparent hover:border-[#161616] transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id, note.targetTitle)}
                        title="Delete Note"
                        className="p-1.5 text-[#6B6862] hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-600 transition-all"
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
