
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Timer, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const LectureTimeManager = () => {
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(60); // Default 60 minutes
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    // Load existing lecture session
    const lectureData = localStorage.getItem('lectureSession');
    if (lectureData) {
      const session = JSON.parse(lectureData);
      if (session.isActive) {
        const now = new Date().getTime();
        const elapsed = now - new Date(session.startTime).getTime();
        const remaining = Math.max(0, session.duration * 60 * 1000 - elapsed);
        
        if (remaining > 0) {
          setIsActive(true);
          setDuration(session.duration);
          setStartTime(new Date(session.startTime));
          setTimeRemaining(Math.ceil(remaining / 1000));
        } else {
          // Session expired
          endSession();
        }
      }
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            endSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeRemaining]);

  const startSession = () => {
    const now = new Date();
    const sessionData = {
      isActive: true,
      duration,
      startTime: now.toISOString(),
      endTime: new Date(now.getTime() + duration * 60 * 1000).toISOString()
    };

    localStorage.setItem('lectureSession', JSON.stringify(sessionData));
    setIsActive(true);
    setStartTime(now);
    setTimeRemaining(duration * 60);

    toast({
      title: "Session Started",
      description: `Lecture session is now active for ${duration} minutes`
    });
  };

  const endSession = () => {
    localStorage.removeItem('lectureSession');
    setIsActive(false);
    setTimeRemaining(0);
    setStartTime(null);

    toast({
      title: "Session Ended",
      description: "Lecture session has been terminated"
    });
  };

  const pauseSession = () => {
    // For simplicity, we'll implement pause as end for now
    endSession();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Current Session Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            Session Status
          </CardTitle>
          <CardDescription>
            Current lecture session information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={isActive ? "default" : "secondary"}>
                  {isActive ? "Active" : "Inactive"}
                </Badge>
                {isActive && (
                  <Badge variant="outline">
                    {formatTime(timeRemaining)} remaining
                  </Badge>
                )}
              </div>
              
              {startTime && (
                <div className="text-sm text-muted-foreground">
                  Started at: {startTime.toLocaleString()}
                </div>
              )}
              
              {isActive && (
                <div className="text-sm text-muted-foreground">
                  Duration: {duration} minutes
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {!isActive ? (
                <Button onClick={startSession} className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Start Session
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={pauseSession} className="flex items-center gap-2">
                    <Pause className="w-4 h-4" />
                    Pause
                  </Button>
                  <Button variant="destructive" onClick={endSession} className="flex items-center gap-2">
                    <Square className="w-4 h-4" />
                    End Session
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Session Configuration
          </CardTitle>
          <CardDescription>
            Set up new lecture session parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="480"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                disabled={isActive}
                placeholder="Enter duration in minutes"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Quick Presets</Label>
              <div className="flex flex-wrap gap-2">
                {[30, 60, 90, 120].map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    size="sm"
                    onClick={() => setDuration(preset)}
                    disabled={isActive}
                  >
                    {preset}m
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {!isActive && (
            <div className="pt-4 border-t">
              <Button onClick={startSession} className="w-full sm:w-auto">
                <Play className="w-4 h-4 mr-2" />
                Start {duration} Minute Session
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
          <CardDescription>
            History of recent lecture sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Session history will be displayed here
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LectureTimeManager;
