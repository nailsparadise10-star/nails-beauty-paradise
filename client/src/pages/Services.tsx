import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, DollarSign, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "wouter";

/**
 * NAILS & BEAUTY PARADISE - Services & Pricing Page
 * Design: Vibrant Modern - Lime Green & Teal Theme
 * Displays comprehensive service catalog with pricing
 */

interface Service {
  id: number;
  name: string;
  category: string;
  description?: string;
  duration?: string;
  price: string;
  priceAUD?: string;
}

const services: Service[] = [
  // ... (giữ nguyên danh sách services của bạn)
  { id: 1, name: "Classic Manicure", category: "Manicure", description: "Professional nail care and polish application", price: "$40", priceAUD: "From 40 AUD" },
  { id: 2, name: "Signature Manicure", category: "Manicure", description: "Enhanced manicure with premium finishes", price: "$50", priceAUD: "From 50 AUD" },
  { id: 3, name: "Color for Nails", category: "Manicure", description: "Nail color application (Extra $5 for gel removal)", duration: "15 min", price: "$30", priceAUD: "From 30 AUD" },
  { id: 4, name: "Classic Pedicure", category: "Pedicure", description: "Cut, buff, shape, cuticle remove, callus remove, foot massage, hot stone and towel, colour", price: "$50", priceAUD: "From 50 AUD" },
  { id: 5, name: "Deluxe Pedicure", category: "Pedicure", description: "Leg exfoliation, leg mask, cut, buff, shape, cuticle remove, massage, fresh orange detox", price: "$60", priceAUD: "From 60 AUD" },
  { id: 6, name: "Pedicure & Manicure Combo", category: "Pedicure", description: "Complete hand and foot care package", price: "$79", priceAUD: "From 79 AUD" },
  { id: 7, name: "Toes Nails Colors", category: "Pedicure", description: "Cut, buff, shape, color", duration: "15 min", price: "$25", priceAUD: "From 25 AUD" },
  { id: 8, name: "Toes Nails Extension", category: "Nail Extensions", description: "Toe nail extension service", duration: "15 min", price: "$10", priceAUD: "From 10 AUD" },
  { id: 9, name: "Nails Overlay", category: "Nail Extensions", description: "Protective nail overlay application", duration: "45 min", price: "$60", priceAUD: "From 60 AUD" },
  { id: 10, name: "Infill Nails", category: "Nail Extensions", description: "Maintenance infill for extended nails", duration: "45 min", price: "$55", priceAUD: "From 55 AUD" },
  { id: 11, name: "Full-set of Nails Extension", category: "Nail Extensions", description: "Complete nail extension set", duration: "45 min", price: "$70", priceAUD: "From 70 AUD" },
  { id: 12, name: "Poly Gel", category: "Nail Extensions", description: "Poly gel nail application", duration: "45 min", price: "$60", priceAUD: "From 60 AUD" },
  { id: 13, name: "Gel X", category: "Nail Extensions", description: "Gel X nail extension system", duration: "45 min", price: "$70", priceAUD: "From 70 AUD" },
  { id: 14, name: "Take Off", category: "Nail Extensions", description: "Nail removal service", duration: "15 min", price: "$15", priceAUD: "From 15 AUD" },
  { id: 15, name: "Classic Eyelashes Extension", category: "Eyelash Services", description: "Classic eyelash extension application", duration: "1 hr", price: "$80", priceAUD: "From 80 AUD" },
  { id: 16, name: "Light Volume 3D Eyelashes Extension", category: "Eyelash Services", description: "Light volume 3D eyelash extension", duration: "1 hr", price: "$100", priceAUD: "From 100 AUD" },
  { id: 17, name: "Medium-dark 5D Volume Lashes Extension", category: "Eyelash Services", description: "Medium-dark 5D volume eyelash extension", duration: "1 hr", price: "$110", priceAUD: "From 110 AUD" },
  { id: 18, name: "Fully Dark 7D Volume Lashes Extension", category: "Eyelash Services", description: "Fully dark 7D volume eyelash extension", duration: "1 hr", price: "$110", priceAUD: "From 110 AUD" },
  { id: 19, name: "Mega 10D Volume Lashes", category: "Eyelash Services", description: "Mega 10D volume eyelash extension", duration: "1 hr", price: "$130", priceAUD: "From 130 AUD" },
  { id: 20, name: "Hybrid Eyelashes Extension", category: "Eyelash Services", description: "Hybrid eyelash extension application", duration: "1 hr", price: "$90", priceAUD: "From 90 AUD" },
  { id: 21, name: "Design Cat Eye Light Volume Lashes Set", category: "Eyelash Services", description: "Cat eye design with light volume", duration: "1 hr", price: "$120", priceAUD: "From 120 AUD" },
  { id: 22, name: "Design Cat-eye Volume Dark Set", category: "Eyelash Services", description: "Cat eye design with dark volume", duration: "1 hr", price: "$130", priceAUD: "From 130 AUD" },
  { id: 23, name: "Design Wispy Volume Lashes Set", category: "Eyelash Services", description: "Wispy volume lash design", duration: "1 hr", price: "$140", priceAUD: "From 140 AUD" },
  { id: 24, name: "Eyelashes Lift", category: "Eyelash Services", description: "Eyelash lift and tint treatment", duration: "30 min", price: "$25", priceAUD: "From 25 AUD" },
  { id: 25, name: "Eyebrow Lamination", category: "Brows & Lashes", description: "Professional eyebrow lamination", duration: "45 min", price: "$85", priceAUD: "From 85 AUD" },
  { id: 26, name: "Eyebrows Wax", category: "Brows & Lashes", description: "Professional eyebrow waxing", duration: "15 min", price: "$20", priceAUD: "From 20 AUD" },
  { id: 27, name: "Eyebrows Wax & Tint", category: "Brows & Lashes", description: "Eyebrow waxing with tint application", duration: "15 min", price: "$40", priceAUD: "$40" },
  { id: 28, name: "Eyelashes Tinting", category: "Brows & Lashes", description: "Eyelash tinting service", duration: "15 min", price: "$25", priceAUD: "$25" },
  { id: 29, name: "Upper Lip Wax", category: "Waxing", description: "Upper lip hair removal", duration: "10 min", price: "$10", priceAUD: "$10" },
  { id: 30, name: "Chin Wax", category: "Waxing", description: "Chin hair removal", duration: "10 min", price: "$20", priceAUD: "$20" },
  { id: 31, name: "Full Face Wax", category: "Waxing", description: "Complete facial hair removal", price: "$55", priceAUD: "$55" },
  { id: 32, name: "Under Arm Wax", category: "Waxing", description: "Underarm hair removal", price: "$25", priceAUD: "$25" },
  { id: 33, name: "Arm Wax", category: "Waxing", description: "Full arm hair removal", price: "$35", priceAUD: "From 35 AUD" },
  { id: 34, name: "Leg Wax", category: "Waxing", description: "Full leg hair removal", price: "$40", priceAUD: "From 40 AUD" },
  { id: 35, name: "Bikini-line Wax", category: "Waxing", description: "Bikini line hair removal", price: "$25", priceAUD: "$25" },
  { id: 36, name: "Brazilian Wax", category: "Waxing", description: "Complete Brazilian wax service", price: "$60", priceAUD: "$60" },
  { id: 37, name: "Kid Pedicure", category: "Kids Services", description: "Fun and safe pedicure for children", duration: "30 min", price: "$40", priceAUD: "From 40 AUD" },
  { id: 38, name: "Kid Manicure", category: "Kids Services", description: "Fun and safe manicure for children", duration: "15 min", price: "$30", priceAUD: "From 30 AUD" },
  { id: 39, name: "Kid's Combo Pedi Mani", category: "Kids Services", description: "Combined hand and foot care for kids", duration: "45 min", price: "$65", priceAUD: "From 65 AUD" },
  { id: 40, name: "Kid Polishes Change", category: "Kids Services", description: "Polish change service for kids", duration: "15 min", price: "$15", priceAUD: "$15" },
  { id: 41, name: "Kid Hand Nails Colour", category: "Kids Services", description: "Hand nail color for children", duration: "15 min", price: "$25", priceAUD: "$25" },
  { id: 42, name: "Kid Toe Nails Colour", category: "Kids Services", description: "Toe nail color for children", duration: "15 min", price: "$25", priceAUD: "$25" },
  { id: 43, name: "Kid Combo Gel Colour", category: "Kids Services", description: "Gel color for hands and feet", duration: "30 min", price: "$45", priceAUD: "$45" },
];

const categories = ["All Services", "Manicure", "Pedicure", "Nail Extensions", "Eyelash Services", "Brows & Lashes", "Waxing", "Kids Services"];

export default function Services() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Services");

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesCategory = selectedCategory === "All Services" || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      {/* (Phần Header giữ nguyên như của bạn) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <Link href="/">
            <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-2xl"></span>
              <h1 className="text-2xl font-bold text-foreground elegant-text"></h1>
            </a>
          </Link>
          <a href="https://share.google/Dqa79IOkH8TL4Tk2s" className="text-foreground hover:text-primary transition-colors">49 Vulture Street, West End, QLD 4101, Australia</a>
          <nav className="hidden md:flex gap-8">
            <Link href="/"><a className="text-foreground hover:text-primary transition-colors">Home</a></Link>
            <a href="/Services" className="text-foreground hover:text-primary transition-colors">Services</a>
            <a href="/booking" className="text-foreground hover:text-primary transition-colors">Booking</a>
            <Link href="/blog"><a className="text-foreground hover:text-primary transition-colors">Blog</a></Link>
            <a href="/GiftCard" className="text-foreground hover:text-primary transition-colors">Gift Card</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
        <div className="container">
          <h1 className="text-5xl font-bold mb-4 elegant-text text-foreground">Our Services & Pricing</h1>
          <p className="text-xl text-foreground/70 max-w-2xl">Explore our comprehensive range of beauty services with transparent pricing. All prices are in USD.</p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 bg-background">
        <div className="container">
          {filteredServices.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Card key={service.id} className="overflow-hidden hover:vibrant-shadow transition-all duration-300 bg-white border-border group cursor-pointer">
                  <div className="p-6 space-y-4">
                    <span className="inline-block bg-primary text-foreground px-3 py-1 rounded-full text-xs font-semibold">{service.category}</span>
                    <h3 className="text-xl font-semibold elegant-text text-foreground group-hover:text-primary transition-colors">{service.name}</h3>
                    {service.description && <p className="text-foreground/70 text-sm line-clamp-2">{service.description}</p>}
                    {service.duration && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="w-4 h-4" /><span>{service.duration}</span></div>}
                    
                    <div className="space-y-1 pt-2 border-t border-border">
                      <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-primary" /><span className="text-2xl font-bold text-primary">{service.price}</span></div>
                      {service.priceAUD && <p className="text-xs text-muted-foreground">{service.priceAUD}</p>}
                    </div>

                    {/* NÚT BOOK NOW ĐÃ ĐƯỢC CHÈN LINK ĐÚNG CẤU TRÚC */}
                    <Link href="/booking">
                      <a className="block w-full">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-foreground font-semibold transition-all">
                          Book Now
                        </Button>
                      </a>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center">No services found.</p>
          )}
        </div>
      </section>
      {/* CTA Section */}
<section className="py-16 bg-white border-t border-border">
  <div className="container text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
      Ready to Book Your Service?
    </h2>
    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
      Contact us today to schedule your appointment or inquire about package deals and special offers.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link href="/booking">
        <Button className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-8 py-6 text-lg">
          Book an Appointment
        </Button>
      </Link>
      <Link href="https://www.youtube.com/@NAILSBEAUTYPARADISE">
        <Button variant="outline" className="border-amber-400 text-amber-500 hover:bg-amber-50 px-8 py-6 text-lg">
          Video
        </Button>
      </Link>
    </div>
  </div>
</section>

{/* Footer */}
<footer className="bg-gray-50 border-t border-border py-12">
  <div className="container grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
    <div>
      <h4 className="font-bold text-foreground mb-4">About Us</h4>
      <p className="text-muted-foreground text-sm">
        NAILS & BEAUTY PARADISE is your premier destination for luxury nail and beauty services.
      </p>
    </div>
    
    <div>
      <h4 className="font-bold text-foreground mb-4">Quick Links</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li><Link href="/" className="hover:text-amber-500 transition-colors">Home</Link></li>
        <li><Link href="/blog" className="hover:text-amber-500 transition-colors">Blog</Link></li>
        <li><a href="tel:+610434188999" className="hover:text-amber-500 transition-colors">Contact</a></li>
      </ul>
    </div>

    <div>
      <h4 className="font-bold text-foreground mb-4">Hours</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li>Mon - Fri: 10am - 7pm</li>
        <li>Sat: 10am - 6pm</li>
        <li>Sun: 12pm - 5pm</li>
      </ul>
    </div>

    <div>
      <h4 className="font-bold text-foreground mb-4">Contact</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li>Phone: +61 434 188 999</li>
        <li>Email: hello@nailsbeautyparadise.com</li>
      </ul>
    </div>
  </div>

  <div className="container border-t border-gray-200 pt-8 text-center text-muted-foreground text-sm">
    <p>&copy; 2026 NAILS & BEAUTY PARADISE. All rights reserved.</p>
  </div>
</footer>
    </div>
  );
}
