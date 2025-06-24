import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Send, Trash2, Edit, MessageSquare, Code } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import RichTextEditor from '@/components/RichTextEditor';
import PostContent from '@/components/PostContent';
import VoiceRecorder from '@/components/VoiceRecorder';
import VoiceNote from '@/components/VoiceNote';
import CodeEditor from '@/components/CodeEditor';
import { getTeacherPosts, saveTeacherPost } from '@/utils/fileSystem';
import { supabase } from '@/integrations/supabase/client';
import VideoUpload from '@/components/VideoUpload';

interface VoiceNoteData {
  audioUrl: string;
  duration: number;
}

interface VideoData {
  videoUrl: string;
  duration: number;
  fileName: string;
  fileSize: number;
  transcript?: string;
}

interface CodeData {
  code: string;
  language: 'python' | 'javascript' | 'html' | 'css';
  description?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  type: 'announcement' | 'assignment' | 'note' | 'code';
  timestamp: string;
  author: string;
  voiceNote?: VoiceNoteData;
  video?: VideoData;
  code?: CodeData;
}

const PostCreator = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    type: 'announcement' | 'assignment' | 'note' | 'code';
    voiceNote?: VoiceNoteData;
    video?: VideoData;
    code?: CodeData;
  }>({
    title: '',
    content: '',
    type: 'announcement'
  });

  useEffect(() => {
    loadPosts();

    // Set up real-time subscription for posts
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        () => {
          loadPosts(); // Reload posts when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadPosts = async () => {
    const fetchedPosts = await getTeacherPosts();
    // Type cast the posts to ensure proper TypeScript typing
    const typedPosts: Post[] = fetchedPosts.map(post => ({
      ...post,
      type: post.type as 'announcement' | 'assignment' | 'note' | 'code'
    }));
    setPosts(typedPosts);
  };

  const handleVoiceNote = (audioBlob: Blob, duration: number) => {
    // Convert blob to data URL for storage
    const reader = new FileReader();
    reader.onload = () => {
      const audioUrl = reader.result as string;
      setFormData(prev => ({
        ...prev,
        voiceNote: { audioUrl, duration }
      }));
    };
    reader.readAsDataURL(audioBlob);
  };

  const handleVideoUpload = (videoData: VideoData) => {
    setFormData(prev => ({
      ...prev,
      video: videoData
    }));
  };

  const handleCodeChange = (code: string) => {
    setFormData(prev => ({
      ...prev,
      code: {
        code,
        language: 'python',
        description: prev.code?.description || ''
      }
    }));
  };

  const removeVoiceNote = () => {
    setFormData(prev => {
      const { voiceNote, ...rest } = prev;
      return rest;
    });
  };

  const removeVideo = () => {
    setFormData(prev => {
      const { video, ...rest } = prev;
      return rest;
    });
  };

  const removeCode = () => {
    setFormData(prev => {
      const { code, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your post",
        variant: "destructive"
      });
      return;
    }

    if (formData.type === 'code' && (!formData.code?.code || !formData.code.code.trim())) {
      toast({
        title: "Error",
        description: "Please enter some code for your code example",
        variant: "destructive"
      });
      return;
    }

    try {
      const teacher = await supabase.auth.getUser();
      
      const postData = {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        author: teacher.data.user?.user_metadata?.name || teacher.data.user?.email || 'Teacher',
        voice_note_url: formData.voiceNote?.audioUrl || null,
        voice_note_duration: formData.voiceNote?.duration || null,
        video_url: formData.video?.videoUrl || null,
        video_duration: formData.video?.duration || null,
        video_filename: formData.video?.fileName || null,
        video_filesize: formData.video?.fileSize || null,
        video_transcript: formData.video?.transcript || null,
        code_content: formData.code?.code || null,
        code_language: formData.code?.language || null,
        code_description: formData.code?.description || null,
      };

      if (editingPost) {
        // Update existing post in Supabase
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', editingPost.id);

        if (error) throw error;

        toast({
          title: "Post Updated",
          description: "Your post has been updated successfully"
        });
      } else {
        // Create new post in Supabase
        // Note: saveTeacherPost expects a slightly different object structure
        const newPost = {
          title: formData.title,
          content: formData.content,
          type: formData.type,
          author: teacher.data.user?.user_metadata?.name || teacher.data.user?.email || 'Teacher',
          voiceNote: formData.voiceNote,
          video: formData.video,
          code: formData.code
        };
        await saveTeacherPost(newPost);
        toast({
          title: "Post Created",
          description: "Your post has been published successfully"
        });
      }

      setFormData({ title: '', content: '', type: 'announcement' });
      setIsCreating(false);
      setEditingPost(null);
      loadPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "Error",
        description: "Failed to save post. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (post: Post) => {
    setFormData({
      title: post.title,
      content: post.content,
      type: post.type,
      voiceNote: post.voiceNote,
      video: post.video,
      code: post.code
    });
    setEditingPost(post);
    setIsCreating(true);
  };

  const handleDelete = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Post Deleted",
        description: "The post has been removed"
      });
      loadPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      });
    }
  };

  const cancelEdit = () => {
    setFormData({ title: '', content: '', type: 'announcement' });
    setEditingPost(null);
    setIsCreating(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'announcement':
        return 'bg-blue-100 text-blue-800';
      case 'assignment':
        return 'bg-green-100 text-green-800';
      case 'note':
        return 'bg-purple-100 text-purple-800';
      case 'code':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Create/Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </span>
            {!isCreating && (
              <Button onClick={() => setIsCreating(true)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            )}
          </CardTitle>
          <CardDescription>
            {editingPost ? 'Update your existing post' : 'Create announcements, assignments, notes, or code examples for students'}
          </CardDescription>
        </CardHeader>
        
        {isCreating && (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter post title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Select post type"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="assignment">Assignment</option>
                    <option value="note">Note</option>
                    <option value="code">Code Example</option>
                  </select>
                </div>
              </div>

              {/* Code Editor Section */}
              {formData.type === 'code' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Code Example
                    </Label>
                    {formData.code && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeCode}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove Code
                      </Button>
                    )}
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <CodeEditor
                      value={formData.code?.code || ''}
                      onChange={handleCodeChange}
                      language="python"
                      showToolbar={true}
                      placeholder="Write your Python code example here..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="code-description">Code Description (Optional)</Label>
                    <Input
                      id="code-description"
                      value={formData.code?.description || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        code: {
                          ...prev.code!,
                          description: e.target.value
                        }
                      }))}
                      placeholder="Explain what this code does..."
                    />
                  </div>
                </div>
              )}

              {/* Rich Text Content (for non-code posts or additional content) */}
              {formData.type !== 'code' && (
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                    placeholder="Write your post content here..."
                  />
                </div>
              )}

              {/* Video Upload Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Video Attachment (Optional)</Label>
                  {formData.video && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeVideo}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove Video
                    </Button>
                  )}
                </div>
                
                <VideoUpload 
                  onVideoUpload={handleVideoUpload}
                  existingVideo={formData.video}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Voice Note (Optional)</Label>
                  {formData.voiceNote && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeVoiceNote}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
                
                {formData.voiceNote ? (
                  <VoiceNote 
                    audioUrl={formData.voiceNote.audioUrl}
                    duration={formData.voiceNote.duration}
                  />
                ) : (
                  <VoiceRecorder onVoiceNote={handleVoiceNote} />
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  <Send className="w-4 h-4 mr-2" />
                  {editingPost ? 'Update Post' : 'Publish Post'}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>Published Posts</CardTitle>
          <CardDescription>
            Manage your announcements and posts ({posts.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No posts created yet. Click "New Post" to get started.
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getTypeColor(post.type)}>
                            {post.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(post.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(post)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    
                    {/* Code Display */}
                    {post.type === 'code' && post.code && (
                      <div className="mb-4">
                        <div className="border rounded-lg overflow-hidden">
                          <CodeEditor
                            value={post.code.code}
                            onChange={() => {}} // Read-only
                            disabled={true}
                            showToolbar={false}
                          />
                        </div>
                        {post.code.description && (
                          <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {post.code.description}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <PostContent 
                      content={post.content} 
                      voiceNote={post.voiceNote}
                      video={post.video}
                    />
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostCreator;
