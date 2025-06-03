
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, Clock, AlertCircle, Code, Play } from 'lucide-react';
import CodeEditor from '@/components/CodeEditor';
import Terminal from '@/components/Terminal';
import { checkLectureStatus } from '@/utils/fileSystem';
import { toast } from '@/hooks/use-toast';

const StudentView = () => {
  const [student, setStudent] = useState<any>(null);
  const [lectureStatus, setLectureStatus] = useState<any>(null);
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

    // Check lecture status periodically
    const checkStatus = () => {
      const status = checkLectureStatus();
      setLectureStatus(status);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000); // Check every 5 seconds

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

  const handleRunCode = () => {
    if (!lectureStatus?.isActive) {
      toast({
        title: "Session not active",
        description: "You can only run code during active lecture sessions",
        variant: "destructive"
      });
      return;
    }

    // Save code with timestamp
    const submission = {
      studentId: student?.studentId || student?.email,
      studentName: student?.name,
      code,
      timestamp: new Date().toISOString(),
      output: `Code executed at ${new Date().toLocaleTimeString()}\n>>> ${code.split('\n').join('\n>>> ')}`
    };

    // Store submission
    const submissions = JSON.parse(localStorage.getItem('studentSubmissions') || '[]');
    submissions.push(submission);
    localStorage.setItem('studentSubmissions', JSON.stringify(submissions));

    // Simulate code execution
    setOutput(submission.output);

    toast({
      title: "Code executed",
      description: "Your code has been submitted and executed"
    });
  };

  if (!student) {
    return <div>Loading...</div>;
  }

  const isLectureActive = lectureStatus?.isActive;
  const timeRemaining = lectureStatus?.remainingTime;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Python Learning Session
              </h1>
              <p className="text-sm text-gray-600">Welcome, {student.name}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <Badge variant={isLectureActive ? "default" : "secondary"}>
                  {isLectureActive ? `Active - ${timeRemaining}` : 'Not Active'}
                </Badge>
              </div>
              <Button variant="outline" onClick={handleLogout} size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Status Alert */}
        {!isLectureActive && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">No Active Session</p>
                <p className="text-sm text-orange-700">
                  Wait for your teacher to start a lecture session to begin coding
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Python Editor
                </CardTitle>
                <CardDescription>
                  Write your Python code here
                </CardDescription>
              </div>
              <Button 
                onClick={handleRunCode}
                disabled={!isLectureActive}
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                Run Code
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <CodeEditor
                value={code}
                onChange={setCode}
                disabled={!isLectureActive}
              />
            </CardContent>
          </Card>

          {/* Terminal */}
          <Card>
            <CardHeader>
              <CardTitle>Output Terminal</CardTitle>
              <CardDescription>
                Code execution results will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Terminal output={output} />
            </CardContent>
          </Card>
        </div>

        {/* Session Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Student ID:</span>
                <p className="text-gray-900">{student.studentId}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Email:</span>
                <p className="text-gray-900">{student.email}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Login Time:</span>
                <p className="text-gray-900">
                  {new Date(student.loginTime).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Status:</span>
                <p className="text-gray-900">
                  {isLectureActive ? 'Active Session' : 'Waiting for Session'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentView;
