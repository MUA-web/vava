
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, Code, Clock, Monitor, FileText } from 'lucide-react';
import StudentAuth from '@/components/StudentAuth';
import TeacherAuth from '@/components/TeacherAuth';

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);

  if (selectedRole === 'student') {
    return <StudentAuth onBack={() => setSelectedRole(null)} />;
  }

  if (selectedRole === 'teacher') {
    return <TeacherAuth onBack={() => setSelectedRole(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
            Python Learning System
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            An interactive platform for learning Python programming with real-time collaboration 
            between teachers and students
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer transform hover:scale-105 transition-transform"
                onClick={() => setSelectedRole('student')}>
            <CardHeader className="text-center">
              <GraduationCap className="w-16 h-16 mx-auto text-blue-600 mb-4" />
              <CardTitle className="text-2xl">Student Access</CardTitle>
              <CardDescription className="text-base">
                Join a coding session and practice Python programming
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Code className="w-5 h-5 text-green-600" />
                <span>Interactive code editor</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Clock className="w-5 h-5 text-orange-600" />
                <span>Time-controlled access</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Monitor className="w-5 h-5 text-purple-600" />
                <span>Real-time code execution</span>
              </div>
              <Button className="w-full mt-4" onClick={() => setSelectedRole('student')}>
                Enter as Student
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer transform hover:scale-105 transition-transform"
                onClick={() => setSelectedRole('teacher')}>
            <CardHeader className="text-center">
              <Users className="w-16 h-16 mx-auto text-green-600 mb-4" />
              <CardTitle className="text-2xl">Teacher Access</CardTitle>
              <CardDescription className="text-base">
                Manage sessions and monitor student progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Monitor className="w-5 h-5 text-blue-600" />
                <span>Live student monitoring</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Clock className="w-5 h-5 text-orange-600" />
                <span>Session time management</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FileText className="w-5 h-5 text-purple-600" />
                <span>Create announcements</span>
              </div>
              <Button className="w-full mt-4" variant="outline" onClick={() => setSelectedRole('teacher')}>
                Enter as Teacher
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Choose Your Role</h3>
              <p className="text-sm text-gray-600">Select whether you're a student or teacher</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Join Session</h3>
              <p className="text-sm text-gray-600">Students code during active lecture times</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Learn Together</h3>
              <p className="text-sm text-gray-600">Real-time collaboration and monitoring</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
