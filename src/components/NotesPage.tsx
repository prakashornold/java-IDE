import { useState, useEffect } from 'react';
import { FilePlus, FolderPlus, Grid3x3, Home } from 'lucide-react';
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

  useEffect(() => {
    if (user) {
      loadData();
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
        });
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
    try {
      await notesService.createFolder({
        name,
        parent_id: currentFolder,
      });

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

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {folders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                onOpen={() => handleOpenFolder(folder.id)}
                onRename={(newName) => handleRenameFolder(folder.id, newName)}
                onDelete={() => handleDeleteFolder(folder.id)}
              />
            ))}

            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onOpen={() => handleOpenNote(note)}
                onRename={(newTitle) => handleRenameNote(note.id, newTitle)}
                onDelete={() => handleDeleteNote(note.id)}
              />
            ))}
          </div>

          {folders.length === 0 && notes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-[#808080]">
                No folders or notes yet. Create your first note or folder to get started!
              </p>
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
