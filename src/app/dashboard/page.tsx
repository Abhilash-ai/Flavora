'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { motion } from 'framer-motion';
import { LogOut, LayoutDashboard, Sparkles, ChefHat, ScanLine, ShoppingCart, Bookmark, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-cream to-background">
        <div className="w-16 h-16 border-4 border-saffron border-t-warm-orange rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  const quickActions = [
    { title: 'AI Recipe Generator', icon: <Sparkles className="w-6 h-6" />, href: '/recipe-generator', color: 'bg-warm-orange', desc: 'Create meals from what you have' },
    { title: 'AI Assistant', icon: <ChefHat className="w-6 h-6" />, href: '/assistant', color: 'bg-terracotta', desc: 'Chat with your AI sous-chef' },
    { title: 'Ingredient Scanner', icon: <ScanLine className="w-6 h-6" />, href: '/scanner', color: 'bg-saffron', desc: 'Scan fridge for instant ideas' },
    { title: 'Shopping List', icon: <ShoppingCart className="w-6 h-6" />, href: '/shopping-list', color: 'bg-warm-orange', desc: 'Manage your grocery needs' },
    { title: 'Saved Recipes', icon: <Bookmark className="w-6 h-6" />, href: '/saved', color: 'bg-terracotta', desc: 'Your favorite collections' },
  ];

  const recentRecipes = [
    { title: 'Creamy Tomato Pasta', time: '25 min', difficulty: 'Easy', image: '🍝' },
    { title: 'Spicy Chickpea Curry', time: '40 min', difficulty: 'Medium', image: '🍛' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-cream to-background p-4 sm:p-8 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-5%] right-[-5%] w-96 h-96 bg-saffron/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-96 h-96 bg-terracotta/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-sm">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-warm-orange" />
              Welcome back, Chef {user.displayName ? user.displayName.split(' ')[0] : 'Cook'}!
            </h1>
            <p className="text-foreground/70 mt-1 font-medium">Ready to cook something delicious today?</p>
          </motion.div>
          
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleSignOut}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-saffron/30 text-terracotta rounded-full hover:bg-red-50 hover:border-red-200 transition-all font-bold shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </motion.button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, idx) => (
                <Link href={action.href} key={idx}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/60 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-sm hover:shadow-md hover:bg-white/80 transition-all cursor-pointer h-full group"
                  >
                    <div className={`${action.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                      {action.icon}
                    </div>
                    <h3 className="font-bold text-foreground text-lg mb-1">{action.title}</h3>
                    <p className="text-sm text-foreground/70 leading-snug">{action.desc}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar (Recommendations & Recent) */}
          <div className="space-y-8">
            
            {/* Daily Recommendation */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Picked for You</h2>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-warm-orange to-terracotta p-6 rounded-3xl text-white shadow-lg shadow-warm-orange/20 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                <h3 className="font-bold text-xl mb-2 relative z-10">Paneer Butter Masala</h3>
                <p className="text-white/80 text-sm mb-4 relative z-10">Based on your love for Indian curries. Ready in 30 mins!</p>
                <button className="bg-white text-terracotta px-5 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2 relative z-10">
                  Cook Now <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </div>

            {/* Recent Recipes */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Continue Cooking</h2>
              <div className="space-y-4">
                {recentRecipes.map((recipe, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="bg-white/60 backdrop-blur-xl border border-white/50 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/80 transition-colors cursor-pointer shadow-sm"
                  >
                    <div className="w-14 h-14 bg-cream rounded-xl flex items-center justify-center text-3xl shadow-inner">
                      {recipe.image}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground">{recipe.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-foreground/60 mt-1">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {recipe.time}</span>
                        <span>•</span>
                        <span>{recipe.difficulty}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
