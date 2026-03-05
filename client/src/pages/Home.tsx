import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Heart, Users, Brush, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import MobileMenu from "@/components/MobileMenu";

/**
 * NAILS & BEAUTY PARADISE - Home Page
 * Design: Modern Luxury Minimalism
 * Color Palette: Deep Teal (#1B5E6F), Warm Gold (#D4AF37), Off-white (#F5F5F0)
 * Typography: Playfair Display (serif) for headings, Inter (sans-serif) for body
 */

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      image: "https://sf-static.upanhlaylink.com/img/image_20260305ccb974907dc72688ad8b3151be3d49f9.jpg",
    },
    {
      id: 2,
      name: "Pedicure",
      description: "Luxurious foot care and nail polish treatment",
      icon: "🦶",
      image: "https://sf-static.upanhlaylink.com/img/image_20260305d10633e15a50da8e9174059c291435f4.jpg",
    },
    {
      id: 3,
      name: "Kids Services",
      description: "Fun and safe nail services designed for children",
      icon: "👧",
      image: "https://sf-static.upanhlaylink.com/img/image_2026030566ea9376b65fc00d2af658e33f92861f.jpg",
    },
    {
      id: 4,
      name: "Eyelash Extensions",
      description: "Beautiful and long-lasting eyelash enhancement",
      icon: "✨",
      image: "https://sf-static.upanhlaylink.com/img/image_20260305f640e3269548721ea629156033f3947e.jpg",
    },
    {
      id: 5,
      name: "LASHES & BROWS",
      description: "Custom nail designs and artistic nail painting",
      icon: "🎨",
      image: "https://sf-static.upanhlaylink.com/img/image_2026030579e1ab272fb14ca02305f956248b37c4.jpg",
    },
    {
      id: 6,
      name: "FEMALE WAX & TINT",
      description: "Long-lasting gel nail polish with professional finish",
      icon: "💎",
      image: "https://sf-static.upanhlaylink.com/img/image_20260305d559fc962c9ec05a8569b6b514787436.jpg",
    },
  ];

  const blogPosts = [
    {
      id: 1,
      title: "The Ultimate Guide to Nail Health: 10 Essential Tips",
      excerpt: "Learn how to keep your nails strong, healthy, and beautiful with these expert-approved tips from our professional nail technicians.",
      category: "Nail Care",
      image: "https://sf-static.upanhlaylink.com/img/image_202603056fd69fce163e7a68b3a503e1565b367d.jpg",
    },
    {
      id: 2,
      title: "Spring 2026 Nail Trends: What's Hot This Season",
      excerpt: "Discover the hottest nail trends for spring 2026, from pastel ombre to minimalist designs. Get inspired and stay ahead of the curve!",
      category: "Trends",
      image: "https://sf-static.upanhlaylink.com/img/image_20260305ed6368be3f1d632407b1a816c1aadfe3.jpg",
    },
    {
      id: 3,
      title: "Eyelash Extensions 101: Everything You Need to Know",
      excerpt: "Thinking about getting eyelash extensions? Learn everything about the process, aftercare, and how to maintain your beautiful lashes.",
      category: "Beauty Tips",
      image: "https://sf-static.upanhlaylink.com/img/image_20260305f510f700538d6c7d5628f90e3eb75821.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between py-4 relative">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground elegant-text">
            
            </h1>
          </div>
            <a href="https://share.google/VyI0pWyeU44Dc2fMI" className="text-foreground hover:text-primary transition-colors">
              49 Vulture Street, West End, QLD 4101, Australia
            </a>
          <nav className="hidden md:flex gap-8">
            <button 
              onClick={() => window.location.href = '/services'}
              className="text-foreground hover:text-primary transition-colors cursor-pointer bg-none border-none p-0"
            >
              Services
            </button>
            <a href="#gallery" className="text-foreground hover:text-primary transition-colors">
              Gallery
            </a>
            <button 
              onClick={() => window.location.href = '/booking'}
              className="text-foreground hover:text-primary transition-colors cursor-pointer bg-none border-none p-0"
            >
              Booking
            </button>
            <button 
              onClick={() => window.location.href = '/blog'}
              className="text-foreground hover:text-primary transition-colors cursor-pointer bg-none border-none p-0"
            >
              Blog
            </button>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </nav>
          <MobileMenu isOpen={mobileMenuOpen} onToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden bg-gradient-to-b from-secondary to-background">
        <div className="absolute inset-0">
          <img
            src="https://sf-static.upanhlaylink.com/img/image_20260305ed251b310505ab30eb1b2a0c73d62cc1.jpg"
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
                onClick={() => window.location.href = '/booking'}
                className="bg-primary hover:bg-primary/90 text-white rounded-lg transition-all hover:luxury-shadow cursor-pointer"
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
          <div className="w-24 h-1 teal-gold-line mx-auto mb-16"></div>

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
          <div className="w-24 h-1 teal-gold-line mx-auto mb-16"></div>

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

      {/* Blog Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-4 elegant-text text-foreground">
            Latest from Our Blog
          </h2>
          <div className="w-24 h-1 teal-gold-line mx-auto mb-16"></div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {blogPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.id}`} className="group block">
                <Card className="h-full overflow-hidden hover:luxury-shadow transition-all duration-300 bg-white border-border cursor-pointer">
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2 elegant-text text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-foreground/70 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-primary text-sm font-semibold group-hover:translate-x-1 transition-transform">
                      Read More <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/blog">
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-lg transition-all">
                View All Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
 
      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-4 elegant-text text-foreground">
            Get In Touch
          </h2>
          <div className="w-24 h-1 teal-gold-line mx-auto mb-16"></div>

          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              {
                icon: Phone,
                title: "Phone",
                info: "+61 434 188 999",
              },
              {
                icon: Mail,
                title: "Email",
                info: "suport@nailsparadise.com",
              },
              {
                icon: MapPin,
                title: "Location",
                info: "49 Vulture Street, West End, QLD 4101, Australia",
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
                <li><a href="#services" className="hover:text-primary transition-colors">Pedimain</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">Nails Extensions</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">Eyelash Extensions</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 elegant-text">Hours</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>Mon-Sat: 8:30am - 9:30pm</li>
                <li>Sun: 10:00am - 4:00pm</li>
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
