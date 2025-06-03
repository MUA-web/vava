
interface TerminalProps {
  output: string;
}

const Terminal = ({ output }: TerminalProps) => {
  return (
    <div className="h-96 bg-black text-green-400 font-mono text-sm p-4 overflow-y-auto">
      <div className="mb-2 text-gray-500">Python 3.x Terminal Output</div>
      <div className="text-green-400">{'>'} python main.py</div>
      <pre className="whitespace-pre-wrap mt-2">
        {output || 'No output yet. Run your code to see results here.'}
      </pre>
      <div className="flex items-center mt-2">
        <span className="text-green-400">{'>'}</span>
        <span className="ml-2 bg-green-400 w-2 h-4 animate-pulse"></span>
      </div>
    </div>
  );
};

export default Terminal;
