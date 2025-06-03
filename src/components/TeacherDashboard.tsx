
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Code, Clock, RefreshCw, Eye } from 'lucide-react';
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
    const interval = setInterval(loadSubmissions, 3000); // Refresh every 3 seconds

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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueStudents.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently in session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length}</div>
            <p className="text-xs text-muted-foreground">
              Code executions today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {submissions.length > 0 ? new Date(submissions[0].timestamp).toLocaleTimeString() : '--:--'}
            </div>
            <p className="text-xs text-muted-foreground">
              Last submission time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Active Students</span>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
          <CardDescription>
            Students currently in the session
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {uniqueStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No students have joined the session yet
              </div>
            ) : (
              uniqueStudents.map((student) => (
                <div key={student.studentId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{student.studentName}</div>
                    <div className="text-sm text-muted-foreground">ID: {student.studentId}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">
                      {student.submissionCount} submission{student.submissionCount !== 1 ? 's' : ''}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
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
      <Card>
        <CardHeader>
          <CardTitle>Recent Code Submissions</CardTitle>
          <CardDescription>
            Latest code executions from students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {submissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No submissions yet
                </div>
              ) : (
                submissions.map((submission, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium">{submission.studentName}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({submission.studentId})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(submission.timestamp).toLocaleString()}
                        </span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Code Submission</DialogTitle>
                              <DialogDescription>
                                {submission.studentName} - {new Date(submission.timestamp).toLocaleString()}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Code:</h4>
                                <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
                                  {submission.code}
                                </pre>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Output:</h4>
                                <pre className="bg-black text-green-400 p-4 rounded text-sm overflow-x-auto">
                                  {submission.output}
                                </pre>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    <div className="bg-gray-900 text-green-400 p-2 rounded text-sm font-mono truncate">
                      {submission.code.split('\n')[0]}...
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
