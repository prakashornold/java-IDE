import { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { OutputPanel } from './components/OutputPanel';
import { ProblemSidebar } from './components/ProblemSidebar';
import { AdminPanel } from './components/AdminPanel';
import { NotesPage } from './components/NotesPage';
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
import { Loader2, Code2 } from 'lucide-react';

type LayoutMode = 'bottom' | 'side';

function App() {
  const { problemService, compilerService } = useServices();

  const getInitialPage = (): typeof navigation.currentPage => {
    const path = window.location.pathname;
    if (path === '/admin') return 'admin';
    if (path === '/notes') return 'notes';
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
          const practiceCode = problemService.extractPracticeCode(problem.solution || '');
          setCode(practiceCode);
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

  /**
   * Handles problem selection from sidebar
   * Updates URL with problem slug for sharing
   */
  const handleSelectProblem = (problem: JavaProblem) => {
    setCurrentProblem(problem);
    const practiceCode = problemService.extractPracticeCode(problem.solution || '');
    setCode(practiceCode);
    setStdin('');
    setOutput('');
    setHasError(false);

    // Update URL with problem slug
    problemLinkService.updateUrlWithProblem(problem.title);

    // Ensure sidebar is open when a problem is selected (except on mobile)
    if (!isMobile) {
      setIsSidebarOpen(true);
    }

    if (navigation.currentPage !== 'home') {
      navigation.navigateToHome();
    }
  };

  const handleShowSolution = () => {
    if (!currentProblem || !currentProblem.solution) return;
    setCode(currentProblem.solution);
    setStdin('');
    setOutput('');
    setHasError(false);
  };

  if (isInitialLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#2B2B2B]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#6897BB] to-[#CC7832] rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-[#1e1e1e] p-6 rounded-2xl border-2 border-[#6897BB]">
              <Code2 className="w-16 h-16 text-[#6897BB]" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-2xl font-bold text-[#FFFFFF]">JavaCodingPractice.com</h1>
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-[#6897BB]" />
              <p className="text-sm text-[#A9B7C6] font-medium">Loading IDE...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (navigation.currentPage === 'admin') {
    return <AdminPanel onNavigateHome={navigation.navigateToHome} />;
  }

  if (navigation.currentPage === 'notes') {
    return <NotesPage onNavigateHome={navigation.navigateToHome} />;
  }

  if (navigation.currentPage === 'udemint') {
    return <RedirectPage redirectKey="udemint" />;
  }

  if (navigation.currentPage === 'freeai') {
    return <RedirectPage redirectKey="freeai" />;
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
        onNavigateToAdmin={navigation.navigateToAdmin}
        onNavigateToNotes={navigation.navigateToNotes}
      />

      <div className="flex-1 flex overflow-hidden">
        {isSidebarOpen && cachedProblems && (
          <div style={{ width: '20%' }}>
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
                onShowAuthModal={() => setShowAuthModal(true)}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
              />
            </div>
          </div>

          {!isMobile && (
            <div
              className={`relative ${layoutMode === 'bottom'
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
