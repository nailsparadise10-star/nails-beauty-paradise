import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Trash2, Edit2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function StaffManager() {
  const staffQuery = trpc.staff.list.useQuery();
  const createMutation = trpc.staff.create.useMutation();
  const updateMutation = trpc.staff.update.useMutation();
  const deleteMutation = trpc.staff.delete.useMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialties: "",
    bio: "",
    imageUrl: "",
    workStartTime: "",
    workEndTime: "",
  });

  const handleOpenDialog = (staffMember?: any) => {
    if (staffMember) {
      setEditingId(staffMember.id);
      setFormData({
        name: staffMember.name,
        email: staffMember.email || "",
        phone: staffMember.phone || "",
        specialties: staffMember.specialties || "",
        bio: staffMember.bio || "",
        imageUrl: staffMember.imageUrl || "",
        workStartTime: staffMember.workStartTime || "",
        workEndTime: staffMember.workEndTime || "",
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        specialties: "",
        bio: "",
        imageUrl: "",
        workStartTime: "",
        workEndTime: "",
      });
    }
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
        toast.success("Staff member updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Staff member created successfully");
      }
      setIsOpen(false);
      staffQuery.refetch();
    } catch (error) {
      toast.error("Failed to save staff member");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Staff member deleted successfully");
        staffQuery.refetch();
      } catch (error) {
        toast.error("Failed to delete staff member");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Staff Management</CardTitle>
            <CardDescription>Manage your team members and their specialties</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Staff Member" : "Add New Staff Member"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <label className="text-sm font-medium">Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Sarah Johnson"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="sarah@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="123-456-7890"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Specialties</label>
                  <Input
                    value={formData.specialties}
                    onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                    placeholder="e.g., Manicure, Pedicure, Gel"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Bio</label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Staff member bio..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Work Start Time</label>
                    <Input
                      type="time"
                      value={formData.workStartTime}
                      onChange={(e) => setFormData({ ...formData, workStartTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Work End Time</label>
                    <Input
                      type="time"
                      value={formData.workEndTime}
                      onChange={(e) => setFormData({ ...formData, workEndTime: e.target.value })}
                    />
                  </div>
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
                  {editingId ? "Update Staff Member" : "Create Staff Member"}
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
                <th className="text-left py-3 px-4 font-semibold">Email</th>
                <th className="text-left py-3 px-4 font-semibold">Phone</th>
                <th className="text-left py-3 px-4 font-semibold">Work Hours</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffQuery.data?.map((member) => (
                <tr key={member.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">{member.name}</td>
                  <td className="py-3 px-4">{member.email || "-"}</td>
                  <td className="py-3 px-4">{member.phone || "-"}</td>
                  <td className="py-3 px-4">
                    {member.workStartTime && member.workEndTime
                      ? `${member.workStartTime} - ${member.workEndTime}`
                      : "-"}
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDialog(member)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {staffQuery.data?.length === 0 && (
            <div className="text-center py-8 text-foreground/60">
              No staff members found. Add your first team member!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
