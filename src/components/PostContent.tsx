
import VoiceNote from '@/components/VoiceNote';
import VideoPlayer from '@/components/VideoPlayer';

interface PostContentProps {
  content: string;
  voiceNote?: {
    audioUrl: string;
    duration: number;
  };
  video?: {
    videoUrl: string;
    duration: number;
    fileName: string;
    fileSize: number;
    transcript?: string;
  };
}

const PostContent = ({ content, voiceNote, video }: PostContentProps) => {
  return (
    <div className="space-y-4">
      <div 
        className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
      {video && (
        <VideoPlayer 
          videoUrl={video.videoUrl}
          duration={video.duration}
          fileName={video.fileName}
          transcript={video.transcript}
        />
      )}
      
      {voiceNote && (
        <VoiceNote 
          audioUrl={voiceNote.audioUrl}
          duration={voiceNote.duration}
        />
      )}
    </div>
  );
};

export default PostContent;
