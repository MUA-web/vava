
interface TerminalProps {
  output: string;
}

const Terminal = ({ output }: TerminalProps) => {
  const hasError = output.toLowerCase().includes('error') || 
                   output.toLowerCase().includes('exception') || 
                   output.toLowerCase().includes('traceback');

  const formatOutput = (text: string) => {
    if (!text) return '';
    
    // Check for common Python errors and provide helpful messages
    if (text.toLowerCase().includes('syntaxerror')) {
      return text + '\n\n💡 Tip: Check your syntax - you might have a missing colon, bracket, or quote!';
    }
    if (text.toLowerCase().includes('indentationerror')) {
      return text + '\n\n💡 Tip: Python uses indentation to group code. Make sure your indentation is consistent!';
    }
    if (text.toLowerCase().includes('nameerror')) {
      return text + '\n\n💡 Tip: This variable or function name is not defined. Check your spelling!';
    }
    if (text.toLowerCase().includes('typeerror')) {
      return text + '\n\n💡 Tip: You\'re trying to use a value in a way that doesn\'t match its type.';
    }
    if (text.toLowerCase().includes('indexerror')) {
      return text + '\n\n💡 Tip: You\'re trying to access an index that doesn\'t exist in your list or string.';
    }
    if (text.toLowerCase().includes('keyerror')) {
      return text + '\n\n💡 Tip: You\'re trying to access a dictionary key that doesn\'t exist.';
    }
    if (text.toLowerCase().includes('valueerror')) {
      return text + '\n\n💡 Tip: You\'re passing an invalid value to a function.';
    }
    
    return text;
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-green-400 font-mono text-sm p-6 overflow-y-auto relative">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-700">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-gray-400 text-xs ml-3">Python 3.x Terminal Output</div>
        {hasError && (
          <div className="ml-auto">
            <span className="text-red-400 text-xs bg-red-900/30 px-2 py-1 rounded">
              ⚠ Error Detected
            </span>
          </div>
        )}
      </div>
      
      {/* Command Line */}
      <div className="text-green-400 mb-2 flex items-center gap-2">
        <span className="text-blue-400">$</span>
        <span>python main.py</span>
      </div>
      
      {/* Output */}
      <pre className={`whitespace-pre-wrap mb-4 leading-relaxed ${hasError ? 'text-red-300' : 'text-green-300'}`}>
        {output ? formatOutput(output) : (
          <span className="text-gray-500 italic">
            No output yet. Run your code to see results here.
            {'\n\n'}🚀 Your code will be executed in a safe Python environment.
            {'\n'}📊 Results and any errors will appear here with helpful tips!
          </span>
        )}
      </pre>
      
      {/* Error Help Section */}
      {hasError && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3 mb-4">
          <div className="text-red-300 text-xs font-semibold mb-1">🆘 Need Help?</div>
          <div className="text-red-200 text-xs">
            • Check the error message above for specific details
            {'\n'}• Review your code syntax and indentation
            {'\n'}• Ask your teacher if you need assistance
          </div>
        </div>
      )}
      
      {/* Cursor */}
      <div className="flex items-center">
        <span className="text-blue-400">$</span>
        <span className="ml-2 bg-green-400 w-2 h-5 animate-pulse"></span>
      </div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m0 40h40v-40h-40z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>
    </div>
  );
};

export default Terminal;
