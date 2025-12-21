import { Terminal, Loader2, CheckCircle2, XCircle, Sparkles, Code2, Heart, PanelBottomOpen, PanelRightOpen } from 'lucide-react';

interface OutputPanelProps {
  output: string;
  isRunning: boolean;
  hasError: boolean;
  layoutMode: 'bottom' | 'side';
  onToggleLayout: () => void;
  isMobile?: boolean;
}

export function OutputPanel({ output, isRunning, hasError, layoutMode, onToggleLayout, isMobile = false }: OutputPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 border-b backdrop-blur-md bg-gradient-to-r from-slate-800/50 via-gray-800/50 to-slate-800/50" style={{
        borderColor: 'rgba(6, 182, 212, 0.2)'
      }}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30">
            <Terminal className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-cyan-400" />
          </div>
          <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">Output</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {isRunning && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
              <span className="hidden sm:inline font-medium text-cyan-300">Executing...</span>
            </div>
          )}

          {!isRunning && output && !hasError && (
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs px-2 py-1 rounded-lg bg-green-500/10 border border-green-500/30">
              <CheckCircle2 className="w-3 h-3 text-green-400" />
              <span className="hidden sm:inline font-medium text-green-300">Success</span>
            </div>
          )}

          {!isRunning && hasError && (
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/30">
              <XCircle className="w-3 h-3 text-red-400" />
              <span className="hidden sm:inline font-medium text-red-300">Error</span>
            </div>
          )}

          {!isMobile && (
            <button
              onClick={onToggleLayout}
              className="p-1.5 rounded-lg hover:bg-cyan-500/10 transition-all duration-300 group border border-transparent hover:border-cyan-500/30"
              title={layoutMode === 'bottom' ? 'Switch to side-by-side' : 'Switch to bottom'}
            >
              {layoutMode === 'bottom' ? (
                <PanelRightOpen className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
              ) : (
                <PanelBottomOpen className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 sm:p-4">
        {isRunning ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3 sm:gap-4 p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 backdrop-blur-sm">
              <Loader2 className="w-8 sm:w-10 h-8 sm:h-10 animate-spin text-cyan-400" />
              <p className="text-xs sm:text-sm text-center px-4 font-medium text-cyan-300">Compiling and running your code...</p>
            </div>
          </div>
        ) : output ? (
          <pre
            className={`font-mono text-xs sm:text-sm whitespace-pre-wrap p-3 sm:p-4 rounded-lg border ${
              hasError
                ? 'bg-red-500/10 border-red-500/30 text-red-200'
                : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-100'
            }`}
          >
            {output}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center px-4 py-6 rounded-xl bg-gradient-to-br from-slate-800/30 to-gray-800/30 border border-cyan-500/10">
              <p className="text-xs sm:text-sm font-medium text-gray-400">
                Click "Run" <span className="hidden sm:inline">or press Ctrl+Enter</span> to execute your code
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
