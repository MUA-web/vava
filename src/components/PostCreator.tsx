
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Send, Trash2, Edit, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import RichTextEditor from '@/components/RichTextEditor';
import PostContent from '@/components/PostContent';

interface Post {
  id: string;
  title: string;
  content: string;
  type: 'announcement' | 'assignment' | 'note';
  timestamp: string;
  author: string;
}

const PostCreator = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    type: 'announcement' | 'assignment' | 'note';
  }>({
    title: '',
    content: '',
    type: 'announcement'
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    const savedPosts = localStorage.getItem('teacherPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  };

  const savePosts = (updatedPosts: Post[]) => {
    localStorage.setItem('teacherPosts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const handleSubmit = (e: React.FormEvent) => {
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
      // Update existing post
      const updatedPosts = posts.map(post => 
        post.id === editingPost.id 
          ? { ...post, ...formData, timestamp: new Date().toISOString() }
          : post
      );
      savePosts(updatedPosts);
      setEditingPost(null);
      toast({
        title: "Post Updated",
        description: "Your post has been updated successfully"
      });
    } else {
      // Create new post
      const newPost: Post = {
        id: Date.now().toString(),
        ...formData,
        timestamp: new Date().toISOString(),
        author: teacher.username || 'Teacher'
      };
      
      const updatedPosts = [newPost, ...posts];
      savePosts(updatedPosts);
      toast({
        title: "Post Created",
        description: "Your post has been published successfully"
      });
    }

    setFormData({ title: '', content: '', type: 'announcement' });
    setIsCreating(false);
  };

  const handleEdit = (post: Post) => {
    setFormData({
      title: post.title,
      content: post.content,
      type: post.type
    });
    setEditingPost(post);
    setIsCreating(true);
  };

  const handleDelete = (postId: string) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    savePosts(updatedPosts);
    toast({
      title: "Post Deleted",
      description: "The post has been removed"
    });
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
