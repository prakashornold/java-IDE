import { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { OutputPanel } from './components/OutputPanel';
import { ProblemSidebar } from './components/ProblemSidebar';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';
import { AccountSettings } from './components/AccountSettings';
import { AuthModal } from './components/AuthModal';
import { About } from './components/About';
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
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard' | 'admin' | 'account-settings' | 'about'>('home');
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
    } catch {
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
    } catch {
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

  const handleNavigateToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const handleNavigateHome = () => {
    setCurrentPage('home');
  };

  const handleNavigateToAdmin = () => {
    setCurrentPage('admin');
  };

  const handleNavigateToAccountSettings = () => {
    setCurrentPage('account-settings');
  };

  const handleNavigateToAbout = () => {
    setCurrentPage('about');
  };

  if (currentPage === 'about') {
    return <About onNavigateHome={handleNavigateHome} />;
  }

  if (currentPage === 'admin') {
    return <AdminPanel onNavigateHome={handleNavigateHome} />;
  }

  if (currentPage === 'account-settings') {
    return <AccountSettings onNavigateHome={handleNavigateHome} />;
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
        onNavigateToDashboard={handleNavigateToDashboard}
        onNavigateToAdmin={handleNavigateToAdmin}
        onNavigateToAccountSettings={handleNavigateToAccountSettings}
        onNavigateToAbout={handleNavigateToAbout}
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
          className="relative overflow-hidden flex flex-col bg-[#1e1e1e] border border-[#323232]"
          style={{
            [layoutMode === 'bottom' || isMobile ? 'height' : 'width']: isMobile ? '50%' : `${100 - outputSize}%`
          }}
        >
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              value={code}
              onChange={setCode}
              onRun={handleRunCode}
              currentProblem={currentProblem}
              isRunning={isRunning}
              onShowSolution={handleShowSolution}
              showFullSolution={showFullSolution}
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
          className={`bg-[#1e1e1e] border border-[#323232] ${isMobile ? 'border-t' : ''}`}
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

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

export default App;
