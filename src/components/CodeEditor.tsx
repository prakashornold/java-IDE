import Editor from '@monaco-editor/react';
import { Loader2, Play, Eye, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { JavaProblem, hasContent } from '../types/problem.types';
import { codeSkeletonGenerator } from '../services/CodeSkeletonGenerator';
import { ShareButton } from './ShareButton';
import { renderMarkdown } from '../utils/markdownUtils';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  currentProblem?: JavaProblem | null;
  isRunning?: boolean;
  onShowSolution?: () => void;
  onShowAuthModal?: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

type TabType = 'problem' | 'hints' | 'code';

/**
 * Code Editor Component
 * Main coding interface with skeleton code and solution toggle
 * Follows clean code principles and SOLID design patterns
 */
export function CodeEditor({ value, onChange, onRun, currentProblem, isRunning, onShowSolution, onShowAuthModal, onToggleSidebar, isSidebarOpen }: CodeEditorProps) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [editorOptions, setEditorOptions] = useState(() => getEditorOptions());
  const [activeTab, setActiveTab] = useState<TabType>('problem'); // Default to Problem tab
  const [isShowingSolution, setIsShowingSolution] = useState(false);
  const [skeletonCode, setSkeletonCode] = useState<string>('');
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

  /**
   * Initialize skeleton code when problem changes
   * Also switch to Problem tab to show problem description
   */
  useEffect(() => {
    if (currentProblem) {
      const solutionCode = currentProblem.solution_code || currentProblem.solution || currentProblem.starter_code || '';
      const skeleton = codeSkeletonGenerator.generateSkeleton(solutionCode);
      setSkeletonCode(skeleton);
      setIsShowingSolution(false);

      // Set skeleton code as initial editor value
      if (!isShowingSolution) {
        onChange(skeleton);
      }

      // Switch to Problem tab when a new problem is selected
      setActiveTab('problem');
    }
  }, [currentProblem]);

  /**
   * Handles showing/hiding the full solution
   * Shows auth modal if user not authenticated
   */
  const handleToggleSolution = () => {
    if (!user && onShowAuthModal) {
      onShowAuthModal();
      return;
    }

    if (!isShowingSolution) {
      const fullSolution = currentProblem?.solution_code || currentProblem?.solution || '';
      onChange(fullSolution);
      setIsShowingSolution(true);
      if (onShowSolution) {
        onShowSolution();
      }
    } else {
      onChange(skeletonCode);
      setIsShowingSolution(false);
    }
  };

  /**
   * Handles run button click
   * Shows auth modal if user not authenticated
   */
  const handleRunClick = () => {
    if (!user && onShowAuthModal) {
      onShowAuthModal();
      return;
    }
    onRun();
  };

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

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between border-b border-[#323232] bg-[#1e1e1e]">
        {currentProblem ? (
          <div className="flex items-center">
            {/* Sidebar toggle button */}
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="flex items-center gap-1.5 text-sm font-medium text-[#BBBBBB] hover:text-[#FFFFFF] hover:bg-[#2a2d2e] px-3 py-2 transition-all border-r border-[#323232]"
                title={isSidebarOpen ? 'Hide problems sidebar' : 'Show problems sidebar'}
              >
                {isSidebarOpen ? (
                  <PanelLeftClose className="w-4 h-4" />
                ) : (
                  <PanelLeft className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Problems</span>
              </button>
            )}

            {/* Always show all tabs */}
            <button
              onClick={() => setActiveTab('problem')}
              className={`px-4 py-2 text-xs font-medium transition-colors ${activeTab === 'problem'
                ? 'text-[#FFFFFF] border-b-2 border-[#6897BB] bg-[#2B2B2B]'
                : 'text-[#808080] hover:text-[#BBBBBB] hover:bg-[#2a2d2e]'
                }`}
            >
              Problem
            </button>
            <button
              onClick={() => setActiveTab('hints')}
              className={`px-4 py-2 text-xs font-medium transition-colors ${activeTab === 'hints'
                ? 'text-[#FFFFFF] border-b-2 border-[#6897BB] bg-[#2B2B2B]'
                : 'text-[#808080] hover:text-[#BBBBBB] hover:bg-[#2a2d2e]'
                }`}
            >
              Hints
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 text-xs font-medium transition-colors ${activeTab === 'code'
                ? 'text-[#FFFFFF] border-b-2 border-[#6897BB] bg-[#2B2B2B]'
                : 'text-[#808080] hover:text-[#BBBBBB] hover:bg-[#2a2d2e]'
                }`}
            >
              Code
            </button>
          </div>
        ) : (
          <div className="px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {onToggleSidebar && (
                <button
                  onClick={onToggleSidebar}
                  className="flex items-center gap-1.5 text-sm font-medium text-[#BBBBBB] hover:text-[#FFFFFF] hover:bg-[#2a2d2e] px-2 py-1 rounded transition-all"
                  title={isSidebarOpen ? 'Hide problems sidebar' : 'Show problems sidebar'}
                >
                  {isSidebarOpen ? (
                    <PanelLeftClose className="w-4 h-4" />
                  ) : (
                    <PanelLeft className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Problems</span>
                </button>
              )}
              <span className="text-sm font-medium text-[#A9B7C6]">Code Editor</span>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 px-3">
          {/* Show buttons on Code tab or when no problem is selected (home page) */}
          {(activeTab === 'code' || !currentProblem) && (
            <>
              {/* Share Button - Always visible */}
              {currentProblem && (
                <ShareButton problemTitle={currentProblem.title} />
              )}

              {/* Show Solution - Clickable for all, prompts login if not authenticated */}
              {currentProblem && !isShowingSolution && (
                <button
                  onClick={handleToggleSolution}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all bg-[#2a2d2e] hover:bg-[#3a3d3e] text-[#BBBBBB] border border-[#6B6B6B]"
                  title={!user ? 'Click to login and view solution' : 'Show complete solution'}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Show Solution</span>
                </button>
              )}
              {currentProblem && isShowingSolution && (
                <button
                  onClick={handleToggleSolution}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all bg-[#3a3d3e] text-[#808080] border border-[#6B6B6B]"
                  title="Hide solution and return to skeleton code"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Hide Solution</span>
                </button>
              )}

              {/* Run Button - Clickable for all, prompts login if not authenticated */}
              <button
                onClick={handleRunClick}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-medium transition-all bg-[#365880] hover:bg-[#4A6B8C] disabled:bg-[#45494A] disabled:cursor-not-allowed text-white border border-[#466D94]"
                title={
                  !user
                    ? 'Click to login and run code'
                    : isRunning
                      ? 'Running...'
                      : 'Run code (Ctrl+Enter)'
                }
              >
                <Play className="w-3.5 h-3.5" fill="currentColor" />
                <span>{isRunning ? 'Running...' : 'Run'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {currentProblem && activeTab === 'problem' && (
        <div className="flex-1 overflow-auto bg-[#2B2B2B] p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[#808080] text-sm font-medium">Problem #{currentProblem.number}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${currentProblem.difficulty === 'basic'
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

            {/* Description - Only show if present */}
            {hasContent(currentProblem.description) && (
              <div>
                <h2 className="text-lg font-semibold text-[#FFFFFF] mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-purple-500 rounded"></span>
                  Description
                </h2>
                <div className="bg-[#1e1e1e] rounded-lg p-4 border border-[#323232]">
                  <div className="markdown-content">
                    {renderMarkdown(currentProblem.description || '')}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Sample Input - Only show if present */}
              {hasContent(currentProblem.input) && (
                <div>
                  <h2 className="text-lg font-semibold text-[#FFFFFF] mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-blue-500 rounded"></span>
                    Sample Input
                  </h2>
                  <div className="bg-[#1e1e1e] rounded-lg p-4 border border-[#323232]">
                    <pre className="text-[#CCCCCC] font-mono text-sm whitespace-pre-wrap break-words overflow-x-auto">{currentProblem.input}</pre>
                  </div>
                </div>
              )}

              {/* Expected Output - Only show if present */}
              {hasContent(currentProblem.output) && (
                <div>
                  <h2 className="text-lg font-semibold text-[#FFFFFF] mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-green-500 rounded"></span>
                    Expected Output
                  </h2>
                  <div className="bg-[#1e1e1e] rounded-lg p-4 border border-[#323232]">
                    <pre className="text-[#CCCCCC] font-mono text-sm whitespace-pre-wrap break-words overflow-x-auto">{currentProblem.output}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {currentProblem && activeTab === 'hints' && (
        <div className="flex-1 overflow-auto bg-[#2B2B2B] p-6">
          {!user ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center px-4 py-6">
                <p className="text-lg font-semibold text-[#FFFFFF] mb-2">Please login</p>
                <p className="text-sm text-[#808080]">Sign in to view hints</p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              <h2 className="text-xl font-bold text-[#FFFFFF] mb-4">Hints</h2>

              {hasContent(currentProblem.hints) ? (
                <div className="bg-[#1e1e1e] rounded-lg p-5 border border-[#323232]">
                  <div className="markdown-content">
                    {renderMarkdown(currentProblem.hints!)}
                  </div>
                </div>
              ) : (
                <div className="bg-[#1e1e1e] rounded-lg p-5 border border-[#323232]">
                  <p className="text-sm text-[#CCCCCC]">
                    No specific hints available for this problem. Try breaking down the problem into smaller steps.
                  </p>
                </div>
              )}
            </div>
          )}
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
    </div>
  );
}
