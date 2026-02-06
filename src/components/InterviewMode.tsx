import { useState, useRef } from 'react';
import { CodeEditor } from './CodeEditor';
import { OutputPanel } from './OutputPanel';
import { Footer } from './Footer';
import { useServices } from '../context/ServiceContext';
import { INTERVIEW_MODE_CODE } from '../constants/defaultCode';
import { useExecutionLimit } from '../hooks/useExecutionLimit';
import { errorHandlingService } from '../services/ErrorHandlingService';
import { Terminal, Home, User } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { useAuth } from '../context/AuthContext';

type LayoutMode = 'bottom' | 'side';

interface InterviewModeProps {
  onNavigateHome?: () => void;
}

export function InterviewMode({ onNavigateHome }: InterviewModeProps) {
  const { compilerService } = useServices();
  const executionLimit = useExecutionLimit();
  const { user, profile } = useAuth();
  const [code, setCode] = useState(INTERVIEW_MODE_CODE);
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [layoutMode] = useState<LayoutMode>('side');
  const [outputSize, setOutputSize] = useState(26.67);
  const [isResizing, setIsResizing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const userName = user?.user_metadata?.full_name ||
                   (profile?.first_name && profile?.last_name
                     ? `${profile.first_name} ${profile.last_name}`
                     : profile?.first_name || profile?.last_name || 'User');

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
    const newWidth = ((rect.right - e.clientX) / rect.width) * 100;
    setOutputSize(Math.max(20, Math.min(70, newWidth)));
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden bg-[#1a1b22]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <header className="relative border-b border-[#282934] bg-[#1a1b22]">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#5294d0]/20 to-transparent" />
        <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-[#4080b5] to-[#2a5580] rounded-lg flex-shrink-0 shadow-lg shadow-[#3a6d9e]/15">
              <Terminal className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-xs xs:text-sm sm:text-base md:text-lg font-bold text-[#e8eaed] tracking-tight flex items-center gap-2">
              <span>JavaCodingPractice.com - Interview Mode</span>
              {user && (
                <>
                  <span className="hidden sm:inline text-[#383946]">-</span>
                  <span className="flex items-center gap-1.5 text-[#5294d0] font-medium">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{userName}</span>
                    <span className="sm:hidden">{userName.split(' ')[0]}</span>
                  </span>
                </>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="flex items-center gap-1.5 text-xs font-medium text-[#848996] hover:text-[#c8ccd4] hover:bg-[#25262f] px-3 py-2 rounded-lg transition-all"
                title="Home"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div
        ref={containerRef}
        className="flex-1 flex overflow-hidden"
      >
        <div
          className="relative overflow-hidden flex flex-col bg-[#1a1b22]"
          style={{ width: `${100 - outputSize}%` }}
        >
          <div className="flex-1 overflow-hidden">
            <CodeEditor
              value={code}
              onChange={setCode}
              onRun={handleRunCode}
              currentProblem={null}
              isRunning={isRunning}
              onShowSolution={() => {}}
            />
          </div>
        </div>

        <div
          className={`resize-handle h-full cursor-ew-resize ${isResizing ? 'active' : ''}`}
          style={{ width: '4px' }}
          onMouseDown={handleMouseDown}
        />

        <div
          className="bg-[#1a1b22]"
          style={{ width: `${outputSize}%` }}
        >
          <OutputPanel
            output={output}
            isRunning={isRunning}
            hasError={hasError}
            layoutMode={layoutMode}
            onToggleLayout={() => {}}
            isMobile={false}
            stdin={stdin}
            onStdinChange={setStdin}
          />
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
