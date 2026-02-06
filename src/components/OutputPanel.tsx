import { Terminal, Loader2, CheckCircle2, XCircle, PanelBottomOpen, PanelRightOpen, Keyboard } from 'lucide-react';

interface OutputPanelProps {
  output: string;
  isRunning: boolean;
  hasError: boolean;
  layoutMode: 'bottom' | 'side';
  onToggleLayout: () => void;
  isMobile?: boolean;
  stdin: string;
  onStdinChange: (value: string) => void;
}

export function OutputPanel({ output, isRunning, hasError, layoutMode, onToggleLayout, isMobile = false, stdin, onStdinChange }: OutputPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 border-b border-[#323232] bg-[#1e1e1e]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#808080]" />
          <span className="text-xs sm:text-sm font-semibold text-[#A9B7C6]">Input / Output</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {isRunning && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs px-2 py-1 rounded bg-[#2B3D4F]">
              <Loader2 className="w-3 h-3 animate-spin text-[#6897BB]" />
              <span className="hidden sm:inline font-medium text-[#6897BB]">Executing...</span>
            </div>
          )}

          {!isRunning && output && !hasError && (
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs px-2 py-1 rounded bg-[#2E5C2E]">
              <CheckCircle2 className="w-3 h-3 text-[#6AAB73]" />
              <span className="hidden sm:inline font-medium text-[#6AAB73]">Success</span>
            </div>
          )}

          {!isRunning && hasError && (
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs px-2 py-1 rounded bg-[#4B2E2E]">
              <XCircle className="w-3 h-3 text-[#BC3F3C]" />
              <span className="hidden sm:inline font-medium text-[#BC3F3C]">Error</span>
            </div>
          )}

          {!isMobile && (
            <button
              onClick={onToggleLayout}
              className="p-1.5 rounded hover:bg-[#2a2d2e] transition-all group"
              title={layoutMode === 'bottom' ? 'Switch to side-by-side' : 'Switch to bottom'}
            >
              {layoutMode === 'bottom' ? (
                <PanelRightOpen className="w-4 h-4 text-[#808080] group-hover:text-[#BBBBBB] transition-colors" />
              ) : (
                <PanelBottomOpen className="w-4 h-4 text-[#808080] group-hover:text-[#BBBBBB] transition-colors" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Input Section - 15% height */}
        <div className="flex flex-col border-b border-[#323232]" style={{ height: '15%', minHeight: '60px' }}>
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#252526] border-b border-[#323232]">
            <Keyboard className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#808080]" />
            <span className="text-[10px] sm:text-xs font-medium text-[#A9B7C6]">Input (stdin)</span>
          </div>
          <textarea
            value={stdin}
            onChange={(e) => onStdinChange(e.target.value)}
            placeholder="Enter program input here (one value per line)..."
            className="flex-1 w-full px-3 sm:px-4 py-2 bg-[#1e1e1e] text-[#A9B7C6] font-mono text-xs sm:text-sm resize-none focus:outline-none placeholder:text-[#606366]"
            spellCheck={false}
          />
        </div>

        {/* Output Section - 50% height */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#252526] border-b border-[#323232]">
            <Terminal className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#808080]" />
            <span className="text-[10px] sm:text-xs font-medium text-[#A9B7C6]">Output</span>
          </div>
          <div className="flex-1 overflow-auto p-3 sm:p-4 bg-[#1e1e1e]">
            {isRunning ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-3 sm:gap-4">
                  <Loader2 className="w-8 sm:w-10 h-8 sm:h-10 animate-spin text-[#6897BB]" />
                  <p className="text-xs sm:text-sm text-center px-4 font-medium text-[#A9B7C6]">Compiling and running your code...</p>
                </div>
              </div>
            ) : output ? (
              <pre
                className={`font-mono text-xs sm:text-sm whitespace-pre-wrap ${
                  hasError
                    ? 'text-[#BC3F3C]'
                    : 'text-[#A9B7C6]'
                }`}
              >
                {output}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center px-4 py-6">
                  <p className="text-xs sm:text-sm font-medium text-[#808080]">
                    Click "Run" <span className="hidden sm:inline">or press Ctrl+Enter</span> to execute your code
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
