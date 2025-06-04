
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Square, Timer, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { checkLectureStatus, startLectureSession, stopLectureSession } from '@/utils/fileSystem';
import { supabase } from '@/integrations/supabase/client';

const LectureManager = () => {
  const [duration, setDuration] = useState(60);
  const [lectureStatus, setLectureStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadLectureStatus();

    // Set up real-time subscription for lecture sessions
    const channel = supabase
      .channel('lecture-status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lecture_sessions'
        },
        () => {
          loadLectureStatus(); // Reload status when changes occur
        }
      )
      .subscribe();

    const interval = setInterval(loadLectureStatus, 30000); // Check every 30 seconds

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const loadLectureStatus = async () => {
    const status = await checkLectureStatus();
    setLectureStatus(status);
  };

  const handleStartSession = async () => {
    if (!duration || duration < 1) {
      toast({
        title: "Invalid Duration",
        description: "Please enter a valid duration (minimum 1 minute)",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await startLectureSession(duration);
      toast({
        title: "Session Started",
        description: `Lecture session started for ${duration} minutes`
      });
      loadLectureStatus();
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: "Error",
        description: "Failed to start lecture session",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopSession = async () => {
    setIsLoading(true);
    try {
      await stopLectureSession();
      toast({
        title: "Session Stopped",
        description: "Lecture session has been ended"
      });
      loadLectureStatus();
    } catch (error) {
      console.error('Error stopping session:', error);
      toast({
        title: "Error",
        description: "Failed to stop lecture session",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isSessionActive = lectureStatus?.isActive;

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-600" />
            Lecture Session Control
          </CardTitle>
          <CardDescription>
            Manage your coding session timing for students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isSessionActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <div>
                <p className="font-medium">
                  Session Status: <Badge variant={isSessionActive ? "default" : "secondary"}>
                    {isSessionActive ? 'Active' : 'Inactive'}
                  </Badge>
                </p>
                {isSessionActive && lectureStatus.remainingTime && (
                  <p className="text-sm text-gray-600">
                    Time remaining: {lectureStatus.remainingTime}
                  </p>
                )}
              </div>
            </div>
            
            {isSessionActive ? (
              <Button 
                onClick={handleStopSession}
                disabled={isLoading}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop Session
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="duration" className="text-sm font-medium">
                    Duration (min):
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                    min="1"
                    max="480"
                    className="w-20 h-8"
                  />
                </div>
                <Button 
                  onClick={handleStartSession}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Session
                </Button>
              </div>
            )}
          </div>

          {/* Session Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Timer className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Session Duration</p>
                  <p className="text-lg font-bold text-gray-900">
                    {isSessionActive ? `${duration} min` : 'Not set'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Time Remaining</p>
                  <p className="text-lg font-bold text-gray-900">
                    {isSessionActive ? lectureStatus.remainingTime || 'Calculating...' : '--'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Student Access</p>
                  <p className="text-lg font-bold text-gray-900">
                    {isSessionActive ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Start a session to allow students to run Python code</li>
              <li>• Students can only execute code during active sessions</li>
              <li>• Sessions automatically end when the timer expires</li>
              <li>• All student submissions are tracked in real-time</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LectureManager;
