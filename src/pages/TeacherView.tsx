
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Monitor, FileText, Settings } from 'lucide-react';
import TeacherDashboard from '@/components/TeacherDashboard';
import LectureTimeManager from '@/components/LectureTimeManager';
import PostCreator from '@/components/PostCreator';
import { toast } from '@/hooks/use-toast';

const TeacherView = () => {
  const [teacher, setTeacher] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const teacherData = localStorage.getItem('currentTeacher');
    if (!teacherData) {
      navigate('/');
      return;
    }
    setTeacher(JSON.parse(teacherData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentTeacher');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
    navigate('/');
  };

  if (!teacher) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Teacher Dashboard
              </h1>
              <p className="text-sm text-gray-600">Welcome, {teacher.username}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="monitoring" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline">Student Monitoring</span>
              <span className="sm:hidden">Monitor</span>
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Announcements</span>
              <span className="sm:hidden">Posts</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Session Settings</span>
              <span className="sm:hidden">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring">
            <TeacherDashboard />
          </TabsContent>

          <TabsContent value="posts">
            <PostCreator />
          </TabsContent>

          <TabsContent value="settings">
            <LectureTimeManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherView;
