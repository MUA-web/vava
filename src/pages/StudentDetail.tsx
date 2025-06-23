import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Code, ArrowLeft } from 'lucide-react';
import { getStudentSubmissions } from '@/utils/fileSystem';
import { format } from 'date-fns';

const StudentDetail = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [studentName, setStudentName] = useState<string>('');

  useEffect(() => {
    const fetchSubs = async () => {
      const all = await getStudentSubmissions();
      const filtered = all.filter((s: any) => s.studentId === studentId);
      setSubmissions(filtered.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      if (filtered.length > 0) setStudentName(filtered[0].studentName);
    };
    fetchSubs();
  }, [studentId]);

  // Group submissions by date
  const submissionsByDate: Record<string, any[]> = {};
  submissions.forEach((sub) => {
    const dateKey = format(new Date(sub.timestamp), 'PPP');
    if (!submissionsByDate[dateKey]) submissionsByDate[dateKey] = [];
    submissionsByDate[dateKey].push(sub);
  });
  const sortedDates = Object.keys(submissionsByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/teacher">
          <Button variant="ghost" className="mb-6 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
        </Link>
        <Card className="border-0 shadow-2xl bg-white/30 backdrop-blur-lg ring-1 ring-white/40 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <span className="relative w-12 h-12 flex items-center justify-center">
                {/* Aura effect */}
                <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 via-green-400 to-purple-400 blur-xl opacity-60 animate-pulse z-0"></span>
                <span className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-xl flex items-center justify-center text-white font-bold text-2xl z-10">
                  {studentName ? studentName.charAt(0).toUpperCase() : '?'}
                </span>
              </span>
              {studentName || 'Student'}
            </CardTitle>
            <CardDescription>ID: {studentId}</CardDescription>
          </CardHeader>
        </Card>
        <Card className="border-0 shadow-2xl bg-white/30 backdrop-blur-lg ring-1 ring-white/40">
          <CardHeader>
            <CardTitle className="text-xl">Code Submissions</CardTitle>
            <CardDescription>All code submissions by this student, grouped by date</CardDescription>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No submissions yet</p>
                <p className="text-sm text-gray-400 mt-1">This student has not submitted any code</p>
              </div>
            ) : (
              sortedDates.map((date) => (
                <div key={date} className="mb-10">
                  <div className="text-lg font-bold text-blue-700 mb-4">{date}</div>
                  {submissionsByDate[date]
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((sub, idx) => (
                      <div key={idx} className="mb-8 border-b pb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {new Date(sub.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Code className="w-4 h-4" /> Python Code:
                        </h4>
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-sm overflow-x-auto border">
                          {sub.code}
                        </pre>
                        <h4 className="font-semibold mb-2 flex items-center gap-2 mt-4">
                          <Clock className="w-4 h-4" /> Execution Output:
                        </h4>
                        <pre className="bg-black text-green-400 p-4 rounded-xl text-sm overflow-x-auto border">
                          {sub.output}
                        </pre>
                      </div>
                    ))}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDetail; 