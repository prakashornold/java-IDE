import { Play, Code2, Shuffle } from 'lucide-react';

interface HeaderProps {
  onRun: () => void;
  isRunning: boolean;
  onRandomProblem: () => void;
  isLoadingProblem: boolean;
}

export function Header({ onRun, isRunning, onRandomProblem, isLoadingProblem }: HeaderProps) {
  return (
    <header className="bg-[#0d1117] border-b border-gray-800 px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-3">
        <Code2 className="w-5 sm:w-6 h-5 sm:h-6 text-[#00D4AA]" />
        <h1 className="text-base sm:text-xl font-bold text-white">Java-IDE</h1>
        <span className="text-xs text-gray-500 hidden md:inline">
          Online Java Compiler & Runner
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onRandomProblem}
          disabled={isLoadingProblem}
          className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
          title="Load a random Java Stream API problem"
        >
          <Shuffle className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          <span className="hidden sm:inline">{isLoadingProblem ? 'Loading...' : 'Random'}</span>
        </button>

        <button
          onClick={onRun}
          disabled={isRunning}
          className="flex items-center gap-1.5 sm:gap-2 bg-[#00D4AA] hover:bg-[#00ba95] disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          <Play className="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="currentColor" />
          <span>{isRunning ? 'Running...' : 'Run'}</span>
          <span className="hidden md:inline text-xs opacity-75 ml-1">
            (Ctrl+Enter)
          </span>
        </button>
      </div>
    </header>
  );
}
