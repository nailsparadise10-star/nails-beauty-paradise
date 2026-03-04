import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

/**
 * NAILS & BEAUTY PARADISE - Booking Page
 * Design: Luxury Minimalism with Teal & Gold
 * Features: Service selection, date/time picker, staff selection, booking confirmation
 * Now saves bookings to database via tRPC API
 */

const SERVICES = [
  { id: "manicure", name: "Manicure", duration: 45, price: 35 },
  { id: "pedicure", name: "Pedicure", duration: 60, price: 45 },
  { id: "gel-manicure", name: "Gel Manicure", duration: 60, price: 50 },
  { id: "gel-pedicure", name: "Gel Pedicure", duration: 75, price: 60 },
  { id: "nail-art", name: "Nail Art Design", duration: 90, price: 75 },
  { id: "eyelash", name: "Eyelash Extensions", duration: 120, price: 100 },
  { id: "kids-nails", name: "Kids Nail Service", duration: 30, price: 25 },
  { id: "nail-polish", name: "Nail Polish Change", duration: 20, price: 15 },
];

const STAFF = [
  { id: "staff-1", name: "Sarah Johnson", specialties: ["Manicure", "Pedicure", "Gel Polish"] },
  { id: "staff-2", name: "Emily Chen", specialties: ["Nail Art", "Gel Manicure", "Eyelash Extensions"] },
  { id: "staff-3", name: "Maria Garcia", specialties: ["Pedicure", "Kids Nails", "Gel Pedicure"] },
  { id: "staff-4", name: "Jessica Lee", specialties: ["Eyelash Extensions", "Nail Art", "Manicure"] },
];

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  staff: string;
  notes: string;
}

export default function Booking() {
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    staff: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const createBookingMutation = trpc.bookings.create.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    if (!formData.service) {
      toast.error("Please select a service");
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
    if (!formData.staff) {
      toast.error("Please select a staff member");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Call tRPC API to save booking to database
      await createBookingMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
      });

      setSubmitted(true);
      toast.success("Booking confirmed! We'll send you a confirmation email shortly.");

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          date: "",
          time: "",
          staff: "",
          notes: "",
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

  const selectedService = SERVICES.find((s) => s.id === formData.service);
  const availableTimes = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
  ];

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <button
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer bg-none border-none p-0"
          >
            <span className="text-2xl">✨</span>
            <h1 className="text-2xl font-bold text-foreground elegant-text">
              NAILS & BEAUTY PARADISE
            </h1>
          </button>
          <nav className="hidden md:flex gap-8">
            <button
              onClick={() => (window.location.href = "/")}
              className="text-foreground hover:text-primary transition-colors cursor-pointer bg-none border-none p-0"
            >
              Home
            </button>
            <button
              onClick={() => (window.location.href = "/services")}
              className="text-foreground hover:text-primary transition-colors cursor-pointer bg-none border-none p-0"
            >
              Services
            </button>
            <button
              onClick={() => (window.location.href = "/nail-designer")}
              className="text-foreground hover:text-primary transition-colors cursor-pointer bg-none border-none p-0"
            >
              Designer
            </button>
            <button
              onClick={() => (window.location.href = "/blog")}
              className="text-foreground hover:text-primary transition-colors cursor-pointer bg-none border-none p-0"
            >
              Blog
            </button>
            <span className="text-primary font-semibold">Booking</span>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
        <div className="container">
          <h1 className="text-4xl font-bold mb-2 elegant-text text-foreground">Book Your Appointment</h1>
          <div className="w-24 h-1 teal-gold-line mb-4"></div>
          <p className="text-lg text-foreground/70">
            Reserve your spot with our expert nail technicians and beauty specialists
          </p>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-16 bg-background">
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Form */}
            <div className="md:col-span-2">
              {submitted ? (
                <Card className="p-8 bg-white border-border text-center">
                  <div className="flex justify-center mb-4">
                    <CheckCircle className="w-16 h-16 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2 elegant-text">Booking Confirmed!</h2>
                  <p className="text-foreground/70 mb-4">
                    Thank you for booking with us. A confirmation email has been sent to {formData.email}
                  </p>
                  <div className="bg-primary/5 rounded-lg p-4 mb-6 text-left">
                    <p className="text-sm text-foreground/70 mb-2">
                      <strong>Service:</strong> {selectedService?.name}
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
                    className="bg-primary hover:bg-primary/90 text-foreground font-semibold w-full"
                  >
                    Back to Home
                  </Button>
                </Card>
              ) : (
                <Card className="p-8 bg-white border-border">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4 elegant-text">Your Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                          <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            className="border-border"
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                            <Input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="your@email.com"
                              className="border-border"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Phone *</label>
                            <Input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="+61 434 188 999"
                              className="border-border"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Service Selection */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4 elegant-text">Service Details</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Select Service *</label>
                          <select
                            name="service"
                            value={formData.service}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Choose a service...</option>
                            {SERVICES.map((service) => (
                              <option key={service.id} value={service.id}>
                                {service.name} - ${service.price} ({service.duration} min)
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Date *</label>
                            <Input
                              type="date"
                              name="date"
                              value={formData.date}
                              onChange={handleInputChange}
                              min={today}
                              className="border-border"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Time *</label>
                            <select
                              name="time"
                              value={formData.time}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option value="">Select time...</option>
                              {availableTimes.map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Staff Selection */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Preferred Staff Member *</label>
                      <select
                        name="staff"
                        value={formData.staff}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Choose a staff member...</option>
                        {STAFF.map((staff) => (
                          <option key={staff.id} value={staff.id}>
                            {staff.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Special Requests (Optional)</label>
                      <Textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Any special requests or preferences..."
                        className="border-border"
                        rows={4}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary/90 text-foreground font-semibold py-3"
                    >
                      {loading ? "Processing..." : "Confirm Booking"}
                    </Button>
                  </form>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card className="p-6 bg-white border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4 elegant-text">Contact Us</h3>
                <div className="space-y-4 text-sm text-foreground/70">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Phone</p>
                      <p>+61 434 188 999</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <p>suport@nailsparadise.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Location</p>
                      <p>49 Vulture Street, West End, QLD 4101, Australia</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Hours */}
              <Card className="p-6 bg-white border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4 elegant-text">Hours</h3>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li>Sun: 10:00am - 4:00pm</li>
                  <li>Mon-Sat: 8:30am - 9:30pm</li>
                </ul>
              </Card>

              {/* Service Info */}
              {selectedService && (
                <Card className="p-6 bg-primary/5 border border-primary/20">
                  <h3 className="text-lg font-semibold text-foreground mb-4 elegant-text">Service Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Service:</span>
                      <span className="font-medium text-foreground">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Duration:</span>
                      <span className="font-medium text-foreground">{selectedService.duration} minutes</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-primary/20">
                      <span className="text-foreground/70">Price:</span>
                      <span className="font-bold text-primary">${selectedService.price}</span>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
