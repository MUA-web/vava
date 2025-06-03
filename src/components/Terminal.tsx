
interface TerminalProps {
  output: string;
}

const Terminal = ({ output }: TerminalProps) => {
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
      </div>
      
      {/* Command Line */}
      <div className="text-green-400 mb-2 flex items-center gap-2">
        <span className="text-blue-400">$</span>
        <span>python main.py</span>
      </div>
      
      {/* Output */}
      <pre className="whitespace-pre-wrap mb-4 text-green-300 leading-relaxed">
        {output || (
          <span className="text-gray-500 italic">
            No output yet. Run your code to see results here.
          </span>
        )}
      </pre>
      
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
