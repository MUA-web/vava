
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, Video, Trash2, Play, Pause, Volume2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VideoData {
  videoUrl: string;
  duration: number;
  fileName: string;
  fileSize: number;
  transcript?: string;
}

interface VideoUploadProps {
  onVideoUpload: (videoData: VideoData) => void;
  existingVideo?: VideoData;
}

const VideoUpload = ({ onVideoUpload, existingVideo }: VideoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a video file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select a video file smaller than 100MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Convert file to data URL for storage
      const reader = new FileReader();
      reader.onload = async () => {
        const videoUrl = reader.result as string;
        
        // Create video element to get duration
        const video = document.createElement('video');
        video.src = videoUrl;
        
        video.onloadedmetadata = () => {
          const videoData: VideoData = {
            videoUrl,
            duration: video.duration,
            fileName: file.name,
            fileSize: file.size,
            transcript: "Video transcript will be generated automatically..." // Placeholder
          };

          clearInterval(progressInterval);
          setUploadProgress(100);
          
          setTimeout(() => {
            onVideoUpload(videoData);
            setIsUploading(false);
            setUploadProgress(0);
            
            toast({
              title: "Video uploaded",
              description: "Video has been uploaded successfully"
            });
          }, 500);
        };
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading video:', error);
      setIsUploading(false);
      setUploadProgress(0);
      toast({
        title: "Upload failed",
        description: "Failed to upload video. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (existingVideo) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Uploaded Video</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onVideoUpload(undefined as any)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
            
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                src={existingVideo.videoUrl}
                className="w-full max-h-64 object-contain"
                onEnded={() => setIsPlaying(false)}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={handlePlayPause}
                  className="bg-black/50 hover:bg-black/70"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{existingVideo.fileName}</span>
              <span>{formatFileSize(existingVideo.fileSize)}</span>
              <span>{formatDuration(existingVideo.duration)}</span>
            </div>

            {existingVideo.transcript && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Auto-generated Transcript</Label>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  {existingVideo.transcript}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          <Label className="text-sm font-medium">Upload Video</Label>
          
          {isUploading ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-blue-600" />
                <span className="text-sm">Uploading video...</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 text-center">
                {uploadProgress}% complete
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="space-y-3">
                <Video className="w-8 h-8 text-gray-400 mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Upload a video file</p>
                  <p className="text-xs text-gray-500">
                    Supports MP4, WebM, MOV files up to 100MB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Video
                </Button>
              </div>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoUpload;
