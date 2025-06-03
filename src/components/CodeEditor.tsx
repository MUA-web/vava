
import { useEffect, useRef } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const CodeEditor = ({ value, onChange, disabled = false }: CodeEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue = value.substring(0, start) + '    ' + value.substring(end);
        onChange(newValue);
        
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 4;
        }, 0);
      }
    };

    textarea.addEventListener('keydown', handleTab);
    return () => textarea.removeEventListener('keydown', handleTab);
  }, [value, onChange]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full h-96 p-4 font-mono text-sm bg-gray-900 text-green-400 border-0 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        placeholder="# Write your Python code here..."
        spellCheck={false}
      />
      
      {/* Line numbers */}
      <div className="absolute left-0 top-0 w-12 h-full bg-gray-800 border-r border-gray-700 p-4 font-mono text-xs text-gray-400 select-none">
        {value.split('\n').map((_, index) => (
          <div key={index} className="leading-5">
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodeEditor;
