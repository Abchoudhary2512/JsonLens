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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Layout className="w-6 h-6" />,
      title: "Interactive Graph Visualization",
      description: "Transform complex JSON into beautiful, interactive node-based diagrams. Zoom, pan, and explore your data structure visually."
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Smart Search",
      description: "Quickly find keys in large JSON files. Search highlights matching nodes and jumps directly to the location."
    },
    {
      icon: <Copy className="w-6 h-6" />,
      title: "Copy JSON Path",
      description: "Click any node to copy its JSON path. Perfect for API debugging, JavaScript access, and MongoDB queries."
    },
    {
      icon: <ZoomIn className="w-6 h-6" />,
      title: "Infinite Canvas",
      description: "Navigate through large JSON structures with smooth zooming and panning. Never lose context of your data."
    }
  ];


  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-lg border-b' : 'bg-transparent'
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

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-sm hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#demo" className="text-sm hover:text-primary transition-colors">
                Demo
              </Link>
              <Link href="https://github.com/Abchoudhary2512/JsonLens" target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5 hover:text-primary transition-colors" />
              </Link>
              <ThemeToggle />
              <Link href="/tool">
                <Button size="sm" className="ml-4">
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-4 md:hidden">
              <ThemeToggle />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <Link 
                  href="#features" 
                  className="text-sm hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  href="#demo" 
                  className="text-sm hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Demo
                </Link>
                <Link 
                  href="https://github.com/Abchoudhary2512/JsonLens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </Link>
                <Link href="/tool" className="w-full" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Get Started <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
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
            <Link href="https://github.com/Abchoudhary2512/JsonLens" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-lg">
                View on GitHub <Github className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="flex justify-center space-x-8 *:text-sm text-muted-foreground">
            100% Free & Open Source
            </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="demo" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See It in Action</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch how JsonLens transforms JSON into an interactive graph in real-time
            </p>
          </div>

          <div className="relative">
            {/* Live Demo Component */}
            <LiveDemo />
            
            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-background rounded-full p-3 shadow-lg animate-pulse">
              <div className="bg-green-500 w-3 h-3 rounded-full" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-background rounded-lg p-3 shadow-lg">
              <p className="text-sm font-medium">Live Preview</p>
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Interactive</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Real-time updates</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>Searchable</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to understand and debug JSON data
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

  

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-linear-to-r from-primary to-primary/80 rounded-2xl p-12 text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your JSON?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Get started with JsonLens today. It's free and open source.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tool">
                <Button size="lg" variant="secondary" className="text-lg">
                  Try It Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            
            </div>
          </div>
        </div>
      </section>           

    </div>
  );
}