import Link from 'next/link';
import { ChefHat, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-saffron/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-saffron" />
            <span className="text-warm-orange font-bold text-lg tracking-tight">Flavora</span>
          </div>

          <p className="text-foreground/70 text-sm flex items-center gap-1">
            Crafted with <Heart className="w-4 h-4 text-terracotta fill-terracotta" /> for kitchen enthusiasts
          </p>

          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-foreground/70 hover:text-terracotta transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-foreground/70 hover:text-terracotta transition-colors">
              Terms
            </Link>
          </div>
          
        </div>
      </div>
    </footer>
  );
}
