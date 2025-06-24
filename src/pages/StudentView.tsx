import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LogOut, Clock, AlertCircle, Code, Play, MessageSquare, Users, FileText, Rss } from 'lucide-react';
import CodeEditor from '@/components/CodeEditor';
import Terminal from '@/components/Terminal';
import PostContent from '@/components/PostContent';
import { checkLectureStatus, getTeacherPosts, saveStudentSubmission, upsertStudentSession } from '@/utils/fileSystem';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { runPython, injectPyodideScript, isPyodideLoading } from '@/utils/pyodideRunner';
import { cn } from '@/lib/utils';

const StudentView = () => {
  const { user, signOut } = useAuth();
  const [lectureStatus, setLectureStatus] = useState<any>(null);
  const [teacherPosts, setTeacherPosts] = useState<any[]>([]);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    injectPyodideScript(); // Ensure Pyodide script is loaded
    if (!user) return;

    // Initial load
    const loadData = async () => {
      const status = await checkLectureStatus();
      setLectureStatus(status);
      
      const posts = await getTeacherPosts();
      setTeacherPosts(posts);
    };

    loadData();

    // Set up real-time subscriptions
    const postsChannel = supabase
      .channel('posts-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        async () => {
          const posts = await getTeacherPosts();
          setTeacherPosts(posts);
        }
      )
      .subscribe();

    const lectureChannel = supabase
      .channel('lecture-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lecture_sessions'
        },
        async () => {
          const status = await checkLectureStatus();
          setLectureStatus(status);
        }
      )
      .subscribe();

    // Check status periodically as backup
    const statusInterval = setInterval(async () => {
      const status = await checkLectureStatus();
      setLectureStatus(status);
    }, 30000); // Check every 30 seconds

    // Upsert student online status every 30 seconds
    let onlineInterval: NodeJS.Timeout | null = null;
    const updateOnlineStatus = async () => {
      if (lectureStatus?.id && user && lectureStatus?.isActive) {
        console.log('[StudentView] Updating online status:', {
          studentId: user.id || user.email || 'unknown',
          studentName: user.user_metadata?.name || user.email || 'Unknown Student',
          sessionId: lectureStatus.id
        });
        const { error } = await upsertStudentSession(
          user.id || user.email || 'unknown',
          user.user_metadata?.name || user.email || 'Unknown Student',
          lectureStatus.id
        );
        if (error) {
          console.error('[StudentView] Error updating online status:', error);
        }
      } else {
        console.warn('[StudentView] Missing user or sessionId for online status update', { user, sessionId: lectureStatus?.id });
      }
    };

    // Call immediately if session is active
    if (lectureStatus?.isActive && user && lectureStatus?.id) {
      updateOnlineStatus();
    }
    if (lectureStatus?.isActive) {
      onlineInterval = setInterval(updateOnlineStatus, 30000);
    }
    return () => {
      clearInterval(statusInterval);
      if (onlineInterval) clearInterval(onlineInterval);
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(lectureChannel);
    };
  }, [user, lectureStatus]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully"
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if signOut fails
      window.location.href = '/';
    }
  };

  const handleRunCode = async () => {
    if (!lectureStatus?.isActive) {
      toast({
        title: "Session not active",
        description: "You can only run code during active lecture sessions",
        variant: "destructive"
      });
      return;
    }
    if (isRunning || isPyodideLoading()) return;
    setIsRunning(true);
    setError(null);
    setOutput('Running Python code...');
    try {
      const executionOutput = await runPython(code);
      setOutput(executionOutput);
      if (executionOutput.toLowerCase().includes('error')) {
        setError(executionOutput);
      }
      // Save code with timestamp to Supabase
      const submission = {
        studentId: user?.id || user?.email || 'unknown',
        studentName: user?.user_metadata?.name || user?.email || 'Unknown Student',
        code,
        timestamp: new Date().toISOString(),
        output: `Executed at ${new Date().toLocaleTimeString()}\n${executionOutput}`
      };
      await saveStudentSubmission(submission);
    } catch (err: any) {
      setOutput('Failed to run code.');
      setError(err.message || String(err));
    } finally {
      setIsRunning(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'announcement':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'assignment':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'note':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
      case 'code':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isLectureActive = lectureStatus?.isActive;
  const timeRemaining = lectureStatus?.remainingTime;
  const studentName = user.user_metadata?.name || user.email;
  const formatTime = (time: string | undefined) => {
    if (!time) return '';
    const date = new Date(time);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2">
        <div className="flex items-center gap-2">
            <Code className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold">Student Studio</h1>
        </div>
        
        <div className="ml-auto flex items-center gap-4">
            <Badge variant={isLectureActive ? "default" : "secondary"} className="text-sm">
              <div className={cn("w-2 h-2 rounded-full mr-2", isLectureActive ? 'bg-green-500' : 'bg-gray-400')}></div>
              {isLectureActive ? `Live: ${timeRemaining}` : 'Offline'}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
            </Button>
        </div>
      </header>
      
      {!isLectureActive && (
        <div className="px-4 sm:px-6">
            <Card className="sm:col-span-2 border-yellow-500/50 bg-yellow-50 dark:bg-yellow-900/20">
              <CardHeader className="pb-2 flex-row items-start gap-3 space-y-0">
                  <div className="p-2 rounded-md bg-yellow-500/10">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-yellow-700 dark:text-yellow-300">Session Paused</CardTitle>
                    <CardDescription className="text-yellow-600 dark:text-yellow-400">
                      Waiting for your instructor to start the coding session. Your editor is disabled.
                    </CardDescription>
                  </div>
              </CardHeader>
            </Card>
        </div>
      )}

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:p-6 h-[calc(100vh-4rem)]">
        {/* Left Column: Live Updates */}
        <div className="lg:col-span-1 flex flex-col gap-6 h-full">
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center gap-3">
              <Rss className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Live Updates</h2>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="space-y-4">
                  {teacherPosts.length > 0 ? (
                    teacherPosts.map((post) => (
                      <Card key={post.id} className="overflow-hidden">
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-between">
                            <Badge className={cn(getTypeColor(post.type), 'capitalize font-medium')}>
                              {post.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(post.timestamp)}
                            </span>
                          </div>
                          <CardTitle className="text-base pt-2">{post.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <PostContent {...post} contentClassName="h-64" />
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-12">
                      <p>No announcements yet.</p>
                      <p className="text-sm">Updates from your teacher will appear here.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Code Editor and Terminal */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">
          <Card className="flex-1 flex flex-col min-h-[70vh]">
            <CardHeader className="flex flex-row items-center gap-3 flex-shrink-0">
               <Code className="w-5 h-5 text-primary" />
               <h2 className="text-lg font-semibold">Code Editor</h2>
               <div className="ml-auto">
                 <Button onClick={handleRunCode} disabled={isRunning || !isLectureActive}>
                   {isRunning ? 'Running...' : <><Play className="w-4 h-4 mr-2" /> Run Code</>}
                 </Button>
               </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 h-full">
                <CodeEditor
                  value={code}
                  onChange={(newCode) => setCode(newCode || '')}
                  language="python"
                  readOnly={!isLectureActive}
                  style={{
                    height: '100%',
                    minHeight: '600px',
                    fontFamily: 'monospace',
                  }}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="h-[200px] flex flex-col">
            <CardHeader>
              <CardTitle>Terminal</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
                <Terminal output={output} error={error} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StudentView;
