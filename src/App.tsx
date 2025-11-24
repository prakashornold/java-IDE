import { useState, useRef, useEffect } from 'react';
import { Sparkles, Code2, Heart, Eye, Play } from 'lucide-react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { OutputPanel } from './components/OutputPanel';
import { ProblemsListPage } from './components/ProblemsListPage';
import { AuthModal } from './components/AuthModal';
import { useServices } from './context/ServiceContext';
import { useAuth } from './context/AuthContext';
import { JavaProblem } from './types/problem.types';
import { DEFAULT_JAVA_CODE } from './constants/defaultCode';

type LayoutMode = 'bottom' | 'side';

const EXECUTION_LIMIT_KEY = 'code_execution_count';
const EXECUTION_LIMIT = 3;

function App() {
  const { problemService, compilerService } = useServices();
  const { user } = useAuth();
  const [code, setCode] = useState(DEFAULT_JAVA_CODE);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('side');
  const [isMobile, setIsMobile] = useState(false);
  const [outputSize, setOutputSize] = useState(40);
  const [isResizing, setIsResizing] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<JavaProblem | null>(null);
  const [isLoadingProblem, setIsLoadingProblem] = useState(false);
  const [showFullSolution, setShowFullSolution] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'problems'>('home');
  const [cachedProblems, setCachedProblems] = useState<JavaProblem[] | null>(null);
  const [executionCount, setExecutionCount] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setLayoutMode('bottom');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const loadProblems = async () => {
      const problems = await problemService.getAllProblems();
      setCachedProblems(problems);
    };
    loadProblems();
  }, [problemService]);

  useEffect(() => {
    if (!user) {
      const count = parseInt(localStorage.getItem(EXECUTION_LIMIT_KEY) || '0', 10);
      setExecutionCount(count);
    } else {
      setExecutionCount(0);
      localStorage.removeItem(EXECUTION_LIMIT_KEY);
    }
  }, [user]);

  useEffect(() => {
    const cleanupHash = () => {
      const hash = window.location.hash;
      if (hash && (hash.includes('access_token') || hash.includes('refresh_token'))) {
        setTimeout(() => {
          window.history.replaceState(null, '', window.location.pathname);
        }, 100);
      }
    };

    cleanupHash();
  }, []);

  const handleRunCode = async () => {
    if (!user && executionCount >= EXECUTION_LIMIT) {
      setShowAuthModal(true);
      return;
    }

    setIsRunning(true);
    setOutput('');
    setHasError(false);

    try {
      const result = await compilerService.execute(code);

      if (result.error) {
        setOutput(result.error);
        setHasError(true);
      } else if (result.output) {
        setOutput(result.output);
        setHasError(false);
      } else {
        setOutput('Code executed successfully with no output');
        setHasError(false);
      }

      if (!user) {
        const newCount = executionCount + 1;
        setExecutionCount(newCount);
        localStorage.setItem(EXECUTION_LIMIT_KEY, newCount.toString());
      }
    } catch (error) {
      setOutput('Unexpected error occurred while running code');
      setHasError(true);
    } finally {
      setIsRunning(false);
    }
  };

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isResizing || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    if (layoutMode === 'bottom') {
      const newHeight = ((rect.bottom - e.clientY) / rect.height) * 100;
      setOutputSize(Math.max(20, Math.min(70, newHeight)));
    } else {
      const newWidth = ((rect.right - e.clientX) / rect.width) * 100;
      setOutputSize(Math.max(20, Math.min(70, newWidth)));
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const toggleLayout = () => {
    if (!isMobile) {
      setLayoutMode(prev => prev === 'bottom' ? 'side' : 'bottom');
    }
  };

  const handleRandomProblem = async () => {
    setIsLoadingProblem(true);
    try {
      const problem = await problemService.getRandomProblem();
      if (problem) {
        setCurrentProblem(problem);
        const practiceCode = problemService.extractPracticeCode(problem.solution);
        setCode(practiceCode);
        setShowFullSolution(false);
        setOutput('');
        setHasError(false);
      } else {
        setOutput('No problems found in database. Please seed the database first.');
        setHasError(true);
      }
    } catch (error) {
      setOutput('Error loading random problem');
      setHasError(true);
    } finally {
      setIsLoadingProblem(false);
    }
  };

  const handleShowSolution = () => {
    if (!currentProblem) return;
    setCode(currentProblem.solution);
    setShowFullSolution(true);
    setOutput('');
    setHasError(false);
  };

  const handleSelectProblem = (problem: JavaProblem) => {
    setCurrentProblem(problem);
    const practiceCode = problemService.extractPracticeCode(problem.solution);
    setCode(practiceCode);
    setShowFullSolution(false);
    setOutput('');
    setHasError(false);
  };

  const handleNavigateToProblems = () => {
    setCurrentPage('problems');
  };

  const handleNavigateHome = () => {
    setCurrentPage('home');
  };

  if (currentPage === 'problems') {
    return (
      <ProblemsListPage
        onNavigateHome={handleNavigateHome}
        onSelectProblem={handleSelectProblem}
        cachedProblems={cachedProblems}
      />
    );
  }

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Header
        onRandomProblem={handleRandomProblem}
        isLoadingProblem={isLoadingProblem}
        onNavigateToProblems={handleNavigateToProblems}
      />

      <div
        ref={containerRef}
        className={`flex-1 flex overflow-hidden ${layoutMode === 'bottom' || isMobile ? 'flex-col' : 'flex-row'}`}
      >
        <div
          className="relative overflow-hidden flex flex-col"
          style={{
            [layoutMode === 'bottom' || isMobile ? 'height' : 'width']: isMobile ? '50%' : `${100 - outputSize}%`
          }}
        >
          {currentProblem && (
            <div className="border-b px-3 sm:px-4 py-2 sm:py-3" style={{
              background: 'linear-gradient(to right, var(--bg-gradient-start), var(--bg-gradient-mid), var(--bg-gradient-end))',
              borderColor: 'var(--border-color)'
            }}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <span className={`inline-block px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded ${
                      currentProblem.difficulty === 'basic' ? 'bg-green-500/20 text-green-400' :
                      currentProblem.difficulty === 'intermediate' ? 'bg-blue-500/20 text-blue-400' :
                      currentProblem.difficulty === 'advanced' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {currentProblem.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xs sm:text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      #{currentProblem.number}: {currentProblem.title}
                    </h2>
                    {currentProblem.input && (
                      <pre className="text-[10px] sm:text-xs mt-1 whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{currentProblem.input}</pre>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 flex gap-2">
                  <button
                    onClick={handleShowSolution}
                    disabled={showFullSolution}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 shadow-lg ${
                      showFullSolution
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white hover:shadow-cyan-500/50 hover:scale-105'
                    }`}
                    title="Show complete solution"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Solution</span>
                  </button>
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 bg-[#00D4AA] hover:bg-[#00ba95] disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5" fill="currentColor" />
                    <span>{isRunning ? 'Running...' : 'Run'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          {!currentProblem && (
            <div className="border-b px-3 sm:px-4 py-2 sm:py-3" style={{
              background: 'linear-gradient(to right, var(--bg-gradient-start), var(--bg-gradient-mid), var(--bg-gradient-end))',
              borderColor: 'var(--border-color)'
            }}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Write a welcome program which prints to console
                  </h2>
                </div>
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex-shrink-0 flex items-center gap-1.5 bg-[#00D4AA] hover:bg-[#00ba95] disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5" fill="currentColor" />
                  <span>{isRunning ? 'Running...' : 'Run'}</span>
                </button>
              </div>
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              value={code}
              onChange={setCode}
              onRun={handleRunCode}
            />
          </div>
        </div>

        {!isMobile && (
          <div
            className={`relative ${
              layoutMode === 'bottom'
                ? 'w-full cursor-ns-resize hover:bg-[#00D4AA]/20'
                : 'h-full cursor-ew-resize hover:bg-[#00D4AA]/20'
            } ${isResizing ? 'bg-[#00D4AA]/30' : ''}`}
            style={{
              [layoutMode === 'bottom' ? 'height' : 'width']: '4px',
              backgroundColor: isResizing ? undefined : '#374151'
            }}
            onMouseDown={handleMouseDown}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`bg-[#00D4AA] rounded-full ${
                layoutMode === 'bottom' ? 'w-8 h-1' : 'w-1 h-8'
              }`} />
            </div>
          </div>
        )}

        <div
          className={isMobile ? 'border-t border-gray-800' : ''}
          style={{
            [layoutMode === 'bottom' || isMobile ? 'height' : 'width']: isMobile ? '50%' : `${outputSize}%`
          }}
        >
          <OutputPanel
            output={output}
            isRunning={isRunning}
            hasError={hasError}
            layoutMode={layoutMode}
            onToggleLayout={toggleLayout}
            isMobile={isMobile}
          />
        </div>
      </div>

      <footer className="border-t px-2 sm:px-4 py-2 sm:py-3" style={{
        background: 'linear-gradient(to right, var(--bg-gradient-start), var(--bg-gradient-mid), var(--bg-gradient-end))',
        borderColor: 'var(--border-color)'
      }}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs">
          <div className="flex items-center gap-1 sm:gap-2">
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-yellow-400" />
            <span className="text-[10px] sm:text-xs" style={{ color: 'var(--text-secondary)' }}>Developed By</span>
            <span className="font-semibold text-transparent bg-clip-text text-[10px] sm:text-xs" style={{ backgroundImage: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))' }}>
              Om Prakash Peddamadthala
            </span>
            <Code2 className="w-3 sm:w-3.5 h-3 sm:h-3.5" style={{ color: 'var(--accent-primary)' }} />
            <Heart className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-red-500 fill-red-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="hidden sm:inline" style={{ color: 'var(--text-tertiary)' }}>|</span>
            <span className="text-[10px] sm:text-xs" style={{ color: 'var(--text-tertiary)' }}>© 2024 All Rights Reserved</span>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        executionCount={executionCount}
      />
    </div>
  );
}

export default App;
