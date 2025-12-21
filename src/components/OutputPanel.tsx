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
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 border-b backdrop-blur-md bg-white/5" style={{
        borderColor: 'rgba(255, 255, 255, 0.18)'
      }}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/10 border border-white/20">
            <Terminal className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-white">Output</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {isRunning && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs px-2 py-1 rounded-lg bg-white/10 border border-white/20">
              <Loader2 className="w-3 h-3 animate-spin text-white" />
              <span className="hidden sm:inline font-medium text-white">Executing...</span>
            </div>
          )}

          {!isRunning && output && !hasError && (
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs px-2 py-1 rounded-lg bg-green-500/20 border border-green-400/30">
              <CheckCircle2 className="w-3 h-3 text-green-300" />
              <span className="hidden sm:inline font-medium text-green-200">Success</span>
            </div>
          )}

          {!isRunning && hasError && (
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs px-2 py-1 rounded-lg bg-red-500/20 border border-red-400/30">
              <XCircle className="w-3 h-3 text-red-300" />
              <span className="hidden sm:inline font-medium text-red-200">Error</span>
            </div>
          )}

          {!isMobile && (
            <button
              onClick={onToggleLayout}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-all duration-300 group border border-white/20 hover:border-white/40"
              title={layoutMode === 'bottom' ? 'Switch to side-by-side' : 'Switch to bottom'}
            >
              {layoutMode === 'bottom' ? (
                <PanelRightOpen className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
              ) : (
                <PanelBottomOpen className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 sm:p-4">
        {isRunning ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3 sm:gap-4 p-6 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
              <Loader2 className="w-8 sm:w-10 h-8 sm:h-10 animate-spin text-white" />
              <p className="text-xs sm:text-sm text-center px-4 font-medium text-white">Compiling and running your code...</p>
            </div>
          </div>
        ) : output ? (
          <pre
            className={`font-mono text-xs sm:text-sm whitespace-pre-wrap p-3 sm:p-4 rounded-lg border backdrop-blur-sm ${
              hasError
                ? 'bg-red-500/20 border-red-400/30 text-red-100'
                : 'bg-green-500/10 border-green-400/20 text-white'
            }`}
          >
            {output}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center px-4 py-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-xs sm:text-sm font-medium text-white/80">
                Click "Run" <span className="hidden sm:inline">or press Ctrl+Enter</span> to execute your code
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
