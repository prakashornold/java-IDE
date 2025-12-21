import { useState, useRef, useEffect } from 'react';
import { Sparkles, Code2, Heart, Eye, Play } from 'lucide-react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { OutputPanel } from './components/OutputPanel';
import { ProblemSidebar } from './components/ProblemSidebar';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setLayoutMode('bottom');
        setIsSidebarOpen(false);
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
    if (currentPage !== 'home') {
      setCurrentPage('home');
    }
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
      className="h-screen flex flex-col overflow-hidden"
      style={{
        background: '#2B2B2B'
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
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex overflow-hidden">
        {isSidebarOpen && cachedProblems && (
          <ProblemSidebar
            problems={cachedProblems}
            onSelectProblem={handleSelectProblem}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            currentProblemId={currentProblem?.id}
            isMobile={isMobile}
          />
        )}

        <div
          ref={containerRef}
          className={`flex-1 flex overflow-hidden ${layoutMode === 'bottom' || isMobile ? 'flex-col' : 'flex-row'}`}
        >
        <div
          className="relative overflow-hidden flex flex-col bg-[#313335] border border-[#323232]"
          style={{
            [layoutMode === 'bottom' || isMobile ? 'height' : 'width']: isMobile ? '50%' : `${100 - outputSize}%`
          }}
        >
          {currentProblem && (
            <div className="border-b border-[#323232] px-3 sm:px-4 py-3 bg-[#3C3F41]">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <span className={`inline-block px-3 py-1 text-[10px] sm:text-xs font-semibold rounded ${
                      currentProblem.difficulty === 'basic' ? 'bg-[#2E5C2E] text-[#6AAB73]' :
                      currentProblem.difficulty === 'intermediate' ? 'bg-[#2B3D4F] text-[#6897BB]' :
                      currentProblem.difficulty === 'advanced' ? 'bg-[#4F3A2E] text-[#CC7832]' :
                      'bg-[#4B2E2E] text-[#BC3F3C]'
                    }`}>
                      {currentProblem.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xs sm:text-sm font-semibold truncate text-[#A9B7C6]">
                      #{currentProblem.number}: {currentProblem.title}
                    </h2>
                    {currentProblem.input && (
                      <pre className="text-[10px] sm:text-xs mt-1 whitespace-pre-wrap text-[#808080]">{currentProblem.input}</pre>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 flex gap-2">
                  <button
                    onClick={handleShowSolution}
                    disabled={showFullSolution}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded transition-all ${
                      showFullSolution
                        ? 'bg-[#45494A] text-[#808080] cursor-not-allowed'
                        : 'bg-[#4C5052] hover:bg-[#5C6164] text-[#BBBBBB] border border-[#6B6B6B]'
                    }`}
                    title="Show complete solution"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Solution</span>
                  </button>
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 bg-[#365880] hover:bg-[#4A6B8C] disabled:bg-[#45494A] disabled:cursor-not-allowed text-white px-4 py-2 rounded text-xs font-medium transition-all border border-[#466D94]"
                  >
                    <Play className="w-3.5 h-3.5" fill="currentColor" />
                    <span>{isRunning ? 'Running...' : 'Run'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          {!currentProblem && (
            <div className="border-b border-[#323232] px-3 sm:px-4 py-3 bg-[#3C3F41]">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xs sm:text-sm font-semibold text-[#A9B7C6]">
                    Write a welcome program which prints to console
                  </h2>
                </div>
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex-shrink-0 flex items-center gap-1.5 bg-[#365880] hover:bg-[#4A6B8C] disabled:bg-[#45494A] disabled:cursor-not-allowed text-white px-4 py-2 rounded text-xs font-medium transition-all border border-[#466D94]"
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
                ? 'w-full cursor-ns-resize hover:bg-[#515151]'
                : 'h-full cursor-ew-resize hover:bg-[#515151]'
            } ${isResizing ? 'bg-[#515151]' : ''}`}
            style={{
              [layoutMode === 'bottom' ? 'height' : 'width']: '4px',
              backgroundColor: isResizing ? undefined : '#323232'
            }}
            onMouseDown={handleMouseDown}
          >
          </div>
        )}

        <div
          className={`bg-[#313335] border border-[#323232] ${isMobile ? 'border-t' : ''}`}
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
      </div>

      <footer className="border-t border-[#323232] bg-[#3C3F41] px-2 sm:px-4 py-2">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#CC7832]" />
            <span className="text-[10px] sm:text-xs font-medium text-[#808080]">Developed By</span>
            <span className="font-semibold text-[10px] sm:text-xs text-[#A9B7C6]">
              Om Prakash Peddamadthala
            </span>
            <Code2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#6897BB]" />
            <Heart className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#BC3F3C] fill-[#BC3F3C]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[#515151]">•</span>
            <span className="text-[10px] sm:text-xs font-medium text-[#808080]">© 2024 All Rights Reserved</span>
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
