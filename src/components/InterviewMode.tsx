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
      className="h-screen flex flex-col overflow-hidden"
      style={{ background: '#2B2B2B' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <header className="border-b border-[#323232] bg-[#1e1e1e]">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-[#365880] rounded">
              <Terminal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-xs xs:text-sm sm:text-base md:text-lg font-semibold text-[#A9B7C6] flex items-center gap-2">
              <span>JavaCodingPractice.com - Interview Mode</span>
              {user && (
                <>
                  <span className="hidden sm:inline">-</span>
                  <span className="flex items-center gap-1.5 text-[#BBBBBB]">
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
                className="flex items-center gap-1.5 text-sm font-medium text-[#BBBBBB] hover:text-[#FFFFFF] hover:bg-[#2a2d2e] px-3 py-1.5 rounded transition-all"
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
          className="relative overflow-hidden flex flex-col bg-[#1e1e1e] border border-[#323232]"
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
              showFullSolution={false}
            />
          </div>
        </div>

        <div
          className="relative h-full cursor-ew-resize hover:bg-[#515151]"
          style={{
            width: '4px',
            backgroundColor: isResizing ? '#515151' : '#323232'
          }}
          onMouseDown={handleMouseDown}
        />

        <div
          className="bg-[#1e1e1e] border border-[#323232]"
          style={{ width: `${outputSize}%` }}
        >
          <OutputPanel
            output={output}
            isRunning={isRunning}
            hasError={hasError}
            layoutMode={layoutMode}
            onToggleLayout={() => {}}
            isMobile={false}
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
