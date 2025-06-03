
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LogOut, Clock, AlertCircle, Code, Play, MessageSquare, Users, FileText, Globe } from 'lucide-react';
import CodeEditor from '@/components/CodeEditor';
import Terminal from '@/components/Terminal';
import PostContent from '@/components/PostContent';
import { checkLectureStatus, getTeacherPosts } from '@/utils/fileSystem';
import { toast } from '@/hooks/use-toast';

const StudentView = () => {
  const [student, setStudent] = useState<any>(null);
  const [lectureStatus, setLectureStatus] = useState<any>(null);
  const [teacherPosts, setTeacherPosts] = useState<any[]>([]);
  const [code, setCode] = useState('# Welcome to Python Learning System!\n# Write your Python code here\n\nprint("Hello, World!")');
  const [output, setOutput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const studentData = localStorage.getItem('currentStudent');
    if (!studentData) {
      navigate('/');
      return;
    }

    setStudent(JSON.parse(studentData));

    // Check lecture status and posts periodically
    const checkStatus = () => {
      const status = checkLectureStatus();
      setLectureStatus(status);
      
      // Load teacher posts live
      const posts = getTeacherPosts();
      setTeacherPosts(posts);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 2000); // Check every 2 seconds for live updates

    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentStudent');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
    navigate('/');
  };

  const simulatePythonExecution = (code: string) => {
    try {
      // Basic Python syntax checking and simulation
      if (!code.trim()) {
        return "No code to execute.";
      }

      // Check for common syntax errors
      if (code.includes('print(') && !code.includes(')')) {
        return "SyntaxError: Missing closing parenthesis in print statement";
      }
      
      if (code.includes('def ') && !code.includes(':')) {
        return "SyntaxError: Missing colon after function definition";
      }

      // Check for indentation issues (very basic)
      const lines = code.split('\n');
      let hasIndentationError = false;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim().endsWith(':') && i < lines.length - 1) {
          const nextLine = lines[i + 1];
          if (nextLine.trim() && !nextLine.startsWith(' ') && !nextLine.startsWith('\t')) {
            hasIndentationError = true;
            break;
          }
        }
      }
      
      if (hasIndentationError) {
        return "IndentationError: Expected an indented block";
      }

      // Simulate basic print statements
      const printMatches = code.match(/print\([^)]*\)/g);
      if (printMatches) {
        let result = '';
        printMatches.forEach(match => {
          const content = match.match(/print\(([^)]*)\)/)?.[1] || '';
          if (content.includes('"') || content.includes("'")) {
            // String literal
            const stringContent = content.replace(/['"]/g, '');
            result += stringContent + '\n';
          } else {
            // Variable or expression
            result += `${content}\n`;
          }
        });
        return result.trim();
      }

      // If no print statements, return success message
      return "Code executed successfully (no output)";
    } catch (error) {
      return `Runtime Error: ${error}`;
    }
  };

  const handleRunCode = () => {
    if (!lectureStatus?.isActive) {
      toast({
        title: "Session not active",
        description: "You can only run code during active lecture sessions",
        variant: "destructive"
      });
      return;
    }

    // Simulate Python execution with better error handling
    const executionOutput = simulatePythonExecution(code);
    
    // Save code with timestamp
    const submission = {
      studentId: student?.studentId || student?.email,
      studentName: student?.name,
      code,
      timestamp: new Date().toISOString(),
      output: `Executed at ${new Date().toLocaleTimeString()}\n${executionOutput}`
    };

    // Store submission
    const submissions = JSON.parse(localStorage.getItem('studentSubmissions') || '[]');
    submissions.push(submission);
    localStorage.setItem('studentSubmissions', JSON.stringify(submissions));

    // Set output
    setOutput(submission.output);

    toast({
      title: "Code executed",
      description: "Your code has been submitted and executed"
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'announcement':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'assignment':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'note':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isLectureActive = lectureStatus?.isActive;
  const timeRemaining = lectureStatus?.remainingTime;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Modern Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Python Studio
                </h1>
                <p className="text-sm text-gray-500">Welcome back, {student.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50">
                <Globe className="w-4 h-4" />
                <Badge variant={isLectureActive ? "default" : "secondary"} className="border-0">
                  {isLectureActive ? `Live • ${timeRemaining}` : 'Offline'}
                </Badge>
              </div>
              <Button variant="ghost" onClick={handleLogout} size="sm" className="hover:bg-gray-100">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Alert */}
      {!isLectureActive && (
        <div className="container mx-auto px-4 pt-6">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-orange-800">Session Paused</p>
                <p className="text-sm text-orange-700">
                  Waiting for your instructor to start the coding session
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        {/* Main Layout */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Live Updates */}
          <div className="lg:col-span-4">
            <Card className="h-[calc(100vh-220px)] border-0 shadow-lg bg-white/60 backdrop-blur-sm">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-lg">Live Updates</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-600">{teacherPosts.length} posts</span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-340px)]">
                  <div className="p-4 space-y-4">
                    {teacherPosts.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No updates yet</p>
                        <p className="text-sm text-gray-400 mt-1">Your instructor hasn't posted anything</p>
                      </div>
                    ) : (
                      teacherPosts.map((post) => (
                        <div key={post.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-semibold text-gray-900 text-base leading-tight">{post.title}</h3>
                              <Badge className={`${getTypeColor(post.type)} text-xs border`}>
                                {post.type}
                              </Badge>
                            </div>
                            <PostContent content={post.content} />
                            <div className="mt-3 pt-3 border-t border-gray-50">
                              <p className="text-xs text-gray-400">
                                {new Date(post.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Editor and Terminal */}
          <div className="lg:col-span-8 space-y-6">
            {/* Code Editor */}
            <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Code className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Python Editor</CardTitle>
                    <CardDescription className="text-sm">
                      Write and execute your Python code
                    </CardDescription>
                  </div>
                </div>
                <Button 
                  onClick={handleRunCode}
                  disabled={!isLectureActive}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 border-0 shadow-lg disabled:opacity-50"
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run Code
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[450px] rounded-b-xl overflow-hidden">
                  <CodeEditor
                    value={code}
                    onChange={setCode}
                    disabled={!isLectureActive}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Terminal */}
            <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
              <CardHeader className="pb-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                    <Code className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Output Console</CardTitle>
                    <CardDescription className="text-sm">
                      View your code execution results with helpful error tips
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[250px] rounded-b-xl overflow-hidden">
                  <Terminal output={output} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Session Info Footer */}
        <Card className="mt-6 border-0 shadow-lg bg-white/60 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Student ID</p>
                  <p className="text-gray-900 font-mono text-sm">{student.studentId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-gray-900 text-sm break-all">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Login Time</p>
                  <p className="text-gray-900 text-sm">
                    {new Date(student.loginTime).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className="text-gray-900 text-sm">
                    {isLectureActive ? 'Active Session' : 'Waiting for Session'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentView;
