
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Send, Trash2, Edit, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import RichTextEditor from '@/components/RichTextEditor';
import PostContent from '@/components/PostContent';
import VoiceRecorder from '@/components/VoiceRecorder';
import VoiceNote from '@/components/VoiceNote';
import { getTeacherPosts, saveTeacherPost } from '@/utils/fileSystem';
import { supabase } from '@/integrations/supabase/client';

interface VoiceNoteData {
  audioUrl: string;
  duration: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  type: 'announcement' | 'assignment' | 'note';
  timestamp: string;
  author: string;
  voiceNote?: VoiceNoteData;
}

const PostCreator = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    type: 'announcement' | 'assignment' | 'note';
    voiceNote?: VoiceNoteData;
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
    setPosts(fetchedPosts);
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

  const removeVoiceNote = () => {
    setFormData(prev => {
      const { voiceNote, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content",
        variant: "destructive"
      });
      return;
    }

    const teacher = JSON.parse(localStorage.getItem('currentTeacher') || '{}');
    
    if (editingPost) {
      // Update existing post in Supabase
      try {
        const { error } = await supabase
          .from('posts')
          .update({
            title: formData.title,
            content: formData.content,
            type: formData.type,
            voice_note_url: formData.voiceNote?.audioUrl,
            voice_note_duration: formData.voiceNote?.duration,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingPost.id);

        if (error) throw error;

        setEditingPost(null);
        toast({
          title: "Post Updated",
          description: "Your post has been updated successfully"
        });
      } catch (error) {
        console.error('Error updating post:', error);
        toast({
          title: "Error",
          description: "Failed to update post",
          variant: "destructive"
        });
      }
    } else {
      // Create new post in Supabase
      const newPost = {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        author: teacher.username || 'Teacher',
        voiceNote: formData.voiceNote
      };
      
      await saveTeacherPost(newPost);
      toast({
        title: "Post Created",
        description: "Your post has been published successfully"
      });
    }

    setFormData({ title: '', content: '', type: 'announcement' });
    setIsCreating(false);
    loadPosts(); // Refresh the posts list
  };

  const handleEdit = (post: Post) => {
    setFormData({
      title: post.title,
      content: post.content,
      type: post.type,
      voiceNote: post.voiceNote
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
            {editingPost ? 'Update your existing post' : 'Create announcements, assignments, or notes for students'}
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
                  >
                    <option value="announcement">Announcement</option>
                    <option value="assignment">Assignment</option>
                    <option value="note">Note</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  placeholder="Write your post content here..."
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
                    
                    <PostContent content={post.content} />
                    
                    {post.voiceNote && (
                      <div className="mt-3">
                        <VoiceNote 
                          audioUrl={post.voiceNote.audioUrl}
                          duration={post.voiceNote.duration}
                        />
                      </div>
                    )}
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
