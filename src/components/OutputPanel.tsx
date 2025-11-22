import { Terminal, Loader2, CheckCircle2, XCircle, Sparkles, Code2, Heart, PanelBottomOpen, PanelRightOpen } from 'lucide-react';

interface OutputPanelProps {
  output: string;
  isRunning: boolean;
  hasError: boolean;
  layoutMode: 'bottom' | 'side';
  onToggleLayout: () => void;
}

export function OutputPanel({ output, isRunning, hasError, layoutMode, onToggleLayout }: OutputPanelProps) {
  return (
    <div className={`bg-[#0d1117] flex flex-col h-full ${layoutMode === 'side' ? 'border-l' : 'border-t'} border-gray-800`}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gradient-to-r from-[#0d1117] to-[#161b22]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#00D4AA]" />
          <span className="text-sm font-semibold text-gray-300">Output</span>
        </div>

        <div className="flex items-center gap-3">
          {isRunning && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Executing...</span>
            </div>
          )}

          {!isRunning && output && !hasError && (
            <div className="flex items-center gap-1 text-xs text-green-400">
              <CheckCircle2 className="w-3 h-3" />
              <span>Success</span>
            </div>
          )}

          {!isRunning && hasError && (
            <div className="flex items-center gap-1 text-xs text-red-400">
              <XCircle className="w-3 h-3" />
              <span>Error</span>
            </div>
          )}

          <button
            onClick={onToggleLayout}
            className="p-1.5 rounded hover:bg-gray-700/50 transition-colors group"
            title={layoutMode === 'bottom' ? 'Switch to side-by-side' : 'Switch to bottom'}
          >
            {layoutMode === 'bottom' ? (
              <PanelRightOpen className="w-4 h-4 text-gray-400 group-hover:text-[#00D4AA]" />
            ) : (
              <PanelBottomOpen className="w-4 h-4 text-gray-400 group-hover:text-[#00D4AA]" />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {isRunning ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-[#00D4AA] animate-spin" />
              <p className="text-gray-400 text-sm">Compiling and running your code...</p>
            </div>
          </div>
        ) : output ? (
          <pre
            className={`font-mono text-sm whitespace-pre-wrap ${
              hasError ? 'text-red-400 bg-red-950/20 p-3 rounded border border-red-900/30' : 'text-gray-100'
            }`}
          >
            {output}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">
              Click "Run" or press Ctrl+Enter to execute your code
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-gray-800 bg-gradient-to-r from-[#161b22] via-[#0d1117] to-[#161b22] px-4 py-2.5">
        <div className="flex items-center justify-center gap-2 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-gray-400">Developed By</span>
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00D4AA] to-[#00A8E8]">
            Om Prakash Peddamadthala
          </span>
          <Code2 className="w-3.5 h-3.5 text-[#00D4AA]" />
          <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
