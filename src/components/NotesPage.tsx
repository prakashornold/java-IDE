import { useState, useEffect, useMemo } from 'react';
import { FilePlus, FolderPlus, Grid3x3, Home, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { notesService } from '../services/NotesService';
import { Note, Folder } from '../types/notes.types';
import { NoteCard } from './notes/NoteCard';
import { FolderCard } from './notes/FolderCard';
import { CreateFolderModal } from './notes/CreateFolderModal';
import { MarkdownEditor } from './MarkdownEditor';
import { Header } from './Header';
import { Footer } from './Footer';

interface NotesPageProps {
  onNavigateHome: () => void;
}

const ITEMS_PER_PAGE = 20;

export function NotesPage({ onNavigateHome }: NotesPageProps) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('Untitled Note');
  const [noteContent, setNoteContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (user) {
      loadData();
      setCurrentPage(1);
      setSearchQuery('');
    }
  }, [user, currentFolder]);

  const loadData = async () => {
    try {
      const [notesData, foldersData] = await Promise.all([
        notesService.getNotes(currentFolder),
        notesService.getFolders(currentFolder),
      ]);
      setNotes(notesData);
      setFolders(foldersData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleCreateNote = () => {
    setIsCreatingNote(true);
    setNoteTitle('Untitled Note');
    setNoteContent('');
  };

  const handleOpenNote = (note: Note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
  };

  const handleSaveNote = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      if (editingNote) {
        await notesService.updateNote(editingNote.id, {
          title: noteTitle,
          content: noteContent,
          folder_id: currentFolder,
        });
      } else if (isCreatingNote) {
        await notesService.createNote({
          title: noteTitle,
          content: noteContent,
          folder_id: currentFolder,
        }, user.id);
      }

      setEditingNote(null);
      setIsCreatingNote(false);
      await loadData();
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setIsCreatingNote(false);
    setNoteTitle('Untitled Note');
    setNoteContent('');
  };

  const handleRenameNote = async (noteId: string, newTitle: string) => {
    try {
      await notesService.updateNote(noteId, { title: newTitle });
      await loadData();
    } catch (error) {
      console.error('Error renaming note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await notesService.deleteNote(noteId);
      await loadData();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleCreateFolder = async (name: string) => {
    if (!user) return;

    try {
      await notesService.createFolder({
        name,
        parent_id: currentFolder,
      }, user.id);

      await loadData();
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleOpenFolder = (folderId: string) => {
    setCurrentFolder(folderId);
  };

  const handleRenameFolder = async (folderId: string, newName: string) => {
    try {
      await notesService.updateFolder(folderId, { name: newName });
      await loadData();
    } catch (error) {
      console.error('Error renaming folder:', error);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm('Are you sure you want to delete this folder? All notes inside will be moved to root.')) return;

    try {
      await notesService.deleteFolder(folderId);
      await loadData();
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      return { folders, notes };
    }

    const filteredFolders = folders.filter((folder) =>
      folder.name.toLowerCase().includes(query)
    );

    const filteredNotes = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );

    return { folders: filteredFolders, notes: filteredNotes };
  }, [folders, notes, searchQuery]);

  const paginatedItems = useMemo(() => {
    const allItems = [...filteredItems.folders, ...filteredItems.notes];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return allItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage]);

  const totalPages = Math.ceil(
    (filteredItems.folders.length + filteredItems.notes.length) / ITEMS_PER_PAGE
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  if (!user) {
    return (
      <div className="h-screen flex flex-col bg-[#2B2B2B]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[#A9B7C6] mb-2">Please Log In</h2>
            <p className="text-sm text-[#808080]">You need to be logged in to access your notes</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isCreatingNote || editingNote) {
    return (
      <MarkdownEditor
        title={noteTitle}
        content={noteContent}
        onTitleChange={setNoteTitle}
        onContentChange={setNoteContent}
        onSave={handleSaveNote}
        onCancel={handleCancelEdit}
        isSaving={isSaving}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#2B2B2B]">
      <Header />

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {currentFolder && (
                <button
                  onClick={() => setCurrentFolder(null)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium text-[#A9B7C6] hover:bg-[#2a2d2e] transition-all"
                >
                  <Home className="w-4 h-4" />
                  Back to Root
                </button>
              )}
              <div className="flex items-center gap-2">
                <Grid3x3 className="w-5 h-5 text-[#808080]" />
                <h1 className="text-xl font-bold text-[#A9B7C6]">My Notes</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreateFolderModal(true)}
                className="flex items-center gap-2 px-4 py-1.5 rounded text-sm font-medium bg-[#CC7832] text-white hover:bg-[#E6913F] transition-all"
              >
                <FolderPlus className="w-4 h-4" />
                <span className="hidden sm:inline">New Folder</span>
              </button>

              <button
                onClick={handleCreateNote}
                className="flex items-center gap-2 px-4 py-1.5 rounded text-sm font-medium bg-[#365880] text-white hover:bg-[#4A6FA5] transition-all"
              >
                <FilePlus className="w-4 h-4" />
                <span className="hidden sm:inline">New Note</span>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080]" />
              <input
                type="text"
                placeholder="Search notes and folders..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#313335] border border-[#3C3F41] rounded text-[#A9B7C6] placeholder-[#808080] focus:outline-none focus:border-[#365880] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {paginatedItems.map((item) => {
              if ('name' in item) {
                return (
                  <FolderCard
                    key={item.id}
                    folder={item as Folder}
                    onOpen={() => handleOpenFolder(item.id)}
                    onRename={(newName) => handleRenameFolder(item.id, newName)}
                    onDelete={() => handleDeleteFolder(item.id)}
                  />
                );
              } else {
                return (
                  <NoteCard
                    key={item.id}
                    note={item as Note}
                    onOpen={() => handleOpenNote(item as Note)}
                    onRename={(newTitle) => handleRenameNote(item.id, newTitle)}
                    onDelete={() => handleDeleteNote(item.id)}
                  />
                );
              }
            })}
          </div>

          {paginatedItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-[#808080]">
                {searchQuery
                  ? 'No results found. Try a different search term.'
                  : 'No folders or notes yet. Create your first note or folder to get started!'}
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 rounded text-sm font-medium text-[#A9B7C6] bg-[#313335] hover:bg-[#2a2d2e] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                        currentPage === pageNum
                          ? 'bg-[#365880] text-white'
                          : 'text-[#A9B7C6] bg-[#313335] hover:bg-[#2a2d2e]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 rounded text-sm font-medium text-[#A9B7C6] bg-[#313335] hover:bg-[#2a2d2e] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <CreateFolderModal
        isOpen={showCreateFolderModal}
        onClose={() => setShowCreateFolderModal(false)}
        onCreate={handleCreateFolder}
      />

      <Footer />
    </div>
  );
}
