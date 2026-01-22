import { useState } from 'react';
import { Eye, EyeOff, Save, X } from 'lucide-react';
import { renderMarkdown } from '../utils/markdownUtils';
import { Header } from './Header';
import { Footer } from './Footer';

interface MarkdownEditorProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export function MarkdownEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  onSave,
  onCancel,
  isSaving = false,
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-[#2B2B2B]">
      <Header />

      {/* Editor Header Section */}
      <div className="border-b border-[#323232] bg-[#313335]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Note Title"
              className="flex-1 bg-transparent text-lg font-semibold text-[#A9B7C6] border-none outline-none placeholder:text-[#606366]"
            />

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium text-[#A9B7C6] hover:bg-[#2a2d2e] transition-all"
                title={showPreview ? 'Hide Preview' : 'Show Preview'}
              >
                {showPreview ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>Hide Preview</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Show Preview</span>
                  </>
                )}
              </button>

              <button
                onClick={onSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-1.5 rounded text-sm font-medium bg-[#365880] text-white hover:bg-[#4A6FA5] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save'}</span>
              </button>

              <button
                onClick={onCancel}
                className="flex items-center gap-2 px-4 py-1.5 rounded text-sm font-medium text-[#BC3F3C] hover:bg-[#2a2d2e] transition-all"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col border-r border-[#323232]`}>
          <div className="px-4 py-2 bg-[#252526] border-b border-[#323232]">
            <span className="text-xs font-medium text-[#A9B7C6]">Markdown Editor</span>
          </div>
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Write your note in Markdown..."
            className="flex-1 w-full px-4 py-3 bg-[#1e1e1e] text-[#A9B7C6] font-mono text-sm resize-none focus:outline-none placeholder:text-[#606366]"
            spellCheck={false}
          />
        </div>

        {showPreview && (
          <div className="w-1/2 flex flex-col overflow-hidden">
            <div className="px-4 py-2 bg-[#252526] border-b border-[#323232]">
              <span className="text-xs font-medium text-[#A9B7C6]">Preview</span>
            </div>
            <div className="flex-1 overflow-auto px-4 py-3 bg-[#1e1e1e]">
              <div className="prose prose-invert prose-sm max-w-none">
                {renderMarkdown(content)}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
