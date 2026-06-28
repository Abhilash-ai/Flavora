'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/recipe-generator', label: 'Recipes' },
    { href: '/assistant', label: 'Assistant' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-saffron/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 text-warm-orange font-bold text-xl tracking-tight">
              <ChefHat className="w-8 h-8 text-saffron" />
              <span>Flavora</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.label} 
                href={link.href}
                className="text-foreground hover:text-terracotta transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/login">
              <button className="bg-gradient-to-r from-warm-orange to-terracotta text-white px-6 py-2 rounded-full font-medium shadow-md shadow-warm-orange/20 hover:shadow-lg hover:shadow-warm-orange/40 transition-all hover:-translate-y-0.5">
                Sign In
              </button>
            </Link>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-foreground focus:outline-none">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-saffron/20 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.label} 
                  href={link.href}
                  onClick={toggleMenu}
                  className="block text-foreground hover:text-terracotta font-medium py-2"
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/login" onClick={toggleMenu} className="block mt-4">
                <button className="w-full bg-gradient-to-r from-warm-orange to-terracotta text-white px-6 py-3 rounded-xl font-medium shadow-md">
                  Sign In
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
