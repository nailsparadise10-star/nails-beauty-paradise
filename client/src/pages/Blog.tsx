import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, User, ArrowRight, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

/**
 * NAILS & BEAUTY PARADISE - Blog Page
 * Design: Luxury Minimalism with Warm Elegance
 * Displays blog posts about nail care tips and beauty trends
 */

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: number;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Ultimate Guide to Nail Health: 10 Essential Tips",
    excerpt:
      "Learn how to keep your nails strong, healthy, and beautiful with these expert-approved tips from our professional nail technicians.",
    content: `Strong, healthy nails are a reflection of good overall health and proper care. In this comprehensive guide, we'll share the top 10 tips that our professional nail technicians recommend to keep your nails in pristine condition.

1. Keep Your Nails Hydrated: Just like your skin, nails need moisture. Apply cuticle oil and hand cream regularly to prevent brittleness and breakage.

2. Avoid Harsh Chemicals: Wear gloves when cleaning or doing dishes to protect your nails from harsh chemicals that can weaken them.

3. Trim Regularly: Keep your nails at a manageable length and trim them straight across for strength.

4. Use Quality Nail Products: Invest in high-quality nail polish, removers, and treatments. Cheap products often contain harmful chemicals.

5. Moisturize Your Cuticles: Healthy cuticles protect the nail matrix. Never cut your cuticles; instead, push them back gently.

6. Maintain a Balanced Diet: Nails reflect your nutritional status. Ensure adequate protein, biotin, and iron intake.

7. Avoid Excessive Water Exposure: Prolonged water exposure can weaken nails. Dry them thoroughly after washing.

8. Take Breaks Between Manicures: Give your nails time to breathe between polish applications.

9. Use a Base Coat: Always apply a base coat before polish to prevent staining and damage.

10. Stay Patient: Healthy nails take time to grow. Be consistent with your care routine.

Remember, beautiful nails start with proper care and maintenance!`,
    author: "Sarah Johnson",
    date: "2026-02-20",
    category: "Nail Care",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663388595337/XQ5oNXoz9gDgsidXKiHTe5/hero-nails-manicure-Deb2tvFehdgUPe2RhGhPKy.webp",
    readTime: 5,
  },
  {
    id: 2,
    title: "Spring 2026 Nail Trends: What's Hot This Season",
    excerpt:
      "Discover the hottest nail trends for spring 2026, from pastel ombré to minimalist designs. Get inspired and stay ahead of the curve!",
    content: `Spring is the perfect time to refresh your look, and nails are a great place to start! Here are the top nail trends that are dominating the beauty world this spring.

Pastel Ombré: Soft, dreamy gradients are everywhere. Think blush pink fading to cream or lavender melting into white.

Minimalist Designs: Less is more. Simple geometric shapes, thin lines, and negative space are creating sophisticated looks.

Floral Patterns: Delicate flower designs are back. From tiny daisies to full botanical scenes, florals are having a major moment.

Chrome Finish: Metallic chrome nails continue to be popular, especially in rose gold and champagne shades.

Nude with Accents: Classic nude base with one or two accent nails in bold colors or patterns.

Gel Extensions: Long, sculpted nails are trending. Gel extensions offer durability and endless design possibilities.

Eco-Friendly Polish: More people are choosing non-toxic, eco-friendly nail products that are better for their health and the environment.

Mix and Match: Asymmetrical designs where each nail is different are gaining popularity for those who want to express creativity.

Whether you prefer subtle elegance or bold statements, there's a spring nail trend for everyone!`,
    author: "Emma Davis",
    date: "2026-02-18",
    category: "Trends",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663388595337/XQ5oNXoz9gDgsidXKiHTe5/hero-nails-manicure-Deb2tvFehdgUPe2RhGhPKy.webp",
    readTime: 4,
  },
  {
    id: 3,
    title: "Eyelash Extensions 101: Everything You Need to Know",
    excerpt:
      "Thinking about getting eyelash extensions? Learn everything about the process, aftercare, and how to maintain your beautiful lashes.",
    content: `Eyelash extensions have become a popular beauty enhancement. If you're considering getting them, here's everything you need to know.

What Are Eyelash Extensions?
Eyelash extensions are semi-permanent fibers attached to your natural lashes using a special adhesive. They come in various lengths, thicknesses, and curls to customize your look.

The Application Process:
The process typically takes 1.5 to 2 hours. Your technician will isolate each natural lash and attach an extension using medical-grade adhesive. It's a meticulous process that requires skill and precision.

Different Types:
- Mink Lashes: Luxurious and lightweight, they provide a natural look
- Silk Lashes: Shinier than mink, they offer a more dramatic effect
- Synthetic Lashes: Durable and affordable, perfect for bold looks
- Hybrid Lashes: A mix of different types for a customized appearance

Aftercare Tips:
1. Avoid water for 24-48 hours after application
2. Don't rub or pull your lashes
3. Use oil-free makeup and cleansers
4. Brush your lashes daily with a spoolie
5. Sleep on your back to prevent lash damage
6. Avoid mascara and eyeliner
7. Schedule refills every 2-3 weeks

Cost and Duration:
Initial application costs vary but typically range from $150-$300. Lashes last 4-6 weeks with proper care, and refills are needed every 2-3 weeks.

Is It Right for You?
Eyelash extensions are perfect if you want to enhance your natural beauty, save time on makeup, or have sensitive eyes that react to mascara. However, they require commitment to proper aftercare.

Visit us at NAILS & BEAUTY PARADISE for professional eyelash extension services!`,
    author: "Michelle Chen",
    date: "2026-02-15",
    category: "Beauty Tips",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663388595337/XQ5oNXoz9gDgsidXKiHTe5/eyelash-extensions-3xPLDDJQAbEFTSjKaM2AsC.webp",
    readTime: 6,
  },
  {
    id: 4,
    title: "DIY Nail Care: At-Home Treatments for Healthy Nails",
    excerpt:
      "Can't make it to the salon? Try these easy DIY nail care treatments you can do at home for healthy, beautiful nails.",
    content: `Professional nail care is wonderful, but you can also maintain beautiful nails at home with these simple DIY treatments.

Moisturizing Nail Soak:
Mix warm water with a few drops of olive oil and soak your nails for 10 minutes. This hydrates your nails and cuticles, promoting growth and strength.

Ingredients: Warm water, olive oil (or coconut oil)
Frequency: 2-3 times per week

Exfoliating Hand Scrub:
Create a gentle scrub with brown sugar, honey, and lemon juice. Massage it into your hands and nails to remove dead skin and stimulate circulation.

Ingredients: 2 tbsp brown sugar, 1 tbsp honey, juice of half a lemon
Frequency: Once a week

Strengthening Treatment:
Mix equal parts olive oil and lemon juice. Apply to your nails and cuticles, then wrap in plastic wrap for 15 minutes.

Ingredients: Olive oil, lemon juice
Frequency: 2 times per week

Whitening Treatment:
If your nails have stains, soak them in a mixture of hydrogen peroxide and baking soda for 5 minutes.

Ingredients: 3% hydrogen peroxide, baking soda
Frequency: Once a week

Cuticle Cream:
Make your own cuticle cream by mixing shea butter, vitamin E oil, and a drop of lavender essential oil.

Ingredients: Shea butter, vitamin E oil, lavender oil
Application: Apply daily before bed

Pro Tips:
- Always patch test new treatments on a small area first
- Be consistent with your treatments for best results
- Combine DIY treatments with professional services for optimal results
- Stay hydrated and maintain a healthy diet for healthy nails

Remember, consistency is key to achieving and maintaining beautiful, healthy nails!`,
    author: "Lisa Martinez",
    date: "2026-02-10",
    category: "DIY Tips",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663388595337/XQ5oNXoz9gDgsidXKiHTe5/pedicure-service-aNsb8YLzdk4aGG6au6PNAm.webp",
    readTime: 5,
  },
  {
    id: 5,
    title: "Gel Polish vs. Regular Polish: Which One is Right for You?",
    excerpt:
      "Confused about gel vs. regular polish? We break down the pros and cons of each to help you make the best choice for your lifestyle.",
    content: `When it comes to nail polish, many people wonder whether gel or regular polish is the better choice. Let's compare them to help you decide.

Regular Polish:
Pros:
- Affordable and accessible
- Easy to apply at home
- Wide variety of colors and finishes
- No UV light exposure
- Quick to change
- Less damaging to nails

Cons:
- Chips easily (lasts 5-7 days)
- Dries slowly
- Requires frequent touch-ups
- Less durable for active lifestyles

Gel Polish:
Pros:
- Long-lasting (lasts 2-3 weeks)
- High shine and vibrant colors
- Resistant to chipping and peeling
- Ideal for special occasions
- Stays perfect throughout wear
- Professional appearance

Cons:
- More expensive
- Requires UV/LED lamp
- Difficult to remove (requires soaking)
- Can damage nails if not applied/removed properly
- UV light exposure concerns
- Requires professional application

Cost Comparison:
Regular Polish: $10-20 per manicure
Gel Polish: $25-50 per manicure

Duration and Value:
Regular Polish: 5-7 days, requires weekly touch-ups
Gel Polish: 2-3 weeks, minimal maintenance

Which Should You Choose?

Choose Regular Polish If:
- You like changing your nail color frequently
- You're on a tight budget
- You prefer low-maintenance options
- You have sensitive nails
- You like doing DIY manicures

Choose Gel Polish If:
- You want long-lasting results
- You have an active lifestyle
- You're attending special events
- You prefer professional finishes
- You don't mind the higher cost

Pro Tip: Many people use gel polish for special occasions and regular polish for everyday wear. You can also mix and match depending on your needs!

Visit NAILS & BEAUTY PARADISE for professional gel polish application and expert advice!`,
    author: "Jessica Williams",
    date: "2026-02-05",
    category: "Nail Care",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663388595337/XQ5oNXoz9gDgsidXKiHTe5/hero-nails-manicure-Deb2tvFehdgUPe2RhGhPKy.webp",
    readTime: 5,
  },
  {
    id: 6,
    title: "Kids' Nail Care: Safe and Fun Tips for Young Ones",
    excerpt:
      "Learn how to safely care for your children's nails and make nail care fun. Includes age-appropriate tips and product recommendations.",
    content: `Caring for children's nails is important for their health and hygiene. Here are safe and fun ways to maintain your kids' nails.

Why Kids' Nail Care Matters:
- Prevents infections and ingrown nails
- Teaches good hygiene habits
- Keeps nails healthy and strong
- Prevents scratching and injuries

Age-Appropriate Nail Care:

Babies (0-12 months):
- Keep nails very short to prevent scratching
- Use baby nail clippers or scissors
- Trim after baths when nails are soft
- File edges smooth
- Avoid nail polish

Toddlers (1-3 years):
- Trim nails every 1-2 weeks
- Keep nails short for safety
- Teach them not to bite nails
- Use child-safe nail files
- Introduce gentle nail care routines

Preschoolers (3-5 years):
- Trim nails weekly
- Let them help with the process
- Introduce child-friendly nail polish
- Teach proper hand washing
- Make it fun and engaging

School-Age Children (6+ years):
- Establish regular nail care routine
- Let them choose nail colors
- Teach them to trim their own nails (with supervision)
- Introduce more sophisticated designs
- Encourage self-care habits

Safe Nail Care Tips:
1. Use child-safe nail clippers
2. Trim straight across
3. File edges smooth
4. Never cut cuticles
5. Keep nails clean
6. Wash hands regularly
7. Avoid harsh chemicals

Fun Nail Care Ideas:
- Let kids choose their nail polish color
- Create simple nail art together
- Make it a bonding activity
- Use fun nail stickers
- Create a reward system for good nail care
- Visit a kids-friendly salon (like ours!)

Product Recommendations:
- Non-toxic nail polish
- Child-safe nail clippers
- Soft nail files
- Gentle hand soaps
- Moisturizing hand creams

At NAILS & BEAUTY PARADISE, we offer special kids' nail services in a safe, fun, and welcoming environment. Your children will love it!`,
    author: "Amanda Brown",
    date: "2026-02-01",
    category: "Kids' Care",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663388595337/XQ5oNXoz9gDgsidXKiHTe5/kids-nail-service-U3ewMkXhRyKfNgpJFoVyMh.webp",
    readTime: 6,
  },
];

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Nail Care",
    "Trends",
    "Beauty Tips",
    "DIY Tips",
    "Kids' Care",
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <Link href="/">
            <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-2xl">✨</span>
              <h1 className="text-2xl font-bold text-foreground elegant-text">
                NAILS & BEAUTY PARADISE
              </h1>
            </a>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link href="/">
              <a className="text-foreground hover:text-primary transition-colors">
                Home
              </a>
            </Link>
            <a href="/#services" className="text-foreground hover:text-primary transition-colors">
              Services
            </a>
            <a href="/#booking" className="text-foreground hover:text-primary transition-colors">
              Booking
            </a>
            <a href="/blog" className="text-primary font-semibold">
              Blog
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-secondary to-background">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 elegant-text text-foreground">
            Beauty & Nail Care Blog
          </h1>
          <p className="text-xl text-center text-foreground/70 max-w-2xl mx-auto mb-8">
            Discover expert tips, trends, and insights to keep your nails and beauty routine
            looking absolutely stunning.
          </p>          <div className="w-24 h-1 teal-gold-line mx-auto mb-16"></div>    </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-background">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border focus:border-primary focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={
                  selectedCategory === category
                    ? "bg-primary hover:bg-primary/90 text-white"
                    : "border-primary text-primary hover:bg-primary/10"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-background">
        <div className="container">
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <a className="group">
                    <Card className="h-full overflow-hidden hover:luxury-shadow transition-all duration-300 bg-white border-border cursor-pointer">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {post.category}
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-3 elegant-text text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>

                        <p className="text-foreground/70 text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(post.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <span className="text-xs text-muted-foreground">
                            {post.readTime} min read
                          </span>
                          <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-foreground/70">
                No blog posts found. Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4 elegant-text text-foreground">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-foreground/70 mb-6">
            Get the latest beauty tips, nail care advice, and exclusive offers delivered to your inbox.
          </p>
          <div className="flex gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              className="border-border focus:border-primary focus:ring-primary"
            />
            <Button className="bg-primary hover:bg-primary/90 text-white px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border py-12">
        <div className="container">
          <div className="text-center text-foreground/60 text-sm">
            <p>&copy; 2026 NAILS & BEAUTY PARADISE. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
