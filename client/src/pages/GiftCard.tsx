import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

export default function GiftCards() {
  const giftOptions = [
    { amount: "$50", label: "Classic Care", image: "/src/GiftCard-50.png" },
    { amount: "$100", label: "Luxury Pamper", image: "/src/GiftCard-100.png" },
    { amount: "$200", label: "VIP Experience", image: "/src/GiftCard-200.png" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F2]">
      {/* HEADER: Đồng bộ */}
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
            <Link href="/services"><a className="text-foreground hover:text-primary transition-colors">Services</a></Link>
            <a href="/booking" className="text-foreground hover:text-primary transition-colors">Booking</a>
            <a href="/GiftCard" className="text-foreground hover:text-primary transition-colors">Gift Card</a>
          </nav>
        </div>
      </header>
{/* 2. Phần Hero Section (Giúp trang Gift Card có bố cục giống Services) */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
        <div className="container">
          <h1 className="text-5xl font-bold mb-4 elegant-text text-foreground">Luxury Gift Cards</h1>
          <p className="text-xl text-foreground/70 max-w-2xl">Give the gift of beauty. Select a pre-set amount or enter a custom value for your loved ones.</p>
        </div>
      </section>
      {/* MAIN CONTENT: Chỉ còn các thẻ quà tặng */}
      <main className="container mx-auto px-4 py-16 flex-grow">
        <div className="mb-12 text-center">
         </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {giftOptions.map((gift) => (
            <Card key={gift.amount} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all">
              <div className="h-56 w-full bg-gray-200">
                <img src={gift.image} alt={gift.label} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">{gift.label}</h3>
                <p className="text-4xl font-bold text-orange-500 mb-6">{gift.amount}</p>
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">Purchase Now</Button>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* FOOTER: Đồng bộ */}
      <footer className="bg-gray-50 border-t border-border py-12">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
          <div><h4 className="font-bold mb-4">About Us</h4><p className="text-sm text-muted-foreground">Premier luxury nail and beauty services.</p></div>
          <div><h4 className="font-bold mb-4">Quick Links</h4><ul className="space-y-2 text-sm text-muted-foreground"><li><Link href="/">Home</Link></li><li><Link href="/services">Services</Link></li></ul></div>
          <div><h4 className="font-bold mb-4">Hours</h4><p className="text-sm text-muted-foreground">Mon-Fri: 10am-7pm</p></div>
          <div><h4 className="font-bold mb-4">Contact</h4><p className="text-sm text-muted-foreground">hello@nailsbeautyparadise.com</p></div>
        </div>
      </footer>
    </div>
  );
}
