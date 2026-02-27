import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";

/**
 * NAILS & BEAUTY PARADISE - Booking Page
 * Design: Luxury Minimalism with Lime Green & Teal
 * Features: Service selection, date/time picker, staff selection, booking confirmation
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store booking data (in real app, send to backend)
      const bookingData = {
        ...formData,
        bookingId: `BOOK-${Date.now()}`,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };

      console.log("Booking submitted:", bookingData);

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
          <div className="w-24 h-1 lime-green-line mb-4"></div>
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
                            <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
                            <Input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="(123) 456-7890"
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
                            className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Choose a service...</option>
                            {SERVICES.map((service) => (
                              <option key={service.id} value={service.id}>
                                {service.name} - ${service.price} ({service.duration} min)
                              </option>
                            ))}
                          </select>
                        </div>

                        {selectedService && (
                          <div className="bg-primary/5 rounded-lg p-4">
                            <p className="text-sm text-foreground/70">
                              <strong>Duration:</strong> {selectedService.duration} minutes
                            </p>
                            <p className="text-sm text-foreground/70">
                              <strong>Price:</strong> ${selectedService.price}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4 elegant-text">Schedule</h3>
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
                            className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="">Select a time...</option>
                            {availableTimes.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Staff Selection */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4 elegant-text">Preferred Technician</h3>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Select Staff Member *</label>
                        <select
                          name="staff"
                          value={formData.staff}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Choose a technician...</option>
                          {STAFF.map((staff) => (
                            <option key={staff.id} value={staff.id}>
                              {staff.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4 elegant-text">Additional Notes</h3>
                      <Textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Any special requests or preferences? (Optional)"
                        className="border-border min-h-24"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary/90 text-foreground font-semibold py-6 text-lg"
                    >
                      {loading ? "Confirming..." : "Confirm Booking"}
                    </Button>
                  </form>
                </Card>
              )}
            </div>

            {/* Sidebar - Booking Info */}
            <div className="md:col-span-1">
              <Card className="p-6 bg-white border-border sticky top-24">
                <h3 className="text-lg font-semibold text-foreground mb-6 elegant-text">Booking Summary</h3>

                <div className="space-y-6">
                  {/* Service Info */}
                  {selectedService && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-primary">✓</span>
                        <p className="text-sm font-medium text-foreground">{selectedService.name}</p>
                      </div>
                      <p className="text-xs text-foreground/60 ml-6">${selectedService.price}</p>
                    </div>
                  )}

                  {/* Date & Time Info */}
                  {formData.date && (
                    <div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <p className="text-sm text-foreground">{new Date(formData.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}

                  {formData.time && (
                    <div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <p className="text-sm text-foreground">{formData.time}</p>
                      </div>
                    </div>
                  )}

                  {/* Staff Info */}
                  {formData.staff && (
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        <p className="text-sm text-foreground">
                          {STAFF.find((s) => s.id === formData.staff)?.name}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="border-t border-border pt-6">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Contact Us</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <p className="text-sm text-foreground/70">(555) 123-4567</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <p className="text-sm text-foreground/70">info@nailsbeauty.com</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-primary mt-0.5" />
                        <p className="text-sm text-foreground/70">123 Beauty Lane, City, State 12345</p>
                      </div>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="border-t border-border pt-6">
                    <h4 className="text-sm font-semibold text-foreground mb-3">Hours</h4>
                    <div className="space-y-1 text-xs text-foreground/70">
                      <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                      <p>Sat: 10:00 AM - 5:00 PM</p>
                      <p>Sun: Closed</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border py-8">
        <div className="container text-center text-foreground/60 text-sm">
          <p>&copy; 2026 NAILS & BEAUTY PARADISE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
