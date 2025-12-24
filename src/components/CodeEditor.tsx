import Editor from '@monaco-editor/react';
import { Loader2, Play, Eye, AlignLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { JavaProblem } from '../types/problem.types';
import { formatJavaCode } from '../utils/javaFormatter';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  currentProblem?: JavaProblem | null;
  isRunning?: boolean;
  onShowSolution?: () => void;
  showFullSolution?: boolean;
}

type TabType = 'problem' | 'code' | 'solution';

export function CodeEditor({ value, onChange, onRun, currentProblem, isRunning, onShowSolution, showFullSolution }: CodeEditorProps) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [editorOptions, setEditorOptions] = useState(() => getEditorOptions());
  const [activeTab, setActiveTab] = useState<TabType>('code');
  const editorRef = useRef<any>(null);

  function getEditorOptions() {
    const width = window.innerWidth;
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;

    return {
      fontSize: isMobile ? 9 : isTablet ? 13 : 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
      fontLigatures: true,
      minimap: { enabled: width >= 1024 },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 4,
      wordWrap: 'on' as const,
      lineNumbers: 'on' as const,
      renderLineHighlight: 'all' as const,
      smoothScrolling: true,
      cursorBlinking: 'smooth' as const,
      cursorSmoothCaretAnimation: 'on' as const,
      padding: {
        top: isMobile ? 4 : isTablet ? 10 : 16,
        bottom: isMobile ? 4 : isTablet ? 10 : 16
      },
      lineHeight: isMobile ? 16 : isTablet ? 20 : 22,
      scrollbar: {
        vertical: 'auto' as const,
        horizontal: 'auto' as const,
        verticalScrollbarSize: isMobile ? 6 : 12,
        horizontalScrollbarSize: isMobile ? 6 : 12,
      },
      overviewRulerLanes: width >= 768 ? 2 : 0,
      hideCursorInOverviewRuler: isMobile,
      contextmenu: !isMobile,
      quickSuggestions: !isMobile,
      suggestOnTriggerCharacters: !isMobile,
      acceptSuggestionOnEnter: isMobile ? 'off' as const : 'on' as const,
      folding: width >= 768,
      foldingHighlight: width >= 768,
      renderIndentGuides: width >= 768,
      glyphMargin: width >= 768,
    };
  }

  useEffect(() => {
    const handleResize = () => {
      setEditorOptions(getEditorOptions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
    const monacoInstance = (window as any).monaco;
    if (monacoInstance) {
      editor.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Enter, () => {
        onRun();
      });
    }

    editor.focus();
  };

  const handleFormatCode = () => {
    if (editorRef.current) {
      const currentCode = editorRef.current.getValue();
      const formattedCode = formatJavaCode(currentCode);
      editorRef.current.setValue(formattedCode);
    }
  };

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between border-b border-[#323232] bg-[#1e1e1e]">
        {currentProblem ? (
          <div className="flex">
            <button
              onClick={() => setActiveTab('problem')}
              className={`px-4 py-2 text-xs font-medium transition-colors ${
                activeTab === 'problem'
                  ? 'text-[#FFFFFF] border-b-2 border-[#6897BB] bg-[#2B2B2B]'
                  : 'text-[#808080] hover:text-[#BBBBBB] hover:bg-[#2a2d2e]'
              }`}
            >
              Problem
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 text-xs font-medium transition-colors ${
                activeTab === 'code'
                  ? 'text-[#FFFFFF] border-b-2 border-[#6897BB] bg-[#2B2B2B]'
                  : 'text-[#808080] hover:text-[#BBBBBB] hover:bg-[#2a2d2e]'
              }`}
            >
              Code
            </button>
            <button
              onClick={() => {
                if (!user) {
                  setActiveTab('solution');
                } else {
                  setActiveTab('solution');
                }
              }}
              className={`px-4 py-2 text-xs font-medium transition-colors ${
                activeTab === 'solution'
                  ? 'text-[#FFFFFF] border-b-2 border-[#6897BB] bg-[#2B2B2B]'
                  : 'text-[#808080] hover:text-[#BBBBBB] hover:bg-[#2a2d2e]'
              }`}
            >
              Solution
            </button>
          </div>
        ) : (
          <div className="px-4 py-2 text-sm font-medium text-[#A9B7C6]">
            Interview Mode - Write your code below
          </div>
        )}
        <div className="flex items-center gap-2 px-3">
          {currentProblem && onShowSolution && (
            <button
              onClick={onShowSolution}
              disabled={showFullSolution}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all ${
                showFullSolution
                  ? 'bg-[#45494A] text-[#808080] cursor-not-allowed'
                  : 'bg-[#2a2d2e] hover:bg-[#3a3d3e] text-[#BBBBBB] border border-[#6B6B6B]'
              }`}
              title="Show complete solution"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Show Solution</span>
            </button>
          )}
          <button
            onClick={handleFormatCode}
            className="flex items-center gap-1.5 bg-[#2a2d2e] hover:bg-[#3a3d3e] text-[#BBBBBB] px-3 py-1.5 rounded text-xs font-medium transition-all border border-[#6B6B6B]"
            title="Format code"
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Format</span>
          </button>
          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 bg-[#365880] hover:bg-[#4A6B8C] disabled:bg-[#45494A] disabled:cursor-not-allowed text-white px-4 py-1.5 rounded text-xs font-medium transition-all border border-[#466D94]"
          >
            <Play className="w-3.5 h-3.5" fill="currentColor" />
            <span>{isRunning ? 'Running...' : 'Run'}</span>
          </button>
        </div>
      </div>

      {currentProblem && activeTab === 'problem' && (
        <div className="flex-1 overflow-auto bg-[#2B2B2B] p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {currentProblem ? (
              <>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[#808080] text-sm font-medium">Problem #{currentProblem.number}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                      currentProblem.difficulty === 'basic'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : currentProblem.difficulty === 'intermediate'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : currentProblem.difficulty === 'advanced'
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {currentProblem.difficulty}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-[#FFFFFF] mb-4">{currentProblem.title}</h1>
                </div>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-[#FFFFFF] mb-3 flex items-center gap-2">
                      <span className="w-1 h-5 bg-blue-500 rounded"></span>
                      Sample Input
                    </h2>
                    <div className="bg-[#1e1e1e] rounded-lg p-4 border border-[#323232]">
                      <pre className="text-[#CCCCCC] font-mono text-sm whitespace-pre-wrap break-words overflow-x-auto">{currentProblem.input}</pre>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-[#FFFFFF] mb-3 flex items-center gap-2">
                      <span className="w-1 h-5 bg-green-500 rounded"></span>
                      Expected Output
                    </h2>
                    <div className="bg-[#1e1e1e] rounded-lg p-4 border border-[#323232]">
                      <pre className="text-[#CCCCCC] font-mono text-sm whitespace-pre-wrap break-words overflow-x-auto">{currentProblem.output}</pre>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-green-500/20 text-green-400 border border-green-500/30`}>
                    BASIC
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-[#FFFFFF] mb-4">Welcome Program</h1>
                <p className="text-[#CCCCCC] mb-6">Write a Java program that prints a welcome message to the console.</p>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-[#FFFFFF] mb-3 flex items-center gap-2">
                      <span className="w-1 h-5 bg-green-500 rounded"></span>
                      Expected Output
                    </h2>
                    <div className="bg-[#1e1e1e] rounded-lg p-4 border border-[#323232]">
                      <pre className="text-[#CCCCCC] font-mono text-sm">Welcome to JavaCodingPractice.com!</pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {(activeTab === 'code' || !currentProblem) && (
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            width="100%"
            defaultLanguage="java"
            value={value}
            onChange={handleEditorChange}
            onMount={handleEditorMount}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            options={editorOptions}
            loading={
              <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-primary)' }} />
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading Editor...</p>
                </div>
              </div>
            }
          />
        </div>
      )}

      {currentProblem && activeTab === 'solution' && (
        <div className="flex-1 overflow-auto bg-[#2B2B2B]">
          {!user ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center px-4 py-6">
                <p className="text-lg font-semibold text-[#FFFFFF] mb-2">Please login</p>
                <p className="text-sm text-[#808080]">Sign in to view the solution</p>
              </div>
            </div>
          ) : currentProblem ? (
            <div className="h-full">
              <Editor
                height="100%"
                width="100%"
                defaultLanguage="java"
                value={currentProblem.solution}
                options={{
                  ...editorOptions,
                  readOnly: true,
                }}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                loading={
                  <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-primary)' }} />
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading Solution...</p>
                    </div>
                  </div>
                }
              />
            </div>
          ) : (
            <div className="h-full">
              <Editor
                height="100%"
                width="100%"
                defaultLanguage="java"
                value={`public class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to JavaCodingPractice.com!");
    }
}`}
                options={{
                  ...editorOptions,
                  readOnly: true,
                }}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                loading={
                  <div className="h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent-primary)' }} />
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading Solution...</p>
                    </div>
                  </div>
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
