import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, Plus, X, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface GroupMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  services: string[];
}

interface GroupBookingFormData {
  groupName: string;
  date: string;
  time: string;
  notes: string;
  members: GroupMember[];
}

const SERVICES = [
  { id: "manicure", name: "Manicure", price: 35 },
  { id: "pedicure", name: "Pedicure", price: 45 },
  { id: "gel-manicure", name: "Gel Manicure", price: 50 },
  { id: "gel-pedicure", name: "Gel Pedicure", price: 60 },
  { id: "nail-art", name: "Nail Art Design", price: 75 },
  { id: "eyelash", name: "Eyelash Extensions", price: 100 },
  { id: "kids-nails", name: "Kids Nail Service", price: 25 },
  { id: "nail-polish", name: "Nail Polish Change", price: 15 },
];

export default function GroupBookingForm() {
  const [formData, setFormData] = useState<GroupBookingFormData>({
    groupName: "",
    date: "",
    time: "",
    notes: "",
    members: [],
  });

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const createGroupBookingMutation = trpc.groupBookings.create.useMutation();

  const today = new Date().toISOString().split("T")[0];

  const availableTimes = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM",
  ];

  const handleAddMember = () => {
    if (!newMember.name.trim()) {
      toast.error("Please enter member name");
      return;
    }
    if (!newMember.email.trim() || !newMember.email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    if (!newMember.phone.trim()) {
      toast.error("Please enter phone number");
      return;
    }

    const member: GroupMember = {
      id: `member-${Date.now()}`,
      ...newMember,
      services: [],
    };

    setFormData((prev) => ({
      ...prev,
      members: [...prev.members, member],
    }));

    setNewMember({ name: "", email: "", phone: "" });
    toast.success("Member added!");
  };

  const handleRemoveMember = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== id),
    }));
  };

  const handleToggleService = (memberId: string, serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.map((member) => {
        if (member.id === memberId) {
          const hasService = member.services.includes(serviceId);
          return {
            ...member,
            services: hasService
              ? member.services.filter((s) => s !== serviceId)
              : [...member.services, serviceId],
          };
        }
        return member;
      }),
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.groupName.trim()) {
      toast.error("Please enter group booking name");
      return false;
    }
    if (!formData.date) {
      toast.error("Please select a date");
      return false;
    }
    if (!formData.time) {
      toast.error("Please select a time");
      return false;
    }
    if (formData.members.length === 0) {
      toast.error("Please add at least one member");
      return false;
    }
    for (const member of formData.members) {
      if (member.services.length === 0) {
        toast.error(`${member.name} has no services selected`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await createGroupBookingMutation.mutateAsync({
        groupName: formData.groupName,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        members: formData.members.map((m) => ({
          name: m.name,
          email: m.email,
          phone: m.phone,
          services: m.services,
        })),
      });

      setSubmitted(true);
      toast.success("Group booking confirmed!");

      setTimeout(() => {
        setFormData({
          groupName: "",
          date: "",
          time: "",
          notes: "",
          members: [],
        });
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = formData.members.reduce((sum, member) => {
    const memberTotal = member.services.reduce((memberSum, serviceId) => {
      const service = SERVICES.find((s) => s.id === serviceId);
      return memberSum + (service?.price || 0);
    }, 0);
    return sum + memberTotal;
  }, 0);

  if (submitted) {
    return (
      <Card className="p-8 bg-white border-border text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2 elegant-text">
          Group Booking Confirmed!
        </h2>
        <p className="text-foreground/70 mb-4">
          Thank you for booking with us. Confirmation emails have been sent to all members.
        </p>
        <div className="bg-primary/10 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-foreground/70 mb-2">
            <strong>Group:</strong> {formData.groupName}
          </p>
          <p className="text-sm text-foreground/70 mb-2">
            <strong>Members:</strong> {formData.members.length}
          </p>
          <p className="text-sm text-foreground/70 mb-2">
            <strong>Date:</strong> {new Date(formData.date).toLocaleDateString()}
          </p>
          <p className="text-sm text-foreground/70">
            <strong>Time:</strong> {formData.time}
          </p>
        </div>
        <Button
          onClick={() => (window.location.href = "/")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold w-full"
        >
          Back to Home
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-white border-border">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Group Information */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground elegant-text">
              Group Booking Details
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Group Name *
              </label>
              <Input
                type="text"
                value={formData.groupName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, groupName: e.target.value }))
                }
                placeholder="e.g., Birthday Party, Office Team"
                className="border-border"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date *
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  min={today}
                  className="border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Time *
                </label>
                <select
                  value={formData.time}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, time: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-border rounded-md bg-white text-foreground"
                >
                  <option value="">Select a time</option>
                  {availableTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Additional Notes
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Any special requests or notes..."
                className="border-border"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Add Members Section */}
        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 elegant-text">
            Add Group Members
          </h3>
          <div className="bg-primary/5 rounded-lg p-4 mb-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Member Name
              </label>
              <Input
                type="text"
                value={newMember.name}
                onChange={(e) =>
                  setNewMember((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter member name"
                className="border-border"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="member@email.com"
                  className="border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone
                </label>
                <Input
                  type="tel"
                  value={newMember.phone}
                  onChange={(e) =>
                    setNewMember((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="Phone number"
                  className="border-border"
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={handleAddMember}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>

          {/* Members List */}
          {formData.members.length > 0 && (
            <div className="space-y-4">
              {formData.members.map((member) => (
                <div
                  key={member.id}
                  className="border border-border rounded-lg p-4 bg-background"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground">{member.name}</p>
                      <p className="text-sm text-foreground/70">{member.email}</p>
                      <p className="text-sm text-foreground/70">{member.phone}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Services:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {SERVICES.map((service) => (
                        <label
                          key={service.id}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={member.services.includes(service.id)}
                            onChange={() =>
                              handleToggleService(member.id, service.id)
                            }
                            className="w-4 h-4 rounded border-border cursor-pointer accent-primary"
                          />
                          <span className="text-sm text-foreground">
                            {service.name}
                            <span className="text-primary font-semibold ml-1">
                              ${service.price}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Summary */}
        {formData.members.length > 0 && (
          <div className="border-t border-border pt-6">
            <div className="bg-primary/10 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-foreground font-medium">
                  Total Members:
                </span>
                <span className="text-foreground font-semibold">
                  {formData.members.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground font-medium">Estimated Total:</span>
                <span className="text-2xl font-bold text-primary">
                  ${totalPrice}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading || formData.members.length === 0}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg"
        >
          {loading ? "Processing..." : "Confirm Group Booking"}
        </Button>
      </form>
    </Card>
  );
}
