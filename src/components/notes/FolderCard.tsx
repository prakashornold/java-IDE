import { Folder as FolderIcon, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Folder } from '../../types/notes.types';
import { useState, useRef, useEffect } from 'react';

interface FolderCardProps {
  folder: Folder;
  onOpen: () => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
}

export function FolderCard({ folder, onOpen, onRename, onDelete }: FolderCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(folder.name);
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
    if (newName.trim() && newName !== folder.name) {
      onRename(newName.trim());
    }
    setIsRenaming(false);
    setShowMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setNewName(folder.name);
      setIsRenaming(false);
    }
  };

  return (
    <div
      className="relative group bg-[#1e1e1e] border border-[#323232] rounded-lg p-4 hover:border-[#515151] transition-all cursor-pointer"
      onDoubleClick={onOpen}
    >
      <div className="flex items-start justify-between mb-2">
        <FolderIcon className="w-8 h-8 text-[#CC7832]" />
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
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={handleRename}
          onKeyDown={handleKeyDown}
          className="w-full px-2 py-1 bg-[#2B2B2B] text-[#A9B7C6] text-sm border border-[#515151] rounded focus:outline-none focus:border-[#6897BB]"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <h3 className="text-sm font-medium text-[#A9B7C6] truncate">{folder.name}</h3>
      )}
    </div>
  );
}
