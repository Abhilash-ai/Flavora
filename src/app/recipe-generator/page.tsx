'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Utensils, Users, ChefHat, Salad, Wallet, ChevronRight, Loader2, ArrowLeft, Clock, Flame, AlertCircle, Bookmark, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

type RecipeResult = {
  recipeName: string;
  cookingTime: string;
  difficulty: string;
  calories: string;
  ingredients: { name: string; quantity: string }[];
  instructions: string[];
  chefTips: string[];
  mistakesToAvoid: string[];
  substitutions: { original: string; alternative: string }[];
};

export default function RecipeGeneratorPage() {
  const [inputMode, setInputMode] = useState<'ingredients' | 'dishName'>('ingredients');
  const [ingredients, setIngredients] = useState('');
  const [dishName, setDishName] = useState('');
  const [people, setPeople] = useState('2');
  const [skill, setSkill] = useState('Beginner');
  const [mealType, setMealType] = useState('Dinner');
  const [diet, setDiet] = useState('None');
  const [budget, setBudget] = useState('Medium');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recipe, setRecipe] = useState<RecipeResult | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const scanned = localStorage.getItem('scannedIngredients');
    if (scanned) {
      setIngredients(scanned);
      localStorage.removeItem('scannedIngredients');
    }

    return () => unsubscribe();
  }, []);

  const handleSaveRecipe = async () => {
    if (!user || !recipe || isSaved || saving) return;
    
    setSaving(true);
    try {
      await addDoc(collection(db, `users/${user.uid}/savedRecipes`), {
        ...recipe,
        savedAt: serverTimestamp(),
      });
      setIsSaved(true);
    } catch (err) {
      console.error("Error saving recipe:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMode === 'ingredients' && !ingredients.trim()) {
      setError('Please enter at least one ingredient.');
      return;
    }
    if (inputMode === 'dishName' && !dishName.trim()) {
      setError('Please enter a dish name.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, inputMode, dishName, people, skill, mealType, diet, budget }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate recipe.');
      }
      
      setRecipe(data);
      setIsSaved(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-cream to-background p-4 sm:p-8 relative">
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="p-2 bg-white/60 rounded-full hover:bg-white transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-warm-orange" />
              AI Recipe Generator
            </h1>
            <p className="text-foreground/70">Tell me what you have, and I'll create magic.</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!recipe ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white/60 backdrop-blur-xl border border-white/50 p-6 md:p-8 rounded-3xl shadow-lg"
            >
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 mb-6 border border-red-100">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleGenerate} className="space-y-6">
                
                {/* Toggle Input Mode */}
                <div className="flex bg-black/5 p-1 rounded-xl mb-6 shadow-inner max-w-sm mx-auto">
                  <button
                    type="button"
                    onClick={() => setInputMode('ingredients')}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${inputMode === 'ingredients' ? 'bg-white shadow-sm text-warm-orange' : 'text-foreground/60 hover:text-foreground'}`}
                  >
                    By Ingredients
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('dishName')}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${inputMode === 'dishName' ? 'bg-white shadow-sm text-warm-orange' : 'text-foreground/60 hover:text-foreground'}`}
                  >
                    By Dish Name
                  </button>
                </div>

                {/* Dynamic Input */}
                <div>
                  <label className="block text-foreground font-bold mb-2 flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-saffron" /> 
                    {inputMode === 'ingredients' ? 'What ingredients do you have?' : 'What dish are you craving?'}
                  </label>
                  {inputMode === 'ingredients' ? (
                    <textarea 
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      placeholder="e.g. 2 tomatoes, paneer, onion, some spices..."
                      className="w-full p-4 bg-white/80 border border-saffron/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-warm-orange/50 transition-all resize-none h-32"
                    />
                  ) : (
                    <input 
                      type="text"
                      value={dishName}
                      onChange={(e) => setDishName(e.target.value)}
                      placeholder="e.g. Butter Chicken, Vegan Lasagna, Chocolate Cake..."
                      className="w-full p-4 bg-white/80 border border-saffron/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-warm-orange/50 transition-all font-medium"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* People */}
                  <div>
                    <label className="block text-foreground font-bold mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4 text-warm-orange" /> Servings
                    </label>
                    <select 
                      value={people} onChange={(e) => setPeople(e.target.value)}
                      className="w-full p-3 bg-white/80 border border-saffron/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-orange/50"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>)}
                    </select>
                  </div>

                  {/* Skill */}
                  <div>
                    <label className="block text-foreground font-bold mb-2 flex items-center gap-2">
                      <ChefHat className="w-4 h-4 text-warm-orange" /> Skill Level
                    </label>
                    <select 
                      value={skill} onChange={(e) => setSkill(e.target.value)}
                      className="w-full p-3 bg-white/80 border border-saffron/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-orange/50"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  {/* Meal Type */}
                  <div>
                    <label className="block text-foreground font-bold mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-warm-orange" /> Meal Type
                    </label>
                    <select 
                      value={mealType} onChange={(e) => setMealType(e.target.value)}
                      className="w-full p-3 bg-white/80 border border-saffron/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-orange/50"
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                      <option value="Snack">Snack</option>
                      <option value="Dessert">Dessert</option>
                    </select>
                  </div>

                  {/* Diet */}
                  <div>
                    <label className="block text-foreground font-bold mb-2 flex items-center gap-2">
                      <Salad className="w-4 h-4 text-warm-orange" /> Dietary Preference
                    </label>
                    <select 
                      value={diet} onChange={(e) => setDiet(e.target.value)}
                      className="w-full p-3 bg-white/80 border border-saffron/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-orange/50"
                    >
                      <option value="None">No restrictions</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Gluten-Free">Gluten-Free</option>
                      <option value="Keto">Keto</option>
                    </select>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-foreground font-bold mb-2 flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-warm-orange" /> Budget Style
                    </label>
                    <select 
                      value={budget} onChange={(e) => setBudget(e.target.value)}
                      className="w-full p-3 bg-white/80 border border-saffron/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-orange/50"
                    >
                      <option value="Budget-friendly">Budget-friendly</option>
                      <option value="Medium">Medium</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex items-center gap-2 bg-gradient-to-r from-warm-orange to-terracotta text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-warm-orange/20 hover:shadow-xl hover:shadow-warm-orange/40 transition-all hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Consulting AI Chef...
                      </>
                    ) : (
                      <>
                        Generate Recipe
                        <Sparkles className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Recipe Header with AI Image */}
              <div className="w-full h-64 md:h-80 rounded-3xl overflow-hidden relative shadow-lg group border border-white/20">
                {/* AI Image generated dynamically based on the recipe name */}
                <img 
                  src={`https://image.pollinations.ai/prompt/${encodeURIComponent(recipe.recipeName + " delicious food photography high quality plating cinematic lighting")}`} 
                  alt={recipe.recipeName}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                
                {/* Gradient Overlay & Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-8">
                  <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-xl">
                    {recipe.recipeName}
                  </h2>
                  
                  <div className="flex flex-wrap gap-3 md:gap-4">
                    <span className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 text-white border border-white/20 shadow-sm">
                      <Clock className="w-4 h-4 text-warm-orange" /> {recipe.cookingTime}
                    </span>
                    <span className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 text-white border border-white/20 shadow-sm">
                      <Flame className="w-4 h-4 text-terracotta" /> {recipe.difficulty}
                    </span>
                    <span className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 text-white border border-white/20 shadow-sm">
                      <Utensils className="w-4 h-4 text-saffron" /> {recipe.calories}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Ingredients & Substitutions */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-sm">
                    <h3 className="text-xl font-bold text-foreground mb-4 border-b border-saffron/20 pb-2">Ingredients</h3>
                    <ul className="space-y-3">
                      {recipe.ingredients.map((ing, idx) => (
                        <li key={idx} className="flex justify-between items-center bg-white/40 p-3 rounded-xl border border-white">
                          <span className="font-medium text-foreground">{ing.name}</span>
                          <span className="text-sm font-bold text-warm-orange bg-white px-2 py-1 rounded-md">{ing.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {recipe.substitutions && recipe.substitutions.length > 0 && (
                    <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-sm">
                      <h3 className="text-xl font-bold text-foreground mb-4 border-b border-saffron/20 pb-2">Substitutions</h3>
                      <ul className="space-y-3">
                        {recipe.substitutions.map((sub, idx) => (
                          <li key={idx} className="text-sm">
                            <span className="line-through text-foreground/50">{sub.original}</span>
                            <ChevronRight className="w-4 h-4 inline mx-1 text-terracotta" />
                            <span className="font-bold text-foreground">{sub.alternative}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Instructions & Tips */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-sm">
                    <h3 className="text-2xl font-bold text-foreground mb-6 border-b border-saffron/20 pb-2">Instructions</h3>
                    <div className="space-y-6">
                      {recipe.instructions.map((step, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-warm-orange text-white font-bold flex items-center justify-center flex-shrink-0 shadow-md">
                            {idx + 1}
                          </div>
                          <p className="text-foreground leading-relaxed pt-1">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-saffron/10 border border-saffron/30 p-6 rounded-3xl shadow-sm relative overflow-hidden">
                      <ChefHat className="absolute -right-4 -top-4 w-24 h-24 text-saffron/20" />
                      <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-saffron" /> Chef's Tips
                      </h3>
                      <ul className="space-y-2 list-disc list-inside text-sm text-foreground/80 relative z-10">
                        {recipe.chefTips.map((tip, idx) => (
                          <li key={idx} className="leading-relaxed">{tip}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-terracotta/10 border border-terracotta/30 p-6 rounded-3xl shadow-sm relative overflow-hidden">
                      <AlertCircle className="absolute -right-4 -top-4 w-24 h-24 text-terracotta/10" />
                      <h3 className="text-lg font-bold text-terracotta mb-3 flex items-center gap-2">
                        <Flame className="w-5 h-5" /> Common Mistakes
                      </h3>
                      <ul className="space-y-2 list-disc list-inside text-sm text-foreground/80 relative z-10">
                        {recipe.mistakesToAvoid.map((mistake, idx) => (
                          <li key={idx} className="leading-relaxed">{mistake}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex justify-center gap-4 pt-8">
                <button 
                  onClick={() => { setRecipe(null); setIsSaved(false); }}
                  className="bg-white border-2 border-saffron/50 text-foreground px-8 py-3 rounded-full font-bold hover:bg-cream-light transition-colors shadow-sm"
                >
                  Generate Another
                </button>
                {user && (
                  <button 
                    onClick={handleSaveRecipe}
                    disabled={isSaved || saving}
                    className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all shadow-sm ${
                      isSaved 
                        ? 'bg-green-100 text-green-700 border-2 border-green-200' 
                        : 'bg-warm-orange text-white hover:bg-terracotta border-2 border-transparent'
                    }`}
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : isSaved ? <CheckCircle2 className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                    {isSaved ? 'Saved to Favorites' : 'Save Recipe'}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
