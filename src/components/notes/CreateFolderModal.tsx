import { useState } from 'react';
import { X, Folder } from 'lucide-react';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export function CreateFolderModal({ isOpen, onClose, onCreate }: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      onCreate(folderName.trim());
      setFolderName('');
      onClose();
    }
  };

  const handleClose = () => {
    setFolderName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[#2B2B2B] border border-[#323232] rounded-lg shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#323232]">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-[#CC7832]" />
            <h2 className="text-lg font-semibold text-[#A9B7C6]">Create New Folder</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded hover:bg-[#2a2d2e] transition-all"
          >
            <X className="w-5 h-5 text-[#A9B7C6]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#A9B7C6] mb-2">
              Folder Name
            </label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="w-full px-4 py-2 bg-[#1e1e1e] text-[#A9B7C6] border border-[#323232] rounded focus:outline-none focus:border-[#6897BB] placeholder:text-[#606366]"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-[#A9B7C6] hover:bg-[#2a2d2e] rounded transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!folderName.trim()}
              className="px-4 py-2 text-sm font-medium bg-[#365880] text-white rounded hover:bg-[#4A6FA5] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
