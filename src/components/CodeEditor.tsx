import Editor from '@monaco-editor/react';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
}

export function CodeEditor({ value, onChange, onRun }: CodeEditorProps) {
  const { theme } = useTheme();
  const [editorOptions, setEditorOptions] = useState(() => getEditorOptions());

  function getEditorOptions() {
    const width = window.innerWidth;
    const isMobile = width < 640;
    const isTablet = width >= 640 && width < 1024;

    return {
      fontSize: isMobile ? 11 : isTablet ? 13 : 14,
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
        top: isMobile ? 6 : isTablet ? 10 : 16,
        bottom: isMobile ? 6 : isTablet ? 10 : 16
      },
      lineHeight: isMobile ? 18 : isTablet ? 20 : 22,
      scrollbar: {
        vertical: 'auto' as const,
        horizontal: 'auto' as const,
        verticalScrollbarSize: isMobile ? 8 : 12,
        horizontalScrollbarSize: isMobile ? 8 : 12,
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
    editor.addCommand(window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.Enter, () => {
      onRun();
    });

    editor.focus();
  };

  return (
    <div className="h-full w-full overflow-hidden">
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
  );
}
