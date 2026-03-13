import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Mail, Phone, MapPin, CheckCircle, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import GroupBookingForm from "@/components/GroupBookingForm";
import AppointmentSummary, { AppointmentService } from "@/components/AppointmentSummary";

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
  { id: "pedicure-manicure", name: "Pedicure & Manicure", duration: 90, price: 79 },
  { id: "classic-manicure", name: "Classic Manicure", duration: 30, price: 40 },
  { id: "eyebrows-wax", name: "Eyebrows Wax", duration: 15, price: 40 },
  { id: "kid-pedicure", name: "Kid Pedicure", duration: 30, price: 40 },
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
  const [bookingType, setBookingType] = useState<"individual" | "group">("individual");
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
  const [selectedServices, setSelectedServices] = useState<AppointmentService[]>([]);
  const createBookingMutation = trpc.bookings.create.useMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle adding service to appointment
  const handleAddService = () => {
    if (!formData.service) {
      toast.error("Please select a service");
      return;
    }

    const service = SERVICES.find((s) => s.id === formData.service);
    if (!service) return;

    const newService: AppointmentService = {
      id: `${formData.service}-${Date.now()}`,
      name: service.name,
      duration: service.duration,
      price: service.price,
      staff: formData.staff ? STAFF.find((s) => s.id === formData.staff)?.name : undefined,
      location: "49 Vulture Street, West End, QLD 4101",
    };

    setSelectedServices([...selectedServices, newService]);
    setFormData((prev) => ({
      ...prev,
      service: "",
      staff: "",
    }));
    toast.success(`${service.name} added to appointment`);
  };

  // Handle removing service
  const handleRemoveService = (id: string) => {
    setSelectedServices(selectedServices.filter((s) => s.id !== id));
    toast.success("Service removed from appointment");
  };

  // Handle editing service
  const handleEditService = (id: string) => {
    const service = selectedServices.find((s) => s.id === id);
    if (!service) return;

    const originalService = SERVICES.find((s) => s.name === service.name);
    if (originalService) {
      setFormData((prev) => ({
        ...prev,
        service: originalService.id,
        staff: STAFF.find((s) => s.name === service.staff)?.id || "",
      }));
      handleRemoveService(id);
    }
  };

  // Handle schedule appointment
  const handleScheduleAppointment = async () => {
    if (selectedServices.length === 0) {
      toast.error("Please add at least one service");
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.date || !formData.time) {
      toast.error("Please fill in all required information");
      return;
    }

    setLoading(true);
    try {
      await createBookingMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: selectedServices.map((s) => s.name).join(", "),
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
      });

      setSubmitted(true);
      toast.success("Appointment scheduled! Confirmation email sent.");

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
        setSelectedServices([]);
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to schedule appointment. Please try again.");
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
            <span className="text-2xl"></span>
            <h1 className="text-2xl font-bold text-foreground elegant-text">
             
            </h1>
          </button>
<a href="https://share.google/Dqa79IOkH8TL4Tk2s" className="text-foreground hover:text-primary transition-colors">49 Vulture Street, West End, QLD 4101, Australia</a>
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
              onClick={() => (window.location.href = "/blog")}
              className="text-foreground hover:text-primary transition-colors cursor-pointer bg-none border-none p-0"
            >
              Blog
            </button>
             <button
              onClick={() => (window.location.href = "/GiftCard")}
              className="text-foreground hover:text-primary transition-colors cursor-pointer bg-none border-none p-0"
            >
              Gift Card
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
        <div className="container max-w-6xl">
          {/* Booking Type Tabs */}
          <div className="flex gap-4 mb-8 border-b border-border">
            <button
              onClick={() => setBookingType("individual")}
              className={`px-6 py-3 font-semibold transition-colors ${
                bookingType === "individual"
                  ? "text-primary border-b-2 border-primary"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Individual Booking
            </button>
            <button
              onClick={() => setBookingType("group")}
              className={`px-6 py-3 font-semibold transition-colors ${
                bookingType === "group"
                  ? "text-primary border-b-2 border-primary"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Group Booking
            </button>
          </div>

          {bookingType === "group" ? (
            <GroupBookingForm />
          ) : (
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
                        <strong>Services:</strong> {selectedServices.map((s) => s.name).join(", ")}
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
                    <form className="space-y-6">
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
                        <h3 className="text-lg font-semibold text-foreground mb-4 elegant-text">Add Services</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Select Service</label>
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

                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Staff Member (Optional)</label>
                            <select
                              name="staff"
                              value={formData.staff}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option value="">Any staff member</option>
                              {STAFF.map((member) => (
                                <option key={member.id} value={member.id}>
                                  {member.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <Button
                            type="button"
                            onClick={handleAddService}
                            className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold"
                          >
                            Add Service
                          </Button>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4 elegant-text">Appointment Date & Time</h3>
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
                    </form>
                  </Card>
                )}
              </div>

              {/* Sidebar - Appointment Summary */}
              <div className="space-y-6">
                <AppointmentSummary
                  services={selectedServices}
                  onAddService={handleAddService}
                  onEditService={handleEditService}
                  onRemoveService={handleRemoveService}
                  onSchedule={handleScheduleAppointment}
                  isLoading={loading}
                />

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
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
