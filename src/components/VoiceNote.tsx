
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface VoiceNoteProps {
  audioUrl: string;
  duration: number;
}

const VoiceNote = ({ audioUrl, duration }: VoiceNoteProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <Button
        variant="ghost"
        size="sm"
        onClick={togglePlay}
        className="h-8 w-8 p-0 bg-blue-100 hover:bg-blue-200"
      >
        {isPlaying ? (
          <VolumeX className="w-4 h-4 text-blue-600" />
        ) : (
          <Volume2 className="w-4 h-4 text-blue-600" />
        )}
      </Button>
      
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-blue-800">Voice Note</span>
          <span className="text-xs text-blue-600">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-1 mt-1">
          <div 
            className="bg-blue-500 h-1 rounded-full transition-all duration-200"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default VoiceNote;
