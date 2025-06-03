
export const executePythonCode = (code: string): string => {
  try {
    // Simple Python code simulation
    const lines = code.split('\n').filter(line => line.trim() !== '');
    let output = '';
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Handle print statements
      if (trimmedLine.startsWith('print(')) {
        const printContent = trimmedLine.match(/print\((.*)\)/);
        if (printContent && printContent[1]) {
          let content = printContent[1];
          // Remove quotes if present
          content = content.replace(/^["']|["']$/g, '');
          output += content + '\n';
        }
      }
      
      // Handle simple variable assignments
      if (trimmedLine.includes('=') && !trimmedLine.includes('==')) {
        const [variable, value] = trimmedLine.split('=').map(s => s.trim());
        // For demo purposes, just acknowledge the assignment
        output += `${variable} assigned\n`;
      }
      
      // Handle simple math operations
      if (trimmedLine.includes('+') || trimmedLine.includes('-') || 
          trimmedLine.includes('*') || trimmedLine.includes('/')) {
        try {
          // Very basic math evaluation (unsafe in real app, but OK for demo)
          const result = eval(trimmedLine.replace(/[^0-9+\-*/().\s]/g, ''));
          if (!isNaN(result) && isFinite(result)) {
            output += `${result}\n`;
          }
        } catch {
          output += 'Math operation result\n';
        }
      }
      
      // Handle comments
      if (trimmedLine.startsWith('#')) {
        // Skip comments
        continue;
      }
      
      // Handle other Python constructs
      if (trimmedLine.startsWith('if ') || trimmedLine.startsWith('for ') || 
          trimmedLine.startsWith('while ') || trimmedLine.startsWith('def ')) {
        output += `${trimmedLine} - executed\n`;
      }
    }
    
    if (output === '') {
      output = 'Code executed successfully (no output)\n';
    }
    
    return output;
    
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`;
  }
};

export const validatePythonSyntax = (code: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const lines = code.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    if (trimmedLine === '') continue;
    
    // Check for basic syntax issues
    if (trimmedLine.endsWith(':') && !trimmedLine.match(/^(if|for|while|def|class|try|except|finally|with|elif|else)[\s\S]*:/)) {
      if (!trimmedLine.includes('def ') && !trimmedLine.includes('class ')) {
        errors.push(`Line ${i + 1}: Unexpected colon`);
      }
    }
    
    // Check for mismatched parentheses
    const openParens = (line.match(/\(/g) || []).length;
    const closeParens = (line.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push(`Line ${i + 1}: Mismatched parentheses`);
    }
    
    // Check for mismatched quotes
    const singleQuotes = (line.match(/'/g) || []).length;
    const doubleQuotes = (line.match(/"/g) || []).length;
    if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0) {
      errors.push(`Line ${i + 1}: Mismatched quotes`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
