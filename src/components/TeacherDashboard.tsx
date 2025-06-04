
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Users, Code, Clock, RefreshCw, Eye, TrendingUp, BarChart3, Globe } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { getStudentSubmissions } from '@/utils/fileSystem';
import { supabase } from '@/integrations/supabase/client';

const chartConfig = {
  submissions: {
    label: "Submissions",
    color: "hsl(var(--chart-1))",
  },
  students: {
    label: "Students",
    color: "hsl(var(--chart-2))",
  },
};

const TeacherDashboard = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [websiteUrl, setWebsiteUrl] = useState('');

  useEffect(() => {
    // Get current website URL for sharing
    setWebsiteUrl(window.location.origin);

    const loadSubmissions = async () => {
      const data = await getStudentSubmissions();
      setSubmissions(data.sort((a: any, b: any) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    };

    loadSubmissions();

    // Set up real-time subscription for submissions
    const channel = supabase
      .channel('submissions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_submissions'
        },
        () => {
          loadSubmissions(); // Reload submissions when changes occur
        }
      )
      .subscribe();

    // Fallback polling every 10 seconds
    const interval = setInterval(loadSubmissions, 10000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
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

  // Chart data preparation
  const hourlyData = submissions.reduce((acc: any, submission: any) => {
    const hour = new Date(submission.timestamp).getHours();
    const existing = acc.find((item: any) => item.hour === hour);
    if (existing) {
      existing.submissions += 1;
    } else {
      acc.push({ hour: `${hour}:00`, submissions: 1 });
    }
    return acc;
  }, []).sort((a: any, b: any) => parseInt(a.hour) - parseInt(b.hour));

  const studentActivityData = uniqueStudents.map(student => ({
    name: student.studentName,
    submissions: student.submissionCount
  }));

  const pieData = [
    { name: 'Active Students', value: totalStudents, color: '#3b82f6' },
    { name: 'Total Submissions', value: totalSubmissions, color: '#10b981' },
  ];

  const copyWebsiteUrl = () => {
    navigator.clipboard.writeText(websiteUrl);
    // You can add a toast notification here
  };

  return (
    <div className="space-y-8">
      {/* Website URL Sharing */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-blue-600" />
            Share Your Classroom
          </CardTitle>
          <CardDescription>
            Share this URL with students worldwide (works in China and globally)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            <code className="flex-1 text-sm font-mono text-gray-700">{websiteUrl}</code>
            <Button onClick={copyWebsiteUrl} size="sm" className="bg-blue-600 hover:bg-blue-700">
              Copy URL
            </Button>
          </div>
        </CardContent>
      </Card>

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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Hourly Activity
            </CardTitle>
            <CardDescription>Code submissions throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="submissions" fill="var(--color-submissions)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Student Activity
            </CardTitle>
            <CardDescription>Submissions per student</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="submissions" fill="var(--color-students)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
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
