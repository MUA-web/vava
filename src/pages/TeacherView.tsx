import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Monitor, FileText, Settings, Shield, PanelLeft } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import TeacherDashboard from '@/components/TeacherDashboard';
import LectureManager from '@/components/LectureManager';
import PostCreator from '@/components/PostCreator';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { cn } from "@/lib/utils";

const TeacherView = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('monitoring');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully"
      });
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const teacherName = user.user_metadata?.name || user.email;

  const menuItems = [
    { title: "Student Monitoring", value: "monitoring", icon: Monitor },
    { title: "Announcements", value: "posts", icon: FileText },
    { title: "Session Settings", value: "settings", icon: Settings },
  ];

  const SidebarContent = ({ className }: { className?: string }) => (
    <div className={cn("flex flex-col h-full bg-muted/40", className)}>
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Instructor Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">{teacherName}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.value}
            variant={activeTab === item.value ? "secondary" : "ghost"}
            onClick={() => setActiveTab(item.value)}
            className="w-full justify-start gap-3"
          >
            <item.icon className="w-5 h-5" />
            {item.title}
          </Button>
        ))}
      </nav>
      <div className="p-4 border-t mt-auto">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <SidebarContent />
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
               <SidebarContent />
            </SheetContent>
          </Sheet>

          <div className="flex-1">
            <h1 className="text-lg font-semibold md:text-xl">
              {menuItems.find(item => item.value === activeTab)?.title}
            </h1>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 bg-background">
            {activeTab === 'monitoring' && <TeacherDashboard />}
            {activeTab === 'posts' && <PostCreator />}
            {activeTab === 'settings' && <LectureManager />}
        </main>
      </div>
    </div>
  );
};

export default TeacherView;
