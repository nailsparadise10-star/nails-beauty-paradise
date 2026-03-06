import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Trash2, Edit2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function ServiceManager() {
  const servicesQuery = trpc.services.list.useQuery();
  const createMutation = trpc.services.create.useMutation();
  const updateMutation = trpc.services.update.useMutation();
  const deleteMutation = trpc.services.delete.useMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "",
    imageUrl: "",
  });

  const handleOpenDialog = (service?: any) => {
    if (service) {
      setEditingId(service.id);
      setFormData({
        name: service.name,
        description: service.description || "",
        price: service.price,
        duration: service.duration.toString(),
        category: service.category || "",
        imageUrl: service.imageUrl || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        duration: "",
        category: "",
        imageUrl: "",
      });
    }
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.duration) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
          duration: parseInt(formData.duration),
        });
        toast.success("Service updated successfully");
      } else {
        await createMutation.mutateAsync({
          ...formData,
          duration: parseInt(formData.duration),
        });
        toast.success("Service created successfully");
      }
      setIsOpen(false);
      servicesQuery.refetch();
    } catch (error) {
      toast.error("Failed to save service");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Service deleted successfully");
        servicesQuery.refetch();
      } catch (error) {
        toast.error("Failed to delete service");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Services Management</CardTitle>
            <CardDescription>Manage your beauty services and pricing</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Service" : "Add New Service"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Service Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Classic Manicure"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Service description..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Price *</label>
                    <Input
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g., 40"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Duration (min) *</label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g., 30"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Nails"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Image URL</label>
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <Button onClick={handleSave} className="w-full">
                  {editingId ? "Update Service" : "Create Service"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-left py-3 px-4 font-semibold">Category</th>
                <th className="text-left py-3 px-4 font-semibold">Price</th>
                <th className="text-left py-3 px-4 font-semibold">Duration</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {servicesQuery.data?.map((service) => (
                <tr key={service.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">{service.name}</td>
                  <td className="py-3 px-4">{service.category || "-"}</td>
                  <td className="py-3 px-4">${service.price}</td>
                  <td className="py-3 px-4">{service.duration} min</td>
                  <td className="py-3 px-4 space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDialog(service)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {servicesQuery.data?.length === 0 && (
            <div className="text-center py-8 text-foreground/60">
              No services found. Create your first service!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
