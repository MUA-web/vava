import VoiceNote from '@/components/VoiceNote';
import VideoPlayer from '@/components/VideoPlayer';
import CodeEditor from '@/components/CodeEditor';

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
  code?: {
    code: string;
    language: 'python' | 'javascript' | 'html' | 'css';
    description?: string;
  };
}

const PostContent = ({ content, voiceNote, video, code }: PostContentProps) => {
  return (
    <div className="space-y-4">
      {/* Code Display */}
      {code && (
        <div className="space-y-3">
          <div className="border rounded-lg overflow-hidden">
            <CodeEditor
              value={code.code}
              onChange={() => {}} // Read-only
              disabled={true}
              language={code.language}
              showToolbar={false}
            />
          </div>
          {code.description && (
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {code.description}
            </p>
          )}
        </div>
      )}
      
      {/* Rich Text Content */}
      {content && (
        <div 
          className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
      
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
