
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LogOut, Clock, AlertCircle, Code, Play, MessageSquare } from 'lucide-react';
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'announcement':
        return 'bg-blue-100 text-blue-800';
      case 'assignment':
        return 'bg-green-100 text-green-800';
      case 'note':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

        {/* Main Layout: Posts on left, Editor and Terminal on right */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Side - Teacher Posts */}
          <div className="lg:col-span-1">
            <Card className="h-[calc(100vh-240px)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Live Updates
                </CardTitle>
                <CardDescription>
                  Latest announcements from your teacher ({teacherPosts.length} posts)
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-340px)] px-6">
                  <div className="space-y-4 pb-4">
                    {teacherPosts.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No announcements yet</p>
                        <p className="text-sm">Your teacher hasn't posted anything</p>
                      </div>
                    ) : (
                      teacherPosts.map((post) => (
                        <div key={post.id} className="border rounded-lg p-4 bg-white shadow-sm">
                          <div className="flex flex-col gap-2 mb-3">
                            <h3 className="font-semibold text-base">{post.title}</h3>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                              <Badge className={getTypeColor(post.type)}>
                                {post.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(post.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <PostContent content={post.content} />
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Editor and Terminal */}
          <div className="lg:col-span-2 space-y-4">
            {/* Code Editor - Larger */}
            <Card className="flex-1">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
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
                <div className="h-[450px]">
                  <CodeEditor
                    value={code}
                    onChange={setCode}
                    disabled={!isLectureActive}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Terminal - Smaller */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Output Terminal</CardTitle>
                <CardDescription>
                  Code execution results will appear here
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[250px]">
                  <Terminal output={output} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Session Info - Moved to bottom */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Student ID:</span>
                <p className="text-gray-900 break-all">{student.studentId}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Email:</span>
                <p className="text-gray-900 break-all">{student.email}</p>
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
