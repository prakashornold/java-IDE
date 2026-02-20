import { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { OutputPanel } from './components/OutputPanel';
import { ProblemSidebar } from './components/ProblemSidebar';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { RedirectPage } from './components/RedirectPage';
import { useServices } from './context/ServiceContext';
import { JavaProblem } from './types/problem.types';
import { DEFAULT_JAVA_CODE } from './constants/defaultCode';
import { useNavigation } from './hooks/useNavigation';
import { useExecutionLimit } from './hooks/useExecutionLimit';
import { errorHandlingService } from './services/ErrorHandlingService';
import { problemLinkService } from './services/ProblemLinkService';
import { metaTagService } from './services/MetaTagService';
import { Loader2, Terminal } from 'lucide-react';

type LayoutMode = 'bottom' | 'side';

function App() {
  const { problemService, compilerService } = useServices();

  const getInitialPage = (): typeof navigation.currentPage => {
    const path = window.location.pathname;
    if (path === '/admin') return 'admin';
    if (path === '/udemint') return 'udemint';
    if (path === '/freeai') return 'freeai';
    return 'home';
  };

  const navigation = useNavigation(getInitialPage());
  const executionLimit = useExecutionLimit();
  const [code, setCode] = useState(DEFAULT_JAVA_CODE);
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('side');
  const [isMobile, setIsMobile] = useState(false);
  const [outputSize, setOutputSize] = useState(26.67);
  const [isResizing, setIsResizing] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<JavaProblem | null>(null);
  const [cachedProblems, setCachedProblems] = useState<JavaProblem[] | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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

  /**
   * Load problem from URL parameter on initial page load
   * This enables deep linking to specific problems
   */
  useEffect(() => {
    const loadProblemFromUrl = async () => {
      const problemSlug = problemLinkService.getProblemSlugFromUrl();
      if (problemSlug && cachedProblems) {
        const titlePattern = problemLinkService.slugToTitlePattern(problemSlug);
        const problem = cachedProblems.find(
          p => p.title.toLowerCase().includes(titlePattern)
        );

        if (problem) {
          setCurrentProblem(problem);
          setCode(problem.starter_code || '');
          setStdin(problem.input || '');
        }
      }
    };

    loadProblemFromUrl();
  }, [cachedProblems, problemService]);

  /**
   * Update meta tags when current problem changes
   */
  useEffect(() => {
    if (currentProblem) {
      metaTagService.updateProblemMetaTags(currentProblem);
    } else {
      metaTagService.resetToDefaults();
    }
  }, [currentProblem]);

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
    if (!executionLimit.canExecute) {
      setShowAuthModal(true);
      return;
    }

    setIsRunning(true);
    setOutput('');
    setHasError(false);

    try {
      const result = await compilerService.execute(code, stdin);

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

      executionLimit.incrementCount();
    } catch (error) {
      const errorMessage = errorHandlingService.handleError(error);
      setOutput(errorMessage || 'Unexpected error occurred while running code');
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

    if (layoutMode === 'bottom' || isMobile) {
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

  /**
   * Handles problem selection from sidebar
   * Updates URL with problem slug for sharing
   */
  const handleSelectProblem = (problem: JavaProblem) => {
    setCurrentProblem(problem);
    setCode(problem.starter_code || '');
    setStdin(problem.input || '');
    setOutput('');
    setHasError(false);

    problemLinkService.updateUrlWithProblem(problem.title);

    if (!isMobile) {
      setIsSidebarOpen(true);
    }

    if (navigation.currentPage !== 'home') {
      navigation.navigateToHome();
    }
  };

  const handleShowSolution = () => {
    if (!currentProblem || !currentProblem.solution_code) return;
    setCode(currentProblem.solution_code);
    setStdin(currentProblem.input || '');
    setOutput('');
    setHasError(false);
  };

  if (isInitialLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#13141a]">
        <div className="flex flex-col items-center gap-8 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-[#5294d0]/10 rounded-2xl blur-3xl scale-150 animate-pulse" />
            <div className="relative bg-gradient-to-br from-[#4080b5] to-[#2a5580] p-5 rounded-2xl shadow-2xl shadow-[#5294d0]/15">
              <Terminal className="w-12 h-12 text-white" strokeWidth={1.5} />
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold text-[#f1f3f5] tracking-tight">JavaCodingPractice.com</h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Loader2 className="w-4 h-4 animate-spin text-[#5294d0]" />
              </div>
              <p className="text-sm text-[#9ba1ad] font-medium">Initializing IDE...</p>
            </div>
            <div className="w-48 h-1 bg-[#1e1f26] rounded-full overflow-hidden mt-1">
              <div className="h-full bg-gradient-to-r from-[#3a6d9e] to-[#5294d0] rounded-full" style={{ animation: 'progressPulse 2s ease-in-out' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (navigation.currentPage === 'admin') {
    return <AdminPanel onNavigateHome={navigation.navigateToHome} />;
  }

  if (navigation.currentPage === 'udemint') {
    return <RedirectPage redirectKey="udemint" />;
  }

  if (navigation.currentPage === 'freeai') {
    return <RedirectPage redirectKey="freeai" />;
  }

  return (
    <div
      className="h-screen flex flex-col overflow-hidden bg-[#1a1b22]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Header
        onNavigateToAdmin={navigation.navigateToAdmin}
      />

      <div className="flex-1 flex overflow-hidden">
        {isSidebarOpen && cachedProblems && (
          <div className="border-r border-[#282934]" style={{ width: '20%' }}>
            <ProblemSidebar
              problems={cachedProblems}
              onSelectProblem={handleSelectProblem}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              currentProblemId={currentProblem?.id}
              isMobile={isMobile}
            />
          </div>
        )}

        <div
          ref={containerRef}
          className={`flex overflow-hidden ${layoutMode === 'bottom' || isMobile ? 'flex-col' : 'flex-row'}`}
          style={{ width: isSidebarOpen && !isMobile ? '80%' : '100%' }}
        >
          <div
            className="relative overflow-hidden flex flex-col bg-[#1a1b22]"
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
                onShowAuthModal={() => setShowAuthModal(true)}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
              />
            </div>
          </div>

          {!isMobile && (
            <div
              className={`resize-handle ${layoutMode === 'bottom'
                ? 'w-full cursor-ns-resize'
                : 'h-full cursor-ew-resize'
                } ${isResizing ? 'active' : ''}`}
              style={{
                [layoutMode === 'bottom' ? 'height' : 'width']: '4px',
              }}
              onMouseDown={handleMouseDown}
            >
            </div>
          )}

          <div
            className={`bg-[#1a1b22] ${isMobile ? 'border-t border-[#282934]' : ''}`}
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
              stdin={stdin}
              onStdinChange={setStdin}
            />
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      <Footer />
    </div>
  );
}

export default App;
