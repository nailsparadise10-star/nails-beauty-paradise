import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Heart, Users, Brush, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

/**
 * NAILS & BEAUTY PARADISE - Home Page
 * Design: Luxury Minimalism with Warm Elegance
 * Color Palette: Rose Gold (#D4A5A5), Cream (#F5F1ED), Warm Neutrals
 * Typography: Playfair Display (serif) for headings, Lato for body
 */

export default function Home() {
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    message: "",
  });

  const handleBookingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Booking submitted:", bookingForm);
    alert("Thank you for your booking request! We will contact you soon.");
    setBookingForm({
      name: "",
      email: "",
      phone: "",
      service: "",
      date: "",
      message: "",
    });
  };

  const services = [
    {
      id: 1,
      name: "Manicure",
      description: "Professional nail care and polish application for hands",
      icon: "💅",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663388595337/XQ5oNXoz9gDgsidXKiHTe5/hero-nails-manicure-Deb2tvFehdgUPe2RhGhPKy.webp",
    },
    {
      id: 2,
      name: "Pedicure",
      description: "Luxurious foot care and nail polish treatment",
      icon: "🦶",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663388595337/XQ5oNXoz9gDgsidXKiHTe5/pedicure-service-aNsb8YLzdk4aGG6au6PNAm.webp",
    },
    {
      id: 3,
      name: "Kids Services",
      description: "Fun and safe nail services designed for children",
      icon: "👧",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663388595337/XQ5oNXoz9gDgsidXKiHTe5/kids-nail-service-U3ewMkXhRyKfNgpJFoVyMh.webp",
    },
    {
      id: 4,
      name: "Eyelash Extensions",
      description: "Beautiful and long-lasting eyelash enhancement",
      icon: "✨",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663388595337/XQ5oNXoz9gDgsidXKiHTe5/eyelash-extensions-3xPLDDJQAbEFTSjKaM2AsC.webp",
    },
    {
      id: 5,
      name: "Nail Art & Design",
      description: "Custom nail designs and artistic nail painting",
      icon: "🎨",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663388595337/XQ5oNXoz9gDgsidXKiHTe5/hero-nails-manicure-Deb2tvFehdgUPe2RhGhPKy.webp",
    },
    {
      id: 6,
      name: "Gel Polish",
      description: "Long-lasting gel nail polish with professional finish",
      icon: "💎",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663388595337/XQ5oNXoz9gDgsidXKiHTe5/pedicure-service-aNsb8YLzdk4aGG6au6PNAm.webp",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground elegant-text">
              NAILS & BEAUTY PARADISE
            </h1>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#services" className="text-foreground hover:text-primary transition-colors">
              Services
            </a>
            <a href="#gallery" className="text-foreground hover:text-primary transition-colors">
              Gallery
            </a>
            <a href="#booking" className="text-foreground hover:text-primary transition-colors">
              Booking
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden bg-gradient-to-b from-secondary to-background">
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663388595337/XQ5oNXoz9gDgsidXKiHTe5/hero-nails-manicure-Deb2tvFehdgUPe2RhGhPKy.webp"
            alt="Hero"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/80 to-transparent"></div>
        </div>

        <div className="relative container h-full flex flex-col justify-center">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 elegant-text leading-tight">
              Welcome to Your Beauty Sanctuary
            </h2>
            <p className="text-xl text-foreground/80 mb-8 max-w-xl">
              Experience luxury nail and beauty services in a warm, welcoming environment. From manicures to eyelash extensions, we offer premium care for all ages.
            </p>
            <div className="flex gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white rounded-lg transition-all hover:luxury-shadow"
              >
                Book Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10 rounded-lg"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16 elegant-text text-foreground">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Premium Quality",
                description: "We use only the finest products and techniques for exceptional results",
              },
              {
                icon: Users,
                title: "Expert Team",
                description: "Our experienced professionals are dedicated to your satisfaction",
              },
              {
                icon: Brush,
                title: "Personalized Service",
                description: "Every client receives customized care tailored to their needs",
              },
            ].map((item, idx) => (
              <Card
                key={idx}
                className="p-8 text-center border-border hover:luxury-shadow transition-all duration-300 bg-white"
              >
                <item.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-3 elegant-text text-foreground">
                  {item.title}
                </h3>
                <p className="text-foreground/70">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-secondary/50">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-4 elegant-text text-foreground">
            Our Services
          </h2>
          <div className="w-24 h-1 rose-gold-line mx-auto mb-16"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card
                key={service.id}
                className="overflow-hidden hover:luxury-shadow transition-all duration-300 bg-white border-border group cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-6">
                  <div className="text-3xl mb-3">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 elegant-text text-foreground">
                    {service.name}
                  </h3>
                  <p className="text-foreground/70 text-sm mb-4">{service.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-primary text-primary hover:bg-primary/10"
                  >
                    Learn More
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-background">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-4 elegant-text text-foreground">
            Our Work
          </h2>
          <div className="w-24 h-1 rose-gold-line mx-auto mb-16"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="relative h-64 rounded-lg overflow-hidden group cursor-pointer"
              >
                <img
                  src={services[item % services.length].image}
                  alt={`Gallery ${item}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-20 bg-secondary/50">
        <div className="container max-w-2xl">
          <h2 className="text-4xl font-bold text-center mb-4 elegant-text text-foreground">
            Book Your Appointment
          </h2>
          <div className="w-24 h-1 rose-gold-line mx-auto mb-12"></div>

          <Card className="p-8 bg-white border-border">
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={bookingForm.name}
                    onChange={handleBookingChange}
                    placeholder="Your name"
                    required
                    className="border-border focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={bookingForm.email}
                    onChange={handleBookingChange}
                    placeholder="your@email.com"
                    required
                    className="border-border focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={bookingForm.phone}
                    onChange={handleBookingChange}
                    placeholder="Your phone number"
                    required
                    className="border-border focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Service
                  </label>
                  <select
                    name="service"
                    value={bookingForm.service}
                    onChange={handleBookingChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white text-foreground"
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.name}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Preferred Date
                </label>
                <Input
                  type="date"
                  name="date"
                  value={bookingForm.date}
                  onChange={handleBookingChange}
                  required
                  className="border-border focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Additional Notes
                </label>
                <Textarea
                  name="message"
                  value={bookingForm.message}
                  onChange={handleBookingChange}
                  placeholder="Any special requests or preferences?"
                  rows={4}
                  className="border-border focus:border-primary focus:ring-primary"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg transition-all"
              >
                Confirm Booking
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-4 elegant-text text-foreground">
            Get In Touch
          </h2>
          <div className="w-24 h-1 rose-gold-line mx-auto mb-16"></div>

          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              {
                icon: Phone,
                title: "Phone",
                info: "+1 (555) 123-4567",
              },
              {
                icon: Mail,
                title: "Email",
                info: "hello@nailsbeautyparadise.com",
              },
              {
                icon: MapPin,
                title: "Location",
                info: "123 Beauty Street, Paradise City, PC 12345",
              },
            ].map((contact, idx) => (
              <Card
                key={idx}
                className="p-8 text-center border-border bg-white hover:luxury-shadow transition-all"
              >
                <contact.icon className="w-10 h-10 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2 elegant-text text-foreground">
                  {contact.title}
                </h3>
                <p className="text-foreground/70">{contact.info}</p>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-foreground/70 mb-6">
              Follow us on social media for updates, tips, and special offers!
            </p>
            <div className="flex justify-center gap-6">
              {["Facebook", "Instagram", "Twitter"].map((social) => (
                <Button
                  key={social}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  {social}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4 elegant-text">About Us</h4>
              <p className="text-foreground/70 text-sm">
                NAILS & BEAUTY PARADISE is your premier destination for luxury nail and beauty services.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 elegant-text">Services</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#services" className="hover:text-primary transition-colors">Manicure</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">Pedicure</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">Eyelash Extensions</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 elegant-text">Hours</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>Mon - Fri: 10am - 7pm</li>
                <li>Sat: 10am - 6pm</li>
                <li>Sun: 12pm - 5pm</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 elegant-text">Newsletter</h4>
              <p className="text-sm text-foreground/70 mb-3">Subscribe for special offers</p>
              <Input
                type="email"
                placeholder="Your email"
                className="border-border focus:border-primary focus:ring-primary"
              />
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-foreground/60 text-sm">
            <p>&copy; 2026 NAILS & BEAUTY PARADISE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
