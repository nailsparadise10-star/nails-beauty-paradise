import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Trash2, Edit2, CheckCircle, Clock, Bell, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ScheduledEmailsManager } from "./ScheduledEmailsManager";
import AppointmentCalendar from "@/components/AppointmentCalendar";

export default function AdminBookingManager() {
  const bookingsQuery = trpc.bookings.list.useQuery();
  const updateMutation = trpc.bookings.update.useMutation();
  const deleteMutation = trpc.bookings.delete.useMutation();
  const sendReminderMutation = trpc.reminders.sendForBooking.useMutation();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<"pending" | "confirmed" | "completed" | "cancelled">("pending");
  const [editNotes, setEditNotes] = useState("");
  const [expandedBookingId, setExpandedBookingId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");

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

  // Convert bookings to appointments format for calendar
  const appointments = (bookingsQuery.data || []).map((booking) => ({
    id: booking.id.toString(),
    name: booking.name,
    email: booking.email,
    phone: booking.phone,
    service: booking.service,
    date: booking.date,
    time: booking.time || "09:00 AM",
    staff: undefined,
    notes: booking.notes || undefined,
    status: booking.status as "confirmed" | "pending" | "cancelled" | "completed",
    createdAt: booking.createdAt?.toISOString() || new Date().toISOString(),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Management</CardTitle>
        <CardDescription>View and manage all customer bookings</CardDescription>
      </CardHeader>
      <CardContent>
        {/* View Mode Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setViewMode("table")}
            className={`px-4 py-2 font-semibold transition-colors ${
              viewMode === "table"
                ? "text-primary border-b-2 border-primary"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-4 py-2 font-semibold transition-colors ${
              viewMode === "calendar"
                ? "text-primary border-b-2 border-primary"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Calendar View
          </button>
        </div>

        {viewMode === "calendar" ? (
          <AppointmentCalendar
            appointments={appointments}
            onViewDetails={(appointment) => {
              // Show appointment details
              toast.info(`Viewing appointment for ${appointment.name}`);
            }}
            onEdit={(appointment) => {
              const booking = bookingsQuery.data?.find((b) => b.id.toString() === appointment.id);
              if (booking) {
                setEditingId(booking.id);
                setEditStatus(booking.status as any);
                setEditNotes(booking.notes || "");
              }
            }}
            onDelete={(appointmentId) => {
              const booking = bookingsQuery.data?.find((b) => b.id.toString() === appointmentId);
              if (booking) {
                handleDelete(booking.id);
              }
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Service</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Time</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookingsQuery.data?.map((booking) => (
                  <React.Fragment key={booking.id}>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{booking.name}</td>
                      <td className="py-3 px-4">{booking.service}</td>
                      <td className="py-3 px-4">{booking.date}</td>
                      <td className="py-3 px-4">{booking.time || "09:00 AM"}</td>
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
                          variant="outline"
                          onClick={() => setExpandedBookingId(expandedBookingId === booking.id ? null : booking.id)}
                          title="Schedule email"
                        >
                          <Clock className="w-4 h-4" />
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
                    {expandedBookingId === booking.id && (
                      <tr>
                        <td colSpan={6} className="py-4 px-4 bg-muted/30">
                          <ScheduledEmailsManager
                            bookingId={booking.id}
                            customerName={booking.name}
                            customerEmail={booking.email}
                          />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            {bookingsQuery.data?.length === 0 && (
              <div className="text-center py-8 text-foreground/60">
                No bookings found
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
