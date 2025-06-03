
import VoiceNote from '@/components/VoiceNote';

interface PostContentProps {
  content: string;
  voiceNote?: {
    audioUrl: string;
    duration: number;
  };
}

const PostContent = ({ content, voiceNote }: PostContentProps) => {
  return (
    <div className="space-y-3">
      <div 
        className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
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
