import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Download,
  RotateCcw,
  Share2,
  Palette,
  Sparkles,
  Brush,
  Copy,
  Check,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

/**
 * NAILS & BEAUTY PARADISE - Nail Designer Tool
 * Design: Interactive Nail Customization
 * Allows users to design custom nail art
 */

interface NailDesign {
  baseColor: string;
  pattern: string;
  glitter: boolean;
  glitterColor: string;
  accent: string;
  accentColor: string;
  shine: number;
}

const NAIL_COLORS = [
  { name: "Lime Green", hex: "#C4E538" },
  { name: "Teal", hex: "#1FBFB8" },
  { name: "Rose Gold", hex: "#D4A5A5" },
  { name: "Classic Red", hex: "#DC143C" },
  { name: "Nude", hex: "#F5D5C0" },
  { name: "Black", hex: "#1A1A1A" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Navy Blue", hex: "#001F3F" },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Purple", hex: "#9370DB" },
  { name: "Gold", hex: "#FFD700" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Mint Green", hex: "#98FF98" },
  { name: "Pink", hex: "#FFB6C1" },
  { name: "Orange", hex: "#FF8C00" },
];

const PATTERNS = [
  { id: "solid", name: "Solid Color", icon: "■" },
  { id: "gradient", name: "Gradient", icon: "▦" },
  { id: "stripes", name: "Stripes", icon: "▬" },
  { id: "dots", name: "Polka Dots", icon: "●" },
  { id: "marble", name: "Marble", icon: "≈" },
  { id: "glitter", name: "Glitter", icon: "✨" },
];

const ACCENTS = [
  { id: "none", name: "None" },
  { id: "french", name: "French Tip" },
  { id: "line", name: "Accent Line" },
  { id: "half", name: "Half Moon" },
  { id: "geometric", name: "Geometric" },
];

// AI-Generated Nail Design Templates
const AI_TEMPLATES = [
  {
    id: 1,
    name: "Tropical Paradise",
    description: "Vibrant tropical design with lime green base and teal accents",
    design: {
      baseColor: "#C4E538",
      pattern: "gradient",
      glitter: true,
      glitterColor: "#FFD700",
      accent: "french",
      accentColor: "#1FBFB8",
      shine: 75,
    },
  },
  {
    id: 2,
    name: "Midnight Elegance",
    description: "Sophisticated black design with silver glitter and accent line",
    design: {
      baseColor: "#1A1A1A",
      pattern: "solid",
      glitter: true,
      glitterColor: "#C0C0C0",
      accent: "line",
      accentColor: "#FFD700",
      shine: 60,
    },
  },
  {
    id: 3,
    name: "Coral Sunset",
    description: "Warm coral with gradient effect and geometric accents",
    design: {
      baseColor: "#FF7F50",
      pattern: "gradient",
      glitter: false,
      glitterColor: "#FFD700",
      accent: "geometric",
      accentColor: "#FF8C00",
      shine: 70,
    },
  },
  {
    id: 4,
    name: "Marble Dream",
    description: "Elegant marble pattern with rose gold and white",
    design: {
      baseColor: "#FFFFFF",
      pattern: "marble",
      glitter: false,
      glitterColor: "#FFD700",
      accent: "half",
      accentColor: "#D4A5A5",
      shine: 65,
    },
  },
  {
    id: 5,
    name: "Purple Royalty",
    description: "Royal purple with polka dots and glitter shine",
    design: {
      baseColor: "#9370DB",
      pattern: "dots",
      glitter: true,
      glitterColor: "#FFD700",
      accent: "french",
      accentColor: "#1A1A1A",
      shine: 80,
    },
  },
  {
    id: 6,
    name: "Mint Breeze",
    description: "Fresh mint green with striped pattern and teal accents",
    design: {
      baseColor: "#98FF98",
      pattern: "stripes",
      glitter: false,
      glitterColor: "#FFD700",
      accent: "line",
      accentColor: "#1FBFB8",
      shine: 55,
    },
  },
  {
    id: 7,
    name: "Gold Glamour",
    description: "Luxurious gold base with geometric design and shine",
    design: {
      baseColor: "#FFD700",
      pattern: "solid",
      glitter: true,
      glitterColor: "#FFA500",
      accent: "geometric",
      accentColor: "#FF8C00",
      shine: 85,
    },
  },
  {
    id: 8,
    name: "Ocean Waves",
    description: "Teal gradient with white accent tips and glitter effect",
    design: {
      baseColor: "#1FBFB8",
      pattern: "gradient",
      glitter: true,
      glitterColor: "#C0C0C0",
      accent: "french",
      accentColor: "#FFFFFF",
      shine: 70,
    },
  },
  {
    id: 9,
    name: "Rose Blush",
    description: "Soft pink with marble effect and rose gold accents",
    design: {
      baseColor: "#FFB6C1",
      pattern: "marble",
      glitter: true,
      glitterColor: "#D4A5A5",
      accent: "half",
      accentColor: "#D4A5A5",
      shine: 60,
    },
  },
  {
    id: 10,
    name: "Neon Vibes",
    description: "Vibrant lime green with polka dots and teal accents",
    design: {
      baseColor: "#C4E538",
      pattern: "dots",
      glitter: true,
      glitterColor: "#1FBFB8",
      accent: "line",
      accentColor: "#1FBFB8",
      shine: 75,
    },
  },
];

export default function NailDesigner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [design, setDesign] = useState<NailDesign>({
    baseColor: "#C4E538",
    pattern: "solid",
    glitter: false,
    glitterColor: "#FFD700",
    accent: "none",
    accentColor: "#1FBFB8",
    shine: 50,
  });
  const [copied, setCopied] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // Draw nail design on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = "#F5F5F5";
    ctx.fillRect(0, 0, width, height);

    // Draw nail shape (rounded rectangle)
    const nailX = width / 2 - 40;
    const nailY = height / 2 - 80;
    const nailWidth = 80;
    const nailHeight = 160;
    const radius = 15;

    // Draw nail background
    ctx.fillStyle = design.baseColor;
    roundRect(ctx, nailX, nailY, nailWidth, nailHeight, radius);
    ctx.fill();

    // Draw pattern
    drawPattern(ctx, nailX, nailY, nailWidth, nailHeight, design);

    // Draw glitter if enabled
    if (design.glitter) {
      drawGlitter(ctx, nailX, nailY, nailWidth, nailHeight, design.glitterColor);
    }

    // Draw accent
    drawAccent(ctx, nailX, nailY, nailWidth, nailHeight, design);

    // Draw shine effect
    drawShine(ctx, nailX, nailY, nailWidth, nailHeight, design.shine);

    // Draw nail border
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    roundRect(ctx, nailX, nailY, nailWidth, nailHeight, radius);
    ctx.stroke();
  }, [design]);

  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  const drawPattern = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    design: NailDesign
  ) => {
    switch (design.pattern) {
      case "gradient":
        const gradient = ctx.createLinearGradient(x, y, x, y + h);
        gradient.addColorStop(0, design.baseColor);
        gradient.addColorStop(1, adjustBrightness(design.baseColor, -30));
        ctx.fillStyle = gradient;
        roundRect(ctx, x, y, w, h, 15);
        ctx.fill();
        break;

      case "stripes":
        ctx.strokeStyle = adjustBrightness(design.baseColor, -40);
        ctx.lineWidth = 4;
        for (let i = 0; i < w; i += 8) {
          ctx.beginPath();
          ctx.moveTo(x + i, y);
          ctx.lineTo(x + i, y + h);
          ctx.stroke();
        }
        break;

      case "dots":
        ctx.fillStyle = adjustBrightness(design.baseColor, -40);
        for (let i = 0; i < w; i += 12) {
          for (let j = 0; j < h; j += 12) {
            ctx.beginPath();
            ctx.arc(x + i + 6, y + j + 6, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;

      case "marble":
        for (let i = 0; i < 30; i++) {
          ctx.fillStyle = Math.random() > 0.5 ? design.baseColor : adjustBrightness(design.baseColor, -20);
          ctx.fillRect(
            x + Math.random() * w,
            y + Math.random() * h,
            Math.random() * 15 + 5,
            Math.random() * 15 + 5
          );
        }
        break;
    }
  };

  const drawGlitter = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string
  ) => {
    ctx.fillStyle = color;
    for (let i = 0; i < 20; i++) {
      const px = x + Math.random() * w;
      const py = y + Math.random() * h;
      const size = Math.random() * 2 + 1;
      ctx.fillRect(px, py, size, size);
    }
  };

  const drawAccent = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    design: NailDesign
  ) => {
    ctx.strokeStyle = design.accentColor;
    ctx.lineWidth = 2;

    switch (design.accent) {
      case "french":
        ctx.beginPath();
        ctx.moveTo(x, y + h - 15);
        ctx.quadraticCurveTo(x + w / 2, y + h - 5, x + w, y + h - 15);
        ctx.stroke();
        break;

      case "line":
        ctx.beginPath();
        ctx.moveTo(x + 5, y + h / 2);
        ctx.lineTo(x + w - 5, y + h / 2);
        ctx.stroke();
        break;

      case "half":
        ctx.fillStyle = design.accentColor;
        ctx.beginPath();
        ctx.arc(x + w / 2, y + 20, 12, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "geometric":
        ctx.fillStyle = design.accentColor;
        ctx.fillRect(x + 10, y + 10, 15, 15);
        ctx.fillRect(x + w - 25, y + h - 25, 15, 15);
        break;
    }
  };

  const drawShine = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    shine: number
  ) => {
    const shineOpacity = shine / 100;
    ctx.fillStyle = `rgba(255, 255, 255, ${shineOpacity * 0.3})`;
    ctx.beginPath();
    ctx.ellipse(x + w / 3, y + h / 4, w / 4, h / 3, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  const adjustBrightness = (color: string, percent: number): string => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, Math.min(255, (num >> 16) + amt));
    const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
    const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `nail-design-${Date.now()}.png`;
    link.click();
    toast.success("Design downloaded successfully!");
  };

  const handleReset = () => {
    setDesign({
      baseColor: "#C4E538",
      pattern: "solid",
      glitter: false,
      glitterColor: "#FFD700",
      accent: "none",
      accentColor: "#1FBFB8",
      shine: 50,
    });
    toast.success("Design reset to default");
  };

  const handleShare = () => {
    const designString = JSON.stringify(design);
    const encoded = btoa(designString);
    const shareUrl = `${window.location.origin}/nail-designer?design=${encoded}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Share link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyDesignCode = () => {
    const designString = JSON.stringify(design);
    navigator.clipboard.writeText(designString);
    toast.success("Design code copied!");
  };

  const handleLoadTemplate = (template: typeof AI_TEMPLATES[0]) => {
    setDesign(template.design);
    setShowTemplates(false);
    toast.success(`Loaded template: ${template.name}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer bg-none border-none p-0"
          >
            <span className="text-2xl">✨</span>
            <h1 className="text-2xl font-bold text-foreground elegant-text">
              NAILS & BEAUTY PARADISE
            </h1>
          </button>
          <nav className="hidden md:flex gap-8">
            <button 
              onClick={() => window.location.href = '/'}
              className="text-foreground hover:text-primary transition-colors cursor-pointer bg-none border-none p-0"
            >
              Home
            </button>
            <button 
              onClick={() => window.location.href = '/services'}
              className="text-foreground hover:text-primary transition-colors cursor-pointer bg-none border-none p-0"
            >
              Services
            </button>
            <span className="text-foreground hover:text-primary transition-colors">
              Designer
            </span>
            <button 
              onClick={() => window.location.href = '/blog'}
              className="text-foreground hover:text-primary transition-colors cursor-pointer bg-none border-none p-0"
            >
              Blog
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
        <div className="container">
          <h1 className="text-4xl font-bold mb-2 elegant-text text-foreground">
            Nail Design Studio
          </h1>
          <p className="text-lg text-foreground/70">
            Create your perfect nail design with our interactive designer tool
          </p>
        </div>
      </section>

      {/* Main Designer Section */}
      <section className="py-12 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Canvas Preview */}
            <div className="lg:col-span-1 flex flex-col items-center">
              <Card className="w-full p-8 bg-white border-border">
                <h3 className="text-lg font-semibold mb-4 elegant-text text-foreground text-center">
                  Your Design
                </h3>
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={400}
                  className="w-full border-2 border-border rounded-lg bg-gray-50"
                />
                <div className="mt-6 space-y-3">
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-primary hover:bg-primary/90 text-foreground font-semibold flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Design
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/10 flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    {copied ? "Copied!" : "Share Design"}
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full border-border text-foreground hover:bg-secondary flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                </div>
              </Card>
            </div>

            {/* Design Controls */}
            <div className="lg:col-span-2 space-y-6">
              {/* Base Color */}
              <Card className="p-6 bg-white border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold elegant-text text-foreground">
                    Base Color
                  </h3>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {NAIL_COLORS.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() =>
                        setDesign({ ...design, baseColor: color.hex })
                      }
                      className={`w-12 h-12 rounded-lg border-2 transition-all ${
                        design.baseColor === color.hex
                          ? "border-foreground scale-110"
                          : "border-border hover:border-foreground"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </Card>

              {/* Pattern Selection */}
              <Card className="p-6 bg-white border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Brush className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold elegant-text text-foreground">
                    Pattern
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {PATTERNS.map((pattern) => (
                    <button
                      key={pattern.id}
                      onClick={() =>
                        setDesign({ ...design, pattern: pattern.id })
                      }
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        design.pattern === pattern.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      <div className="text-2xl mb-1">{pattern.icon}</div>
                      <div className="text-xs font-medium text-foreground">
                        {pattern.name}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Glitter Option */}
              <Card className="p-6 bg-white border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold elegant-text text-foreground">
                    Glitter Effect
                  </h3>
                </div>
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={design.glitter}
                    onChange={(e) =>
                      setDesign({ ...design, glitter: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-border"
                  />
                  <span className="text-foreground font-medium">
                    Add Glitter
                  </span>
                </label>
                {design.glitter && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Glitter Color
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {NAIL_COLORS.slice(0, 10).map((color) => (
                        <button
                          key={color.hex}
                          onClick={() =>
                            setDesign({
                              ...design,
                              glitterColor: color.hex,
                            })
                          }
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${
                            design.glitterColor === color.hex
                              ? "border-foreground scale-105"
                              : "border-border"
                          }`}
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              {/* Accent Design */}
              <Card className="p-6 bg-white border-border">
                <h3 className="text-lg font-semibold elegant-text text-foreground mb-4">
                  Accent Design
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {ACCENTS.map((accent) => (
                    <button
                      key={accent.id}
                      onClick={() =>
                        setDesign({ ...design, accent: accent.id })
                      }
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        design.accent === accent.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      <div className="text-sm font-medium text-foreground">
                        {accent.name}
                      </div>
                    </button>
                  ))}
                </div>
                {design.accent !== "none" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Accent Color
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {NAIL_COLORS.map((color) => (
                        <button
                          key={color.hex}
                          onClick={() =>
                            setDesign({
                              ...design,
                              accentColor: color.hex,
                            })
                          }
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${
                            design.accentColor === color.hex
                              ? "border-foreground scale-105"
                              : "border-border"
                          }`}
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              {/* Shine Effect */}
              <Card className="p-6 bg-white border-border">
                <h3 className="text-lg font-semibold elegant-text text-foreground mb-4">
                  Shine Effect
                </h3>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={design.shine}
                  onChange={(e) =>
                    setDesign({ ...design, shine: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-sm text-muted-foreground mt-2">
                  Shine Level: {design.shine}%
                </div>
              </Card>

              {/* AI Templates */}
              <Card className="p-6 bg-white border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold elegant-text text-foreground">
                      AI Design Templates
                    </h3>
                  </div>
                  <Button
                    onClick={() => setShowTemplates(!showTemplates)}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10 text-sm"
                  >
                    {showTemplates ? "Hide" : "Show"}
                  </Button>
                </div>
                {showTemplates && (
                  <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {AI_TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleLoadTemplate(template)}
                        className="p-3 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
                      >
                        <div className="text-sm font-semibold text-foreground mb-1">
                          {template.name}
                        </div>
                        <div className="text-xs text-foreground/60 line-clamp-2">
                          {template.description}
                        </div>
                        <div className="mt-2 flex gap-1">
                          <div
                            className="w-6 h-6 rounded border border-border"
                            style={{ backgroundColor: template.design.baseColor }}
                          />
                          <div
                            className="w-6 h-6 rounded border border-border"
                            style={{ backgroundColor: template.design.accentColor }}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </Card>

              {/* Design Code */}
              <Card className="p-6 bg-white border-border">
                <h3 className="text-lg font-semibold elegant-text text-foreground mb-4">
                  Design Code
                </h3>
                <div className="bg-gray-50 p-3 rounded-lg border border-border text-xs font-mono text-foreground/70 overflow-auto max-h-24 mb-3">
                  {JSON.stringify(design, null, 2)}
                </div>
                <Button
                  onClick={handleCopyDesignCode}
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/10 flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Design Code
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary/5 to-accent/5 border-t border-border">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4 elegant-text text-foreground">
            Love Your Design?
          </h2>
          <p className="text-lg text-foreground/70 mb-6 max-w-2xl mx-auto">
            Book an appointment with our expert nail technicians to bring your design to life!
          </p>
          <Button 
            onClick={() => window.location.href = '/services'}
            className="bg-primary hover:bg-primary/90 text-foreground font-semibold px-8 py-6 text-lg"
          >
            Book an Appointment
          </Button>
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
