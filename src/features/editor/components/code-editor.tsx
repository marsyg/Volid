

import * as monaco from 'monaco-editor';
import type { IDisposable } from 'monaco-editor';
import { type editor as editorType } from 'monaco-editor';
import { useEffect, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { createMyInlineCompletionsProvider } from '../utils/customInlineCompleletionProvider';
type Monaco = typeof monaco;
interface Props {
  fileName: string;
  intailValue?: string;
  onChange: (value: string) => void;
}
export const CodeEditor = ({ fileName, intailValue, onChange }: Props) => {
  const monaco = useMonaco();

  const editorRef = useRef<editorType.IStandaloneCodeEditor | null>(null);

  const changeSubscriptionRef = useRef<IDisposable | null>(null);

  const getLanguageId = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      html: 'html',
      css: 'css',
      json: 'json',
      md: 'markdown',
      mdx: 'markdown',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      csharp: 'csharp',
      php: 'php',
      ruby: 'ruby',
      go: 'go',
      rust: 'rust',
      sql: 'sql',
      xml: 'xml',
      yaml: 'yaml',
      yml: 'yaml',
      bash: 'shell',
      sh: 'shell',
    };
    return ext ? languageMap[ext] : 'plaintext';
  };

  useEffect(() => {
    if (!monaco) return;

    // Define custom theme
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '#6A9955' },
        { token: 'string', foreground: '#CE9178' },
        { token: 'number', foreground: '#B5CEA8' },
        { token: 'keyword', foreground: '#569CD6' },
      ],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.foreground': '#D4D4D4',
        'editor.lineNumbersBackground': '#1E1E1E',
        'editor.lineNumbersForeground': '#858585',
        'editor.selectionBackground': '#264F78',
        'editorCursor.foreground': '#AEAFAD',
        'editor.inlineValuesBackground': '#1E1E1E',
      },
    });

    monaco.editor.setTheme('custom-dark');
  }, [monaco]);

  const handleEditorOnMount = (
    editor: editorType.IStandaloneCodeEditor,
    monaco: Monaco,
  ) => {
    editorRef.current = editor;
    const model = editor.getModel();
    if (!model) return;

    if (changeSubscriptionRef.current) {
      changeSubscriptionRef.current.dispose();
    }

    const languageId = model.getLanguageId();
    // changeSubscriptionRef.current =
    //   monaco.languages.registerInlineCompletionsProvider(
    //     languageId,
    //     createMyInlineCompletionsProvider(),
    //   );

    editor.updateOptions({
      minimap: { enabled: true },
      wordWrap: 'on',
      formatOnPaste: true,
      formatOnType: true,
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      autoSurround: 'languageDefined',
      autoIndent: 'full',
      fontFamily: 'Plex Mono, "Courier New", monospace',
      fontSize: 14,
      lineHeight: 1.5,
      scrollBeyondLastLine: false,
      smoothScrolling: true,
      cursorBlinking: 'blink',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
    });
  };
  const languageId = getLanguageId(fileName);

  return (
    <Editor
      theme="custom-dark"
      language={languageId}
      value={intailValue ?? ''}
      onChange={(value) => onChange(value ?? '')}
      onMount={handleEditorOnMount}
      options={{
        automaticLayout: true,
        padding: { top: 16, bottom: 16 },
        scrollbar: {
          vertical: 'auto',
          horizontal: 'auto',
          useShadows: true,
          verticalSliderSize: 12,
          horizontalSliderSize: 12,
        },
        inlineSuggest: {
          enabled: true,
        },
      }}
    />
  );
};
