import { useState, useRef, useEffect } from 'react';
import { Sparkles, Code2, Heart, Eye, Play } from 'lucide-react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { OutputPanel } from './components/OutputPanel';
import { ProblemsListPage } from './components/ProblemsListPage';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';
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
  const [currentPage, setCurrentPage] = useState<'home' | 'problems' | 'dashboard' | 'admin'>('home');
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

  const handleNavigateToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const handleNavigateHome = () => {
    setCurrentPage('home');
  };

  const handleNavigateToAdmin = () => {
    setCurrentPage('admin');
  };

  if (currentPage === 'admin') {
    return <AdminPanel onNavigateHome={handleNavigateHome} />;
  }

  if (currentPage === 'problems') {
    return (
      <ProblemsListPage
        onNavigateHome={handleNavigateHome}
        onSelectProblem={handleSelectProblem}
        cachedProblems={cachedProblems}
      />
    );
  }

  if (currentPage === 'dashboard') {
    return (
      <Dashboard
        onNavigateHome={handleNavigateHome}
        cachedProblems={cachedProblems}
      />
    );
  }

  return (
    <div
      className="h-screen flex flex-col overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Header
        onRandomProblem={handleRandomProblem}
        isLoadingProblem={isLoadingProblem}
        onNavigateToProblems={handleNavigateToProblems}
        onNavigateToDashboard={handleNavigateToDashboard}
        onNavigateToAdmin={handleNavigateToAdmin}
      />

      <div
        ref={containerRef}
        className={`flex-1 flex overflow-hidden ${layoutMode === 'bottom' || isMobile ? 'flex-col' : 'flex-row'}`}
      >
        <div
          className="relative overflow-hidden flex flex-col backdrop-blur-2xl bg-white/10 rounded-2xl m-2 border border-white/20 shadow-2xl"
          style={{
            [layoutMode === 'bottom' || isMobile ? 'height' : 'width']: isMobile ? '50%' : `${100 - outputSize}%`,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
          }}
        >
          {currentProblem && (
            <div className="border-b px-3 sm:px-4 py-3 backdrop-blur-md bg-white/5" style={{
              borderColor: 'rgba(255, 255, 255, 0.18)'
            }}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <span className={`inline-block px-3 py-1 text-[10px] sm:text-xs font-bold rounded-lg shadow-md ${
                      currentProblem.difficulty === 'basic' ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-300 border border-green-500/30' :
                      currentProblem.difficulty === 'intermediate' ? 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-300 border border-blue-500/30' :
                      currentProblem.difficulty === 'advanced' ? 'bg-gradient-to-r from-orange-500/30 to-amber-500/30 text-orange-300 border border-orange-500/30' :
                      'bg-gradient-to-r from-red-500/30 to-rose-500/30 text-red-300 border border-red-500/30'
                    }`}>
                      {currentProblem.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xs sm:text-sm font-bold truncate text-white">
                      #{currentProblem.number}: {currentProblem.title}
                    </h2>
                    {currentProblem.input && (
                      <pre className="text-[10px] sm:text-xs mt-1 whitespace-pre-wrap text-white/80">{currentProblem.input}</pre>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 flex gap-2">
                  <button
                    onClick={handleShowSolution}
                    disabled={showFullSolution}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all duration-300 shadow-lg ${
                      showFullSolution
                        ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white hover:shadow-cyan-500/50 hover:scale-105 border border-cyan-500/50'
                    }`}
                    title="Show complete solution"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Solution</span>
                  </button>
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 border border-emerald-400/50"
                  >
                    <Play className="w-3.5 h-3.5" fill="currentColor" />
                    <span>{isRunning ? 'Running...' : 'Run'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          {!currentProblem && (
            <div className="border-b px-3 sm:px-4 py-3 backdrop-blur-md bg-white/5" style={{
              borderColor: 'rgba(255, 255, 255, 0.18)'
            }}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xs sm:text-sm font-bold text-white">
                    Write a welcome program which prints to console
                  </h2>
                </div>
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex-shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 border border-emerald-400/50"
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
                ? 'w-full cursor-ns-resize hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-emerald-500/30'
                : 'h-full cursor-ew-resize hover:bg-gradient-to-b hover:from-cyan-500/30 hover:to-emerald-500/30'
            } ${isResizing ? 'bg-gradient-to-r from-cyan-500/40 to-emerald-500/40' : ''}`}
            style={{
              [layoutMode === 'bottom' ? 'height' : 'width']: '6px',
              backgroundColor: isResizing ? undefined : 'rgba(6, 182, 212, 0.1)'
            }}
            onMouseDown={handleMouseDown}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full shadow-lg shadow-cyan-500/50 ${
                layoutMode === 'bottom' ? 'w-12 h-1.5' : 'w-1.5 h-12'
              }`} />
            </div>
          </div>
        )}

        <div
          className={`backdrop-blur-2xl bg-white/10 rounded-2xl m-2 border border-white/20 shadow-2xl ${isMobile ? 'border-t' : ''}`}
          style={{
            [layoutMode === 'bottom' || isMobile ? 'height' : 'width']: isMobile ? '50%' : `${outputSize}%`,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
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

      <footer className="relative border-t backdrop-blur-2xl bg-white/10 px-2 sm:px-4 py-3 sm:py-4 shadow-2xl" style={{
        borderColor: 'rgba(255, 255, 255, 0.18)',
        boxShadow: '0 -8px 32px 0 rgba(31, 38, 135, 0.37)'
      }}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs">
          <div className="flex items-center gap-2 sm:gap-2.5 px-4 py-2 rounded-lg backdrop-blur-sm bg-white/5 border border-white/20 shadow-lg">
            <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-yellow-300 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-medium text-white">Developed By</span>
            <span className="font-bold text-[10px] sm:text-xs text-white">
              Om Prakash Peddamadthala
            </span>
            <Code2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-cyan-300" />
            <Heart className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-red-400 fill-red-400 animate-pulse drop-shadow-lg" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-sm bg-white/5 border border-white/10">
            <span className="hidden sm:inline text-white/50">•</span>
            <span className="text-[10px] sm:text-xs font-medium text-white/90">© 2024 All Rights Reserved</span>
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
