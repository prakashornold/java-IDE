import { useState, useRef } from 'react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { OutputPanel } from './components/OutputPanel';
import { runJavaCode } from './services/compilerService';
import { DEFAULT_JAVA_CODE } from './constants/defaultCode';

type LayoutMode = 'bottom' | 'side';

function App() {
  const [code, setCode] = useState(DEFAULT_JAVA_CODE);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('bottom');
  const [outputSize, setOutputSize] = useState(40);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    setLayoutMode(prev => prev === 'bottom' ? 'side' : 'bottom');
  };

  return (
    <div
      className="h-screen flex flex-col bg-[#1e1e1e] overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Header onRun={handleRunCode} isRunning={isRunning} />

      <div
        ref={containerRef}
        className={`flex-1 flex overflow-hidden ${layoutMode === 'bottom' ? 'flex-col' : 'flex-row'}`}
      >
        <div
          className="relative"
          style={{
            [layoutMode === 'bottom' ? 'height' : 'width']: `${100 - outputSize}%`
          }}
        >
          <CodeEditor
            value={code}
            onChange={setCode}
            onRun={handleRunCode}
          />
        </div>

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

        <div
          style={{
            [layoutMode === 'bottom' ? 'height' : 'width']: `${outputSize}%`
          }}
        >
          <OutputPanel
            output={output}
            isRunning={isRunning}
            hasError={hasError}
            layoutMode={layoutMode}
            onToggleLayout={toggleLayout}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
