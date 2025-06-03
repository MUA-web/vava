
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Code, Clock, RefreshCw, Eye, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const TeacherDashboard = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  useEffect(() => {
    const loadSubmissions = () => {
      const data = JSON.parse(localStorage.getItem('studentSubmissions') || '[]');
      setSubmissions(data.sort((a: any, b: any) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    };

    loadSubmissions();
    const interval = setInterval(loadSubmissions, 2000); // Refresh every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const uniqueStudents = submissions.reduce((acc: any[], submission: any) => {
    if (!acc.find(s => s.studentId === submission.studentId)) {
      acc.push({
        studentId: submission.studentId,
        studentName: submission.studentName,
        submissionCount: submissions.filter(s => s.studentId === submission.studentId).length,
        lastSubmission: submission.timestamp
      });
    }
    return acc;
  }, []);

  const totalStudents = uniqueStudents.length;
  const totalSubmissions = submissions.length;
  const avgSubmissionsPerStudent = totalStudents > 0 ? Math.round(totalSubmissions / totalStudents) : 0;

  return (
    <div className="space-y-8">
      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-blue-700">Active Students</CardTitle>
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{totalStudents}</div>
            <p className="text-xs text-blue-600 mt-1">
              {totalStudents > 0 ? 'Currently active' : 'No students yet'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-green-700">Total Submissions</CardTitle>
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <Code className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{totalSubmissions}</div>
            <p className="text-xs text-green-600 mt-1">
              Code executions today
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-purple-700">Average Activity</CardTitle>
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{avgSubmissionsPerStudent}</div>
            <p className="text-xs text-purple-600 mt-1">
              Submissions per student
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-orange-700">Latest Activity</CardTitle>
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {submissions.length > 0 ? new Date(submissions[0].timestamp).toLocaleTimeString() : '--:--'}
            </div>
            <p className="text-xs text-orange-600 mt-1">
              Last submission time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Students Overview */}
      <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Active Students</CardTitle>
              <CardDescription className="mt-1">
                Students currently participating in the session
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.reload()}
              className="bg-white hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {uniqueStudents.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No students have joined yet</p>
                <p className="text-sm text-gray-400 mt-1">Students will appear here when they join the session</p>
              </div>
            ) : (
              uniqueStudents.map((student) => (
                <div key={student.studentId} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {student.studentName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{student.studentName}</div>
                      <div className="text-sm text-gray-500">ID: {student.studentId}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                      {student.submissionCount} submission{student.submissionCount !== 1 ? 's' : ''}
                    </Badge>
                    <div className="text-xs text-gray-400">
                      {new Date(student.lastSubmission).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Submissions */}
      <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="text-xl">Live Code Submissions</CardTitle>
          <CardDescription className="mt-1">
            Real-time view of student code executions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <div className="p-6 space-y-4">
              {submissions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Code className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No submissions yet</p>
                  <p className="text-sm text-gray-400 mt-1">Student code executions will appear here</p>
                </div>
              ) : (
                submissions.map((submission, index) => (
                  <div key={index} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {submission.studentName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">{submission.studentName}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({submission.studentId})
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 px-2 py-1 bg-gray-50 rounded-full">
                          {new Date(submission.timestamp).toLocaleString()}
                        </span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50">
                              <Eye className="w-4 h-4 mr-1" />
                              View Code
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh]">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Code className="w-5 h-5" />
                                Code Submission - {submission.studentName}
                              </DialogTitle>
                              <DialogDescription>
                                Submitted on {new Date(submission.timestamp).toLocaleString()}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <Code className="w-4 h-4" />
                                  Python Code:
                                </h4>
                                <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-sm overflow-x-auto border">
                                  {submission.code}
                                </pre>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  Execution Output:
                                </h4>
                                <pre className="bg-black text-green-400 p-4 rounded-xl text-sm overflow-x-auto border">
                                  {submission.output}
                                </pre>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-sm font-mono">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-400">Preview:</span>
                      </div>
                      <div className="truncate">
                        {submission.code.split('\n')[0] || 'Empty code'}...
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
  );
};

export default TeacherDashboard;
