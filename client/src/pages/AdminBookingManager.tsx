import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Trash2, Edit2, CheckCircle, Clock, Bell } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function AdminBookingManager() {
  const bookingsQuery = trpc.bookings.list.useQuery();
  const updateMutation = trpc.bookings.update.useMutation();
  const deleteMutation = trpc.bookings.delete.useMutation();
  const sendReminderMutation = trpc.reminders.sendForBooking.useMutation();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<"pending" | "confirmed" | "completed" | "cancelled">("pending");
  const [editNotes, setEditNotes] = useState("");

  const handleUpdate = async (id: number) => {
    try {
      await updateMutation.mutateAsync({ id, status: editStatus, notes: editNotes });
      toast.success("Booking updated successfully");
      setEditingId(null);
      bookingsQuery.refetch();
    } catch (error) {
      toast.error("Failed to update booking");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Booking deleted successfully");
        bookingsQuery.refetch();
      } catch (error) {
        toast.error("Failed to delete booking");
      }
    }
  };

  const handleSendReminder = async (id: number, customerEmail: string) => {
    try {
      await sendReminderMutation.mutateAsync({ bookingId: id });
      toast.success(`Reminder sent to ${customerEmail}`);
    } catch (error) {
      toast.error("Failed to send reminder email");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-600";
      case "completed":
        return "text-blue-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Management</CardTitle>
        <CardDescription>View and manage all customer bookings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-left py-3 px-4 font-semibold">Service</th>
                <th className="text-left py-3 px-4 font-semibold">Date</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookingsQuery.data?.map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">{booking.name}</td>
                  <td className="py-3 px-4">{booking.service}</td>
                  <td className="py-3 px-4">{booking.date}</td>
                  <td className={`py-3 px-4 font-semibold ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    <Dialog open={editingId === booking.id} onOpenChange={(open) => !open && setEditingId(null)}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(booking.id);
                            setEditStatus(booking.status as any);
                            setEditNotes(booking.notes || "");
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Booking</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Status</label>
                            <Select value={editStatus} onValueChange={(value: any) => setEditStatus(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Notes</label>
                            <Textarea
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              placeholder="Add notes..."
                            />
                          </div>
                          <Button onClick={() => handleUpdate(booking.id)} className="w-full">
                            Save Changes
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendReminder(booking.id, booking.email)}
                      title="Send reminder email"
                    >
                      <Bell className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(booking.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookingsQuery.data?.length === 0 && (
            <div className="text-center py-8 text-foreground/60">
              No bookings found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
