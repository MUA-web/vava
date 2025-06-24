import { Editor } from '@monaco-editor/react';
import type { CSSProperties } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  style?: CSSProperties;
  language?: string;
  readOnly?: boolean;
}

const CodeEditor = ({ value, onChange, disabled = false, style, language = 'python', readOnly = false }: CodeEditorProps) => {
  return (
    <div className="relative w-full h-full border rounded-md overflow-hidden" style={style}>
      <Editor
        height="100%"
        language={language}
        theme="vs-dark"
        value={value}
        onChange={onChange}
        options={{
          readOnly: disabled || readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
