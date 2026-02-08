import Editor from '@monaco-editor/react';
import { Loader2, Play, Eye, EyeOff, PanelLeftClose, PanelLeft, Lock, FileCode } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { JavaProblem, hasContent } from '../types/problem.types';
import { codeSkeletonGenerator } from '../services/CodeSkeletonGenerator';
import { ShareButton } from './ShareButton';
import { renderMarkdown } from '../utils/markdownUtils';
import { getDifficultyBadgeClass } from '../config/difficultyConfig';

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

export function CodeEditor({ value, onChange, onRun, currentProblem, isRunning, onShowSolution, onShowAuthModal, onToggleSidebar, isSidebarOpen }: CodeEditorProps) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [editorOptions, setEditorOptions] = useState(() => getEditorOptions());
  const [activeTab, setActiveTab] = useState<TabType>('problem');
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

  useEffect(() => {
    if (currentProblem) {
      const solutionCode = currentProblem.solution_code || currentProblem.solution || currentProblem.starter_code || '';
      const skeleton = codeSkeletonGenerator.generateSkeleton(solutionCode);
      setSkeletonCode(skeleton);
      setIsShowingSolution(false);

      if (!isShowingSolution) {
        onChange(skeleton);
      }

      setActiveTab('problem');
    }
  }, [currentProblem]);

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

  const getSectionAccent = (type: 'description' | 'input' | 'output') => {
    switch (type) {
      case 'description': return 'bg-[#5294d0]';
      case 'input': return 'bg-[#cc7832]';
      case 'output': return 'bg-[#6aab73]';
    }
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: 'problem', label: 'Problem' },
    { key: 'hints', label: 'Hints' },
    { key: 'code', label: 'Code' },
  ];

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between border-b border-[#282934] bg-[#1e1f26]">
        {currentProblem ? (
          <div className="flex items-center">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="flex items-center gap-1.5 text-sm font-medium text-[#9ba1ad] hover:text-[#d5d9e0] hover:bg-[#25262f] px-3 py-2.5 transition-all border-r border-[#282934]"
                title={isSidebarOpen ? 'Hide problems sidebar' : 'Show problems sidebar'}
              >
                {isSidebarOpen ? (
                  <PanelLeftClose className="w-4 h-4" />
                ) : (
                  <PanelLeft className="w-4 h-4" />
                )}
              </button>
            )}

            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-2.5 text-xs font-medium transition-all ${activeTab === tab.key
                  ? 'text-[#f1f3f5]'
                  : 'text-[#7d8490] hover:text-[#d5d9e0] hover:bg-[#25262f]'
                  }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#5294d0] rounded-full" />
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {onToggleSidebar && (
                <button
                  onClick={onToggleSidebar}
                  className="flex items-center gap-1.5 text-sm font-medium text-[#9ba1ad] hover:text-[#d5d9e0] hover:bg-[#25262f] px-2 py-1 rounded-md transition-all"
                  title={isSidebarOpen ? 'Hide problems sidebar' : 'Show problems sidebar'}
                >
                  {isSidebarOpen ? (
                    <PanelLeftClose className="w-4 h-4" />
                  ) : (
                    <PanelLeft className="w-4 h-4" />
                  )}
                </button>
              )}
              <div className="flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-[#7d8490]" />
                <span className="text-sm font-semibold text-[#d5d9e0] tracking-tight">Code Editor</span>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 px-3">
          {(activeTab === 'code' || !currentProblem) && (
            <>
              {currentProblem && (
                <ShareButton problemTitle={currentProblem.title} />
              )}

              {currentProblem && !isShowingSolution && (
                <button
                  onClick={handleToggleSolution}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all bg-[#25262f] hover:bg-[#2c2d38] text-[#9ba1ad] hover:text-[#d5d9e0] border border-[#383946]"
                  title={!user ? 'Click to login and view solution' : 'Show complete solution'}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Show Solution</span>
                </button>
              )}
              {currentProblem && isShowingSolution && (
                <button
                  onClick={handleToggleSolution}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all bg-[#5294d0]/10 text-[#5294d0] border border-[#5294d0]/25 hover:bg-[#5294d0]/15"
                  title="Hide solution and return to skeleton code"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Hide Solution</span>
                </button>
              )}

              <button
                onClick={handleRunClick}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold transition-all bg-gradient-to-r from-[#3a6d9e] to-[#2a5580] hover:from-[#4480b3] hover:to-[#336599] disabled:from-[#333440] disabled:to-[#333440] disabled:text-[#7d8490] disabled:cursor-not-allowed text-white shadow-sm shadow-[#3a6d9e]/20"
                title={
                  !user
                    ? 'Click to login and run code'
                    : isRunning
                      ? 'Running...'
                      : 'Run code (Ctrl+Enter)'
                }
              >
                {isRunning ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5" fill="currentColor" />
                )}
                <span>{isRunning ? 'Running...' : 'Run'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {currentProblem && activeTab === 'problem' && (
        <div className="flex-1 overflow-auto bg-[#1a1b22] p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[#7d8490] text-sm font-mono">#{currentProblem.number}</span>
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${getDifficultyBadgeClass(currentProblem.difficulty)}`}>
                  {currentProblem.difficulty}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[#f1f3f5] mb-4 tracking-tight">{currentProblem.title}</h1>
            </div>

            {hasContent(currentProblem.description) && (
              <div>
                <h2 className="text-sm font-semibold text-[#f1f3f5] mb-2.5 flex items-center gap-2 uppercase tracking-wider">
                  <span className={`w-1 h-4 rounded-sm ${getSectionAccent('description')}`}></span>
                  Description
                </h2>
                <div className="bg-[#1e1f26] rounded-lg p-5 border border-[#282934]">
                  <div className="markdown-content">
                    {renderMarkdown(currentProblem.description || '')}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {hasContent(currentProblem.input) && (
                <div>
                  <h2 className="text-sm font-semibold text-[#f1f3f5] mb-2.5 flex items-center gap-2 uppercase tracking-wider">
                    <span className={`w-1 h-4 rounded-sm ${getSectionAccent('input')}`}></span>
                    Sample Input
                  </h2>
                  <div className="bg-[#1e1f26] rounded-lg p-5 border border-[#282934]">
                    <pre className="text-[#d5d9e0] font-mono text-sm whitespace-pre-wrap break-words overflow-x-auto leading-relaxed">{currentProblem.input}</pre>
                  </div>
                </div>
              )}

              {hasContent(currentProblem.output) && (
                <div>
                  <h2 className="text-sm font-semibold text-[#f1f3f5] mb-2.5 flex items-center gap-2 uppercase tracking-wider">
                    <span className={`w-1 h-4 rounded-sm ${getSectionAccent('output')}`}></span>
                    Expected Output
                  </h2>
                  <div className="bg-[#1e1f26] rounded-lg p-5 border border-[#282934]">
                    <pre className="text-[#d5d9e0] font-mono text-sm whitespace-pre-wrap break-words overflow-x-auto leading-relaxed">{currentProblem.output}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {currentProblem && activeTab === 'hints' && (
        <div className="flex-1 overflow-auto bg-[#1a1b22] p-6">
          {!user ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center px-6 py-8 max-w-sm">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#25262f] border border-[#282934] flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[#7d8490]" />
                </div>
                <p className="text-lg font-semibold text-[#f1f3f5] mb-2">Sign In Required</p>
                <p className="text-sm text-[#7d8490] mb-5">Log in to your account to access hints for this problem</p>
                <button
                  onClick={onShowAuthModal}
                  className="text-xs font-semibold text-white px-6 py-2 rounded-lg bg-gradient-to-r from-[#3a6d9e] to-[#2a5580] hover:from-[#4480b3] hover:to-[#336599] transition-all shadow-sm shadow-[#3a6d9e]/20"
                >
                  Sign In
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              <h2 className="text-xl font-bold text-[#f1f3f5] mb-4 tracking-tight">Hints</h2>

              {hasContent(currentProblem.hints) ? (
                <div className="bg-[#1e1f26] rounded-lg p-5 border border-[#282934]">
                  <div className="markdown-content">
                    {renderMarkdown(currentProblem.hints!)}
                  </div>
                </div>
              ) : (
                <div className="bg-[#1e1f26] rounded-lg p-5 border border-[#282934]">
                  <p className="text-sm text-[#9ba1ad]">
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
              <div className="h-full flex items-center justify-center bg-[#1a1b22]">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-[#5294d0]" />
                  <p className="text-sm font-medium text-[#9ba1ad]">Loading Editor...</p>
                </div>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}
