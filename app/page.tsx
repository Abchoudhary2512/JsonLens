"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Github, 
  Star, 
  Search, 
  Copy, 
  ZoomIn,
  Layout,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import LiveDemo from "@/components/LiveDemo";
import FeatureCard from "@/components/FeatureCard";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [visitors, setVisitors] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    // Check if user has already visited
    const hasVisited = localStorage.getItem("jsonlens_visited");
    
    if (!hasVisited) {
      // First visit - increment counter
      fetch("/api/visitors")
        .then((res) => res.json())
        .then((data) => {
          setVisitors(data.count);
          localStorage.setItem("jsonlens_visited", "true");
        })
        .catch(() => setVisitors(null));
    } else {
      // Already visited - just fetch current count (no increment)
      fetch("/api/visitors?getOnly=true")
        .then((res) => res.json())
        .then((data) => setVisitors(data.count))
        .catch(() => setVisitors(null));
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Layout className="w-6 h-6" />,
      title: "Interactive Graph Visualization",
      description:
        "Transform complex JSON into beautiful, interactive node-based diagrams. Zoom, pan, and explore your data structure visually."
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Smart Search",
      description:
        "Quickly find keys in large JSON files. Search highlights matching nodes and jumps directly to the location."
    },
    {
      icon: <Copy className="w-6 h-6" />,
      title: "Copy JSON Path",
      description:
        "Click any node to copy its JSON path. Perfect for API debugging, JavaScript access, and MongoDB queries."
    },
    {
      icon: <ZoomIn className="w-6 h-6" />,
      title: "Infinite Canvas",
      description:
        "Navigate through large JSON structures with smooth zooming and panning. Never lose context of your data."
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b" : "bg-transparent"
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/favicon.png"
                alt="JsonLens Logo"
                width={32}
                height={32}
                className="rounded"
              />
              <span className="font-bold text-xl">JsonLens</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-sm hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#demo" className="text-sm hover:text-primary transition-colors">
                Demo
              </Link>
              <Link href="https://github.com/Abchoudhary2512/JsonLens" target="_blank">
                <Github className="w-5 h-5 hover:text-primary transition-colors" />
              </Link>
              <ThemeToggle />
              <Link href="/tool">
                <Button size="sm">
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-4 md:hidden">
              <ThemeToggle />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-muted rounded-lg"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">

          <div className="inline-flex items-center bg-primary/10 text-primary rounded-full px-4 py-2 mb-8">
            <Star className="w-4 h-4 mr-2 fill-primary text-primary" />
            <span className="text-sm font-medium">Introducing JsonLens v1.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Turn Complex JSON
            <br />Into Visual Insight
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Transform complex JSON data into beautiful, interactive graphs.
            Explore, search, and understand your data like never before.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/tool">
              <Button size="lg" className="text-lg">
                Try Live Demo <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Link href="https://github.com/Abchoudhary2512/JsonLens" target="_blank">
              <Button size="lg" variant="outline" className="text-lg">
                View on GitHub <Github className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Visitor Counter */}
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <span>100% Free & Open Source</span>

            {visitors && (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 {visitors.toLocaleString()} developer tried JsonLens
              </span>
            )}
          </div>

        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See It in Action</h2>
          <p className="text-xl text-muted-foreground">
            Watch how JsonLens transforms JSON into an interactive graph
          </p>
        </div>

        <LiveDemo />
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to understand and debug JSON data
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-linear-to-r from-primary to-primary/80 rounded-2xl p-12 text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your JSON?
            </h2>

            <p className="text-xl mb-8 opacity-90">
              Get started with JsonLens today. It's free and open source.
            </p>

            <Link href="/tool">
              <Button size="lg" variant="secondary" className="text-lg">
                Try It Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}