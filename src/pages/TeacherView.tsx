
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Monitor, FileText, Settings, Shield } from 'lucide-react';
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Modern Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Instructor Dashboard
                </h1>
                <p className="text-sm text-gray-500">Welcome back, {teacher.username}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={handleLogout} 
              size="sm"
              className="hover:bg-gray-100 text-gray-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="monitoring" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3 bg-white border shadow-sm rounded-xl h-14">
            <TabsTrigger 
              value="monitoring" 
              className="flex items-center gap-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg"
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline">Student Monitoring</span>
              <span className="sm:hidden">Monitor</span>
            </TabsTrigger>
            <TabsTrigger 
              value="posts" 
              className="flex items-center gap-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-lg"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Announcements</span>
              <span className="sm:hidden">Posts</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Session Settings</span>
              <span className="sm:hidden">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring" className="space-y-6">
            <TeacherDashboard />
          </TabsContent>

          <TabsContent value="posts" className="space-y-6">
            <PostCreator />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <LectureTimeManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherView;
