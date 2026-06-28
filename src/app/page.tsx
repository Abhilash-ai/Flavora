'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChefHat, ArrowRight, Sparkles, Utensils, Flame, ScrollText } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ThreeBackground from '@/components/ThreeBackground';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    // Initial Hero Animation
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
    );

    // Features Scroll Animation
    const features = gsap.utils.toArray('.feature-card');
    features.forEach((feature: any, i) => {
      gsap.fromTo(
        feature,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: feature,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // CTA Scroll Animation
    gsap.fromTo(
      ctaRef.current,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      {/* 3D Background */}
      <ThreeBackground />

      {/* Navigation */}
      <nav className="absolute top-0 w-full p-6 sm:p-8 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Flavora Logo" className="w-10 h-10 object-contain drop-shadow-md" />
          <span className="text-xl font-extrabold tracking-tight">Flavora</span>
        </div>
        <Link href="/login">
          <button className="px-6 py-2.5 bg-white/40 backdrop-blur-md border border-white/60 rounded-full font-bold hover:bg-white transition-all shadow-sm">
            Sign In
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main ref={heroRef} className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div ref={titleRef} className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-sm font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-warm-orange" /> Meet your AI Kitchen Companion
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-foreground">
            From ingredients to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-warm-orange to-terracotta">
              delicious meals.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed font-medium">
            Flavora magically turns what you have in your fridge into step-by-step recipes, helps you learn cooking, and organizes your grocery trips.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/login">
              <button className="flex items-center gap-2 px-8 py-4 bg-foreground text-white rounded-full font-bold text-lg hover:bg-black transition-all hover:scale-105 shadow-xl">
                Start Cooking Free <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-4 bg-white/40 backdrop-blur-3xl border-t border-white/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need to cook better</h2>
            <p className="text-foreground/60 max-w-xl mx-auto">Stop wondering what to make for dinner. Flavora handles the planning so you can enjoy the cooking.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" ref={featuresRef}>
            
            <div className="feature-card bg-white/60 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-saffron/20 rounded-2xl flex items-center justify-center text-saffron mb-6">
                <Utensils className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Recipe Generator</h3>
              <p className="text-foreground/70 leading-relaxed">Input the ingredients you have, and our AI will generate a complete, structured recipe tailored to your skill level and diet.</p>
            </div>

            <div className="feature-card bg-white/60 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-warm-orange/20 rounded-2xl flex items-center justify-center text-warm-orange mb-6">
                <Flame className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Ingredient Scanner</h3>
              <p className="text-foreground/70 leading-relaxed">Just take a photo of your fridge or pantry. The vision AI will instantly detect your ingredients and suggest meals.</p>
            </div>

            <div className="feature-card bg-white/60 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-terracotta/20 rounded-2xl flex items-center justify-center text-terracotta mb-6">
                <ScrollText className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Sous-Chef Chat</h3>
              <p className="text-foreground/70 leading-relaxed">Got a cooking question? Need a substitution? Chat with your AI assistant anytime during your cooking process.</p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-4">
        <div ref={ctaRef} className="max-w-4xl mx-auto bg-gradient-to-br from-warm-orange to-terracotta rounded-[3rem] p-12 text-center text-white shadow-2xl shadow-warm-orange/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 relative z-10">Ready to transform your kitchen?</h2>
          <p className="text-white/80 mb-10 text-lg max-w-xl mx-auto relative z-10">Join thousands of home cooks who are saving time, reducing food waste, and making delicious meals every day.</p>
          
          <Link href="/login" className="relative z-10 inline-block">
            <button className="bg-white text-terracotta px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
              Create Free Account <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-foreground/50 text-sm border-t border-saffron/20 bg-white/40 backdrop-blur-md">
        <p>© {new Date().getFullYear()} Flavora. Your AI Kitchen Companion.</p>
      </footer>
    </div>
  );
}
