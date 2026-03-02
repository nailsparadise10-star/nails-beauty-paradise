import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Trash2, Edit2, Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function AdminBlogManager() {
  const blogQuery = trpc.blog.list.useQuery();
  const createMutation = trpc.blog.create.useMutation();
  const updateMutation = trpc.blog.update.useMutation();
  const deleteMutation = trpc.blog.delete.useMutation();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    imageUrl: "",
  });

  const handleCreate = async () => {
    if (!formData.title || !formData.slug || !formData.content) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      await createMutation.mutateAsync({
        ...formData,
        author: "Admin",
      });
      toast.success("Blog post created successfully");
      setIsCreateOpen(false);
      setFormData({ title: "", slug: "", excerpt: "", content: "", category: "", imageUrl: "" });
      blogQuery.refetch();
    } catch (error) {
      toast.error("Failed to create blog post");
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await updateMutation.mutateAsync({
        id,
        ...formData,
      });
      toast.success("Blog post updated successfully");
      setEditingId(null);
      setFormData({ title: "", slug: "", excerpt: "", content: "", category: "", imageUrl: "" });
      blogQuery.refetch();
    } catch (error) {
      toast.error("Failed to update blog post");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Blog post deleted successfully");
        blogQuery.refetch();
      } catch (error) {
        toast.error("Failed to delete blog post");
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Blog Management</CardTitle>
          <CardDescription>Create and manage blog posts</CardDescription>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Post title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Slug *</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="post-slug"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Excerpt</label>
                <Input
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Category"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Content *</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Post content"
                  rows={6}
                />
              </div>
              <Button onClick={handleCreate} className="w-full">
                Create Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {blogQuery.data?.map((post) => (
            <Card key={post.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{post.title}</h3>
                  <p className="text-sm text-foreground/60 mt-1">{post.excerpt}</p>
                  <div className="flex gap-2 mt-2">
                    {post.category && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {post.category}
                      </span>
                    )}
                    <span className="text-xs text-foreground/50">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(post.id);
                      setFormData({
                        title: post.title,
                        slug: post.slug,
                        excerpt: post.excerpt || "",
                        content: post.content,
                        category: post.category || "",
                        imageUrl: post.imageUrl || "",
                      });
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {editingId === post.id && (
                <Dialog open={editingId === post.id} onOpenChange={(open) => !open && setEditingId(null)}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit Blog Post</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Slug</label>
                        <Input
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Excerpt</label>
                        <Input
                          value={formData.excerpt}
                          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Content</label>
                        <Textarea
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          rows={6}
                        />
                      </div>
                      <Button onClick={() => handleUpdate(post.id)} className="w-full">
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </Card>
          ))}
          {blogQuery.data?.length === 0 && (
            <div className="text-center py-8 text-foreground/60">
              No blog posts found. Create your first post!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
