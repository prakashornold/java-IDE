import { FileText, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Note } from '../../types/notes.types';
import { useState, useRef, useEffect } from 'react';

interface NoteCardProps {
  note: Note;
  onOpen: () => void;
  onRename: (newTitle: string) => void;
  onDelete: () => void;
}

export function NoteCard({ note, onOpen, onRename, onDelete }: NoteCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(note.title);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const handleRename = () => {
    if (newTitle.trim() && newTitle !== note.title) {
      onRename(newTitle.trim());
    }
    setIsRenaming(false);
    setShowMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setNewTitle(note.title);
      setIsRenaming(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getPreviewText = () => {
    const text = note.content.replace(/[#*`>\-\[\]]/g, '').trim();
    return text.substring(0, 100) + (text.length > 100 ? '...' : '');
  };

  return (
    <div
      className="relative group bg-[#1e1e1e] border border-[#323232] rounded-lg p-4 hover:border-[#515151] transition-all cursor-pointer"
      onDoubleClick={onOpen}
    >
      <div className="flex items-start justify-between mb-2">
        <FileText className="w-8 h-8 text-[#6897BB]" />
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-[#2a2d2e] transition-all"
          >
            <MoreVertical className="w-4 h-4 text-[#A9B7C6]" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-32 bg-[#2B2B2B] border border-[#323232] rounded-lg shadow-xl z-10 overflow-hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRenaming(true);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#A9B7C6] hover:bg-[#2a2d2e] transition-all"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Rename
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#BC3F3C] hover:bg-[#2a2d2e] transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {isRenaming ? (
        <input
          ref={inputRef}
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={handleKeyDown}
          className="w-full px-2 py-1 mb-2 bg-[#2B2B2B] text-[#A9B7C6] text-sm font-medium border border-[#515151] rounded focus:outline-none focus:border-[#6897BB]"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <h3 className="text-sm font-medium text-[#A9B7C6] truncate mb-2">{note.title}</h3>
      )}

      <p className="text-xs text-[#808080] line-clamp-2 mb-2">{getPreviewText()}</p>
      <p className="text-xs text-[#606366]">{formatDate(note.updated_at)}</p>
    </div>
  );
}
