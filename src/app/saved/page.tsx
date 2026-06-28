'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, ArrowLeft, Loader2, Utensils, Clock, Flame, Trash2, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function SavedRecipesPage() {
  const [user, setUser] = useState<any>(null);
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  
  const router = useRouter();

  const fetchRecipes = async (uid: string) => {
    try {
      const q = query(
        collection(db, `users/${uid}/savedRecipes`),
        orderBy('savedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const recipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSavedRecipes(recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchRecipes(currentUser.uid);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribeAuth();
  }, [router]);

  const deleteRecipe = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    
    try {
      await deleteDoc(doc(db, `users/${user.uid}/savedRecipes`, id));
      setSavedRecipes(prev => prev.filter(r => r.id !== id));
      if (selectedRecipe?.id === id) {
        setSelectedRecipe(null);
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const filteredRecipes = savedRecipes.filter(r => 
    r.recipeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-warm-orange" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-cream to-background p-4 sm:p-8 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 bg-white/60 rounded-full hover:bg-white transition-colors shadow-sm">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Bookmark className="w-8 h-8 text-terracotta" />
                Saved Recipes
              </h1>
              <p className="text-foreground/70">{savedRecipes.length} recipes collected</p>
            </div>
          </div>
          
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input 
              type="text" 
              placeholder="Search recipes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-72 bg-white border border-saffron/30 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-warm-orange/50 shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-saffron" />
          </div>
        ) : savedRecipes.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-12 rounded-3xl shadow-sm text-center">
            <div className="w-24 h-24 bg-saffron/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bookmark className="w-10 h-10 text-terracotta/40" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No saved recipes yet</h2>
            <p className="text-foreground/60 mb-8 max-w-md mx-auto">When you generate a recipe you love, click the "Save to Favorites" button to keep it here forever.</p>
            <Link href="/recipe-generator">
              <button className="bg-warm-orange text-white px-8 py-3 rounded-full font-bold hover:bg-terracotta transition-colors shadow-md">
                Discover Recipes
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredRecipes.map((recipe, idx) => (
                <motion.div 
                  key={recipe.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="bg-white/80 backdrop-blur-md border border-white/50 p-6 rounded-3xl shadow-sm hover:shadow-md hover:bg-white transition-all cursor-pointer group flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center text-warm-orange shadow-inner">
                      <Utensils className="w-6 h-6" />
                    </div>
                    <button 
                      onClick={(e) => deleteRecipe(recipe.id, e)}
                      className="p-2 text-foreground/20 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{recipe.recipeName}</h3>
                  
                  <div className="flex flex-wrap gap-2 mt-auto pt-4">
                    <span className="bg-saffron/10 text-foreground/80 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-warm-orange" /> {recipe.cookingTime}
                    </span>
                    <span className="bg-terracotta/10 text-foreground/80 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3 text-terracotta" /> {recipe.difficulty}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecipe(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 sm:p-8 overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-3xl font-extrabold text-foreground pr-8">{selectedRecipe.recipeName}</h2>
                  <button 
                    onClick={() => setSelectedRecipe(null)}
                    className="w-8 h-8 bg-cream rounded-full flex items-center justify-center text-foreground hover:bg-saffron/20 transition-colors flex-shrink-0"
                  >
                    ×
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="bg-cream px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-warm-orange" /> {selectedRecipe.cookingTime}
                  </span>
                  <span className="bg-cream px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                    <Flame className="w-4 h-4 text-terracotta" /> {selectedRecipe.difficulty}
                  </span>
                  <span className="bg-cream px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-saffron" /> {selectedRecipe.calories}
                  </span>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2 border-b border-saffron/20 pb-2">
                      <Sparkles className="w-5 h-5 text-saffron" /> Ingredients
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedRecipe.ingredients.map((ing: any, idx: number) => (
                        <li key={idx} className="bg-cream/50 p-3 rounded-xl flex justify-between">
                          <span className="font-medium text-foreground">{ing.name}</span>
                          <span className="text-sm font-bold text-warm-orange">{ing.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-4 border-b border-saffron/20 pb-2">Instructions</h3>
                    <div className="space-y-4">
                      {selectedRecipe.instructions.map((step: string, idx: number) => (
                        <div key={idx} className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-warm-orange text-white font-bold flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </div>
                          <p className="text-foreground leading-relaxed pt-1">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
