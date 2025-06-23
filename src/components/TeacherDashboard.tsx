import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Users, Code, Clock, RefreshCw, Eye, TrendingUp, BarChart3, Globe } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { getStudentSubmissions, getOnlineStudents, getAllSessionStudents } from '@/utils/fileSystem';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

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
  const [onlineStudents, setOnlineStudents] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionStudents, setSessionStudents] = useState<any[]>([]);

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

  // Find the current sessionId (use the latest submission's session_id as a fallback)
  useEffect(() => {
    if (submissions.length > 0) {
      setSessionId(submissions[0].session_id);
    }
  }, [submissions]);

  // Fetch online students for the session
  useEffect(() => {
    if (!sessionId) return;
    const fetchOnline = async () => {
      const { data } = await getOnlineStudents(sessionId);
      setOnlineStudents(data || []);
    };
    fetchOnline();
    const interval = setInterval(fetchOnline, 20000); // Refresh every 20s
    return () => clearInterval(interval);
  }, [sessionId]);

  // Fetch all students for the session
  useEffect(() => {
    if (!sessionId) return;
    console.log('[TeacherDashboard] Using sessionId:', sessionId);
    const fetchAllStudents = async () => {
      const { data, error } = await getAllSessionStudents(sessionId);
      if (error) {
        console.error('[TeacherDashboard] Error fetching session students:', error);
      } else {
        console.log('[TeacherDashboard] Fetched session students:', data);
      }
      setSessionStudents(data || []);
    };
    fetchAllStudents();
    const interval = setInterval(fetchAllStudents, 20000); // Refresh every 20s
    return () => clearInterval(interval);
  }, [sessionId]);

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

  // Group submissions by studentId
  const submissionsByStudent = submissions.reduce((acc: any, sub: any) => {
    if (!acc[sub.studentId]) acc[sub.studentId] = [];
    acc[sub.studentId].push(sub);
    return acc;
  }, {});
  const uniqueStudentSubs = Object.values(submissionsByStudent).map((subs: any) => subs[0]);
  const [openStudent, setOpenStudent] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Website URL Sharing */}
      <Card className="border-0 shadow-2xl bg-white/30 backdrop-blur-lg ring-1 ring-white/40">
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
        <Card className="border-0 shadow-2xl bg-white/30 backdrop-blur-lg ring-1 ring-white/40">
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

        <Card className="border-0 shadow-2xl bg-white/30 backdrop-blur-lg ring-1 ring-white/40">
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

        <Card className="border-0 shadow-2xl bg-white/30 backdrop-blur-lg ring-1 ring-white/40">
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

        <Card className="border-0 shadow-2xl bg-white/30 backdrop-blur-lg ring-1 ring-white/40">
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
        <Card className="border-0 shadow-2xl bg-white/30 backdrop-blur-lg ring-1 ring-white/40">
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

        <Card className="border-0 shadow-2xl bg-white/30 backdrop-blur-lg ring-1 ring-white/40">
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
      <Card className="border-0 shadow-2xl bg-white/30 backdrop-blur-lg ring-1 ring-white/40">
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
            {sessionStudents.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No students have joined yet</p>
                <p className="text-sm text-gray-400 mt-1">Students will appear here when they join the session</p>
              </div>
            ) : (
              sessionStudents.map((student) => {
                const lastSeen = new Date(student.last_seen).getTime();
                const isOnline = Date.now() - lastSeen < 2 * 60 * 1000; // 2 minutes
                console.log('[TeacherDashboard] Student:', student.student_name, 'Online:', isOnline, 'Last seen:', student.last_seen);
                return (
                  <div key={student.student_id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-xl flex items-center justify-center relative`}>
                        <span className="text-white font-bold text-lg">
                          {student.student_name.charAt(0).toUpperCase()}
                        </span>
                        <span className={`absolute -top-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          {student.student_name}
                          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{isOnline ? 'Online' : 'Offline'}</span>
                        </div>
                        <div className="text-sm text-gray-500">ID: {student.student_id}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-xs text-gray-400">
                        Last seen: {new Date(student.last_seen).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Submissions */}
      <Card className="border-0 shadow-2xl bg-white/30 backdrop-blur-lg ring-1 ring-white/40">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="text-xl">Live Code Submissions</CardTitle>
          <CardDescription className="mt-1">
            Click a student to view all their code submissions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <div className="p-6 space-y-4">
              {uniqueStudentSubs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Code className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No submissions yet</p>
                  <p className="text-sm text-gray-400 mt-1">Student code executions will appear here</p>
                </div>
              ) : (
                uniqueStudentSubs.map((submission: any) => (
                  <div key={submission.studentId}>
                    <Link
                      to={`/teacher/students/${submission.studentId}`}
                      className="block w-full"
                    >
                      <div className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-blue-50 transition cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {submission.studentName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-semibold text-gray-900">{submission.studentName}</span>
                          <span className="text-sm text-gray-500 ml-2">({submission.studentId})</span>
                        </div>
                        <span className="text-xs text-gray-500 px-2 py-1 bg-gray-50 rounded-full">
                          {submissionsByStudent[submission.studentId][0] && new Date(submissionsByStudent[submission.studentId][0].timestamp).toLocaleString()}
                        </span>
                      </div>
                    </Link>
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
