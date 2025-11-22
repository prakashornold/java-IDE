import { useState, useRef, useEffect } from 'react';
import { Sparkles, Code2, Heart } from 'lucide-react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { OutputPanel } from './components/OutputPanel';
import { runJavaCode } from './services/compilerService';
import { getRandomProblem, type JavaProblem } from './services/problemService';
import { DEFAULT_JAVA_CODE } from './constants/defaultCode';

type LayoutMode = 'bottom' | 'side';

function App() {
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

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('');
    setHasError(false);

    try {
      const result = await runJavaCode(code);

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
      const problem = await getRandomProblem();
      if (problem) {
        setCurrentProblem(problem);
        setCode(problem.solution);
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

  return (
    <div
      className="h-screen flex flex-col bg-[#1e1e1e] overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Header
        onRun={handleRunCode}
        isRunning={isRunning}
        onRandomProblem={handleRandomProblem}
        isLoadingProblem={isLoadingProblem}
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
            <div className="bg-gradient-to-r from-[#161b22] via-[#0d1117] to-[#161b22] border-b border-gray-800 px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex items-start gap-2">
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
                  <h2 className="text-xs sm:text-sm font-semibold text-white truncate">
                    #{currentProblem.number}: {currentProblem.title}
                  </h2>
                  {currentProblem.input && (
                    <pre className="text-[10px] sm:text-xs text-gray-400 mt-1 whitespace-pre-wrap">{currentProblem.input}</pre>
                  )}
                </div>
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

      <footer className="border-t border-gray-800 bg-gradient-to-r from-[#161b22] via-[#0d1117] to-[#161b22] px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-xs">
          <div className="flex items-center gap-1 sm:gap-2">
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-yellow-400" />
            <span className="text-gray-400 text-[10px] sm:text-xs">Developed By</span>
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00D4AA] to-[#00A8E8] text-[10px] sm:text-xs">
              Om Prakash Peddamadthala
            </span>
            <Code2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#00D4AA]" />
            <Heart className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-red-500 fill-red-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-gray-500 hidden sm:inline">|</span>
            <span className="text-gray-500 text-[10px] sm:text-xs">© 2024 All Rights Reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
