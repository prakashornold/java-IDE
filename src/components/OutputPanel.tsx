import { Terminal, Loader2, CheckCircle2, XCircle, PanelBottomOpen, PanelRightOpen, Keyboard, Code2 } from 'lucide-react';

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
    <div className="flex flex-col h-full bg-[#1a1b22]">
      <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 border-b border-[#282934] bg-[#1e1f26]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#7d8490]" />
          <span className="text-xs sm:text-sm font-semibold text-[#d5d9e0] tracking-tight">Input / Output</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {isRunning && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs px-2.5 py-1 rounded-md bg-[#5294d0]/10 border border-[#5294d0]/20 animate-border-glow">
              <Loader2 className="w-3 h-3 animate-spin text-[#5294d0]" />
              <span className="hidden sm:inline font-medium text-[#5294d0]">Executing...</span>
            </div>
          )}

          {!isRunning && output && !hasError && (
            <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-[#6aab73]/10 border border-[#6aab73]/20">
              <CheckCircle2 className="w-3 h-3 text-[#6aab73]" />
              <span className="hidden sm:inline font-medium text-[#6aab73]">Success</span>
            </div>
          )}

          {!isRunning && hasError && (
            <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-[#cf6679]/10 border border-[#cf6679]/20">
              <XCircle className="w-3 h-3 text-[#cf6679]" />
              <span className="hidden sm:inline font-medium text-[#cf6679]">Error</span>
            </div>
          )}

          {!isMobile && (
            <button
              onClick={onToggleLayout}
              className="p-1.5 rounded-md hover:bg-[#2c2d38] transition-all group"
              title={layoutMode === 'bottom' ? 'Switch to side-by-side' : 'Switch to bottom'}
            >
              {layoutMode === 'bottom' ? (
                <PanelRightOpen className="w-4 h-4 text-[#7d8490] group-hover:text-[#d5d9e0] transition-colors" />
              ) : (
                <PanelBottomOpen className="w-4 h-4 text-[#7d8490] group-hover:text-[#d5d9e0] transition-colors" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-col border-b border-[#282934]" style={{ height: '15%', minHeight: '60px' }}>
          <div className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 bg-[#1e1f26]/60 border-b border-[#282934]/60">
            <Keyboard className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#7d8490]" />
            <span className="text-xs font-medium text-[#9ba1ad]">Input (stdin)</span>
          </div>
          <textarea
            value={stdin}
            onChange={(e) => onStdinChange(e.target.value)}
            placeholder="Enter program input here (one value per line)..."
            className="flex-1 w-full px-3.5 sm:px-4 py-2 bg-[#1a1b22] text-[#d5d9e0] font-mono text-xs sm:text-sm resize-none focus:outline-none placeholder:text-[#5d6472] transition-colors"
            spellCheck={false}
          />
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 bg-[#1e1f26]/60 border-b border-[#282934]/60">
            <Terminal className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#7d8490]" />
            <span className="text-xs font-medium text-[#9ba1ad]">Output</span>
          </div>
          <div className="flex-1 overflow-auto p-3.5 sm:p-4 bg-[#1a1b22]">
            {isRunning ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#5294d0]/10 rounded-full blur-xl" />
                    <Loader2 className="relative w-8 sm:w-10 h-8 sm:h-10 animate-spin text-[#5294d0]" />
                  </div>
                  <p className="text-xs sm:text-sm text-center px-4 font-medium text-[#9ba1ad]">Compiling and running your code...</p>
                </div>
              </div>
            ) : output ? (
              <pre
                className={`font-mono text-xs sm:text-sm whitespace-pre-wrap leading-relaxed ${
                  hasError
                    ? 'text-[#cf6679]'
                    : 'text-[#d5d9e0]'
                }`}
              >
                {output}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center px-4 py-6">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-[#25262f] flex items-center justify-center border border-[#282934]">
                    <Code2 className="w-5 h-5 text-[#7d8490]" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-[#7d8490] mb-2">
                    Ready to execute
                  </p>
                  <p className="text-xs text-[#5d6472]">
                    Click <span className="text-[#7d8490] font-medium">Run</span>
                    <span className="hidden sm:inline"> or press <kbd>Ctrl</kbd> + <kbd>Enter</kbd></span>
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
