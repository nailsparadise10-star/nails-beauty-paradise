import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Clock, X, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ScheduledEmailsManagerProps {
  bookingId: number;
  customerName: string;
  customerEmail: string;
}

export function ScheduledEmailsManager({ bookingId, customerName, customerEmail }: ScheduledEmailsManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  const scheduledEmailsQuery = trpc.scheduledEmails.getByBookingId.useQuery({ bookingId });
  const scheduleEmailMutation = trpc.scheduledEmails.schedule.useMutation();
  const cancelEmailMutation = trpc.scheduledEmails.cancel.useMutation();

  const handleScheduleEmail = async () => {
    if (!subject.trim() || !message.trim() || !scheduledAt) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await scheduleEmailMutation.mutateAsync({
        bookingId,
        subject,
        message,
        scheduledAt: new Date(scheduledAt),
      });
      toast.success("Email scheduled successfully");
      setSubject("");
      setMessage("");
      setScheduledAt("");
      setIsOpen(false);
      scheduledEmailsQuery.refetch();
    } catch (error) {
      toast.error("Failed to schedule email");
    }
  };

  const handleCancelScheduled = async (id: number) => {
    try {
      await cancelEmailMutation.mutateAsync({ id });
      toast.success("Email scheduling cancelled");
      scheduledEmailsQuery.refetch();
    } catch (error) {
      toast.error("Failed to cancel email");
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Scheduled Emails
        </CardTitle>
        <CardDescription>Schedule custom emails to be sent at a specific time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">Schedule New Email</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule Email for {customerName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Email message..."
                  rows={6}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Schedule Date & Time</label>
                <Input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
              </div>
              <Button onClick={handleScheduleEmail} className="w-full">
                Schedule Email
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {scheduledEmailsQuery.data && scheduledEmailsQuery.data.length > 0 ? (
          <div className="space-y-2">
            {scheduledEmailsQuery.data.map((scheduled) => (
              <div
                key={scheduled.id}
                className="flex items-start justify-between p-3 border rounded-lg bg-muted/50"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{scheduled.subject}</p>
                  <p className="text-xs text-foreground/60 mt-1">{scheduled.message.substring(0, 100)}...</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      scheduled.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                      scheduled.status === "sent" ? "bg-green-100 text-green-800" :
                      scheduled.status === "failed" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {scheduled.status}
                    </span>
                    <span className="text-xs text-foreground/60">
                      {new Date(scheduled.scheduledAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                {scheduled.status === "pending" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCancelScheduled(scheduled.id)}
                    className="ml-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-foreground/60 text-center py-4">No scheduled emails yet</p>
        )}
      </CardContent>
    </Card>
  );
}
