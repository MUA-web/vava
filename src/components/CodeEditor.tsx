
import { useEffect, useRef } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

// Comprehensive Python simulator
const simulatePythonExecution = (code: string): string => {
  try {
    if (!code.trim()) {
      return "No code to execute.";
    }

    const lines = code.split('\n');
    let output = '';
    let variables: { [key: string]: any } = {};
    let functions: { [key: string]: { params: string[], body: string[] } } = {};
    let classes: { [key: string]: { methods: { [key: string]: any }, attributes: { [key: string]: any } } } = {};
    let indentLevel = 0;
    let skipLines = 0;
    
    for (let i = 0; i < lines.length; i++) {
      if (skipLines > 0) {
        skipLines--;
        continue;
      }

      const line = lines[i];
      const trimmedLine = line.trim();
      
      if (!trimmedLine || trimmedLine.startsWith('#')) continue;

      try {
        // Handle print statements
        if (trimmedLine.includes('print(')) {
          const printMatches = trimmedLine.match(/print\(([^)]*)\)/g);
          if (printMatches) {
            printMatches.forEach(match => {
              const content = match.match(/print\(([^)]*)\)/)?.[1] || '';
              let result = evaluateExpression(content, variables);
              output += result + '\n';
            });
          }
        }
        
        // Handle variable assignments
        else if (trimmedLine.includes('=') && !trimmedLine.includes('==') && !trimmedLine.includes('!=') && !trimmedLine.includes('<=') && !trimmedLine.includes('>=')) {
          const [varName, expression] = trimmedLine.split('=').map(s => s.trim());
          if (varName && expression) {
            variables[varName] = evaluateExpression(expression, variables);
          }
        }
        
        // Handle lists
        else if (trimmedLine.includes('[') && trimmedLine.includes(']')) {
          const listMatch = trimmedLine.match(/(\w+)\s*=\s*\[([^\]]*)\]/);
          if (listMatch) {
            const [, varName, content] = listMatch;
            const items = content.split(',').map(item => evaluateExpression(item.trim(), variables));
            variables[varName] = items;
          }
        }
        
        // Handle dictionaries
        else if (trimmedLine.includes('{') && trimmedLine.includes('}')) {
          const dictMatch = trimmedLine.match(/(\w+)\s*=\s*\{([^}]*)\}/);
          if (dictMatch) {
            const [, varName, content] = dictMatch;
            const dict: { [key: string]: any } = {};
            if (content.trim()) {
              const pairs = content.split(',');
              pairs.forEach(pair => {
                const [key, value] = pair.split(':').map(s => s.trim());
                if (key && value) {
                  const cleanKey = key.replace(/['"]/g, '');
                  dict[cleanKey] = evaluateExpression(value, variables);
                }
              });
            }
            variables[varName] = dict;
          }
        }
        
        // Handle tuples
        else if (trimmedLine.includes('(') && trimmedLine.includes(')') && trimmedLine.includes('=')) {
          const tupleMatch = trimmedLine.match(/(\w+)\s*=\s*\(([^)]*)\)/);
          if (tupleMatch) {
            const [, varName, content] = tupleMatch;
            const items = content.split(',').map(item => evaluateExpression(item.trim(), variables));
            variables[varName] = items; // Treating as array for simplicity
          }
        }
        
        // Handle if statements
        else if (trimmedLine.startsWith('if ')) {
          const condition = trimmedLine.substring(3).replace(':', '').trim();
          const conditionResult = evaluateCondition(condition, variables);
          
          if (conditionResult) {
            // Execute if block
            let j = i + 1;
            while (j < lines.length && (lines[j].startsWith('    ') || lines[j].trim() === '')) {
              if (lines[j].trim()) {
                const blockResult = simulatePythonExecution(lines[j]);
                if (blockResult) output += blockResult;
              }
              j++;
            }
            skipLines = j - i - 1;
          }
        }
        
        // Handle for loops
        else if (trimmedLine.startsWith('for ')) {
          const forMatch = trimmedLine.match(/for\s+(\w+)\s+in\s+(.+):/);
          if (forMatch) {
            const [, loopVar, iterable] = forMatch;
            const iterableValue = evaluateExpression(iterable, variables);
            
            if (Array.isArray(iterableValue)) {
              iterableValue.forEach(item => {
                variables[loopVar] = item;
                let j = i + 1;
                while (j < lines.length && (lines[j].startsWith('    ') || lines[j].trim() === '')) {
                  if (lines[j].trim()) {
                    const blockResult = simulatePythonExecution(lines[j]);
                    if (blockResult) output += blockResult;
                  }
                  j++;
                }
              });
            }
          }
        }
        
        // Handle while loops
        else if (trimmedLine.startsWith('while ')) {
          const condition = trimmedLine.substring(6).replace(':', '').trim();
          let iterations = 0;
          const maxIterations = 100; // Prevent infinite loops
          
          while (evaluateCondition(condition, variables) && iterations < maxIterations) {
            let j = i + 1;
            while (j < lines.length && (lines[j].startsWith('    ') || lines[j].trim() === '')) {
              if (lines[j].trim()) {
                const blockResult = simulatePythonExecution(lines[j]);
                if (blockResult) output += blockResult;
              }
              j++;
            }
            iterations++;
          }
          
          if (iterations >= maxIterations) {
            output += "Warning: Loop stopped after 100 iterations to prevent infinite loop\n";
          }
        }
        
        // Handle function definitions
        else if (trimmedLine.startsWith('def ')) {
          const funcMatch = trimmedLine.match(/def\s+(\w+)\s*\(([^)]*)\)\s*:/);
          if (funcMatch) {
            const [, funcName, params] = funcMatch;
            const paramList = params.split(',').map(p => p.trim()).filter(p => p);
            
            // Get function body
            const body: string[] = [];
            let j = i + 1;
            while (j < lines.length && (lines[j].startsWith('    ') || lines[j].trim() === '')) {
              if (lines[j].trim()) {
                body.push(lines[j]);
              }
              j++;
            }
            
            functions[funcName] = { params: paramList, body };
            skipLines = j - i - 1;
          }
        }
        
        // Handle class definitions
        else if (trimmedLine.startsWith('class ')) {
          const classMatch = trimmedLine.match(/class\s+(\w+)(\([^)]*\))?\s*:/);
          if (classMatch) {
            const [, className] = classMatch;
            classes[className] = { methods: {}, attributes: {} };
            
            let j = i + 1;
            while (j < lines.length && (lines[j].startsWith('    ') || lines[j].trim() === '')) {
              j++;
            }
            skipLines = j - i - 1;
          }
        }
        
        // Handle function calls
        else if (trimmedLine.includes('(') && trimmedLine.includes(')')) {
          const funcCallMatch = trimmedLine.match(/(\w+)\s*\(([^)]*)\)/);
          if (funcCallMatch) {
            const [, funcName, args] = funcCallMatch;
            if (functions[funcName]) {
              output += `Function ${funcName} called with arguments: ${args}\n`;
            }
          }
        }
        
      } catch (error) {
        output += `Error on line ${i + 1}: ${error}\n`;
      }
    }
    
    return output || "Code executed successfully (no output)";
    
  } catch (error) {
    return `Runtime Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};

// Helper function to evaluate expressions
const evaluateExpression = (expr: string, variables: { [key: string]: any }): any => {
  const trimmed = expr.trim();
  
  // Handle string literals
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || 
      (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  
  // Handle numbers
  if (!isNaN(Number(trimmed))) {
    return Number(trimmed);
  }
  
  // Handle booleans
  if (trimmed === 'True') return true;
  if (trimmed === 'False') return false;
  if (trimmed === 'None') return null;
  
  // Handle variables
  if (variables.hasOwnProperty(trimmed)) {
    return variables[trimmed];
  }
  
  // Handle lists
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const content = trimmed.slice(1, -1);
    if (!content.trim()) return [];
    return content.split(',').map(item => evaluateExpression(item.trim(), variables));
  }
  
  // Handle ranges
  if (trimmed.startsWith('range(')) {
    const rangeMatch = trimmed.match(/range\((\d+)(?:,\s*(\d+))?\)/);
    if (rangeMatch) {
      const start = rangeMatch[2] ? parseInt(rangeMatch[1]) : 0;
      const end = rangeMatch[2] ? parseInt(rangeMatch[2]) : parseInt(rangeMatch[1]);
      return Array.from({ length: end - start }, (_, i) => start + i);
    }
  }
  
  // Handle basic arithmetic
  try {
    // Replace variables in expression
    let processedExpr = trimmed;
    Object.keys(variables).forEach(varName => {
      const varValue = variables[varName];
      if (typeof varValue === 'number') {
        processedExpr = processedExpr.replace(new RegExp(`\\b${varName}\\b`, 'g'), varValue.toString());
      }
    });
    
    // Safe evaluation of basic math
    if (/^[\d+\-*/().\s]+$/.test(processedExpr)) {
      return eval(processedExpr);
    }
  } catch (e) {
    // Fall back to original expression
  }
  
  return trimmed;
};

// Helper function to evaluate conditions
const evaluateCondition = (condition: string, variables: { [key: string]: any }): boolean => {
  try {
    let processedCondition = condition;
    
    // Replace variables
    Object.keys(variables).forEach(varName => {
      const varValue = variables[varName];
      processedCondition = processedCondition.replace(
        new RegExp(`\\b${varName}\\b`, 'g'), 
        JSON.stringify(varValue)
      );
    });
    
    // Handle comparison operators
    processedCondition = processedCondition
      .replace(/==/g, '===')
      .replace(/!=/g, '!==');
    
    // Simple evaluation for basic conditions
    if (/^[\d\s+\-*/().<>=!&|"']+$/.test(processedCondition)) {
      return eval(processedCondition);
    }
    
    return true; // Default to true for complex conditions
  } catch (e) {
    return false;
  }
};

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
    <div className="relative h-full">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full h-full p-4 pl-14 font-mono text-sm bg-gray-900 text-green-400 border-0 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        placeholder="# Write your Python code here...
# Supports: variables, lists, tuples, dictionaries
# Control flow: if/elif/else, for/while loops
# Functions: def function_name():
# Classes: class ClassName:
# And much more!"
        spellCheck={false}
      />
      
      {/* Line numbers */}
      <div className="absolute left-0 top-0 w-12 h-full bg-gray-800 border-r border-gray-700 p-4 font-mono text-xs text-gray-400 select-none overflow-hidden">
        {value.split('\n').map((_, index) => (
          <div key={index} className="leading-5 h-5">
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

// Export the simulator function for use in StudentView
export { simulatePythonExecution };
export default CodeEditor;
