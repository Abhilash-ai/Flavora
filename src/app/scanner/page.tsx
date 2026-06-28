'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, Sparkles, ArrowLeft, Loader2, Utensils, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ScannerPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
        setIngredients([]); // Reset previous scan
        setError('');
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const triggerFileInput = (capture: boolean) => {
    if (fileInputRef.current) {
      if (capture) {
        fileInputRef.current.setAttribute('capture', 'environment');
      } else {
        fileInputRef.current.removeAttribute('capture');
      }
      fileInputRef.current.click();
    }
  };

  const scanImage = async () => {
    if (!imageSrc) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Extract base64 data and mime type
      const base64Data = imageSrc.split(',')[1];
      const mimeType = imageSrc.split(';')[0].split(':')[1];
      
      const response = await fetch('/api/scan-ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Data, mimeType }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to scan image');
      }
      
      setIngredients(data.ingredients || []);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred while scanning.');
    } finally {
      setLoading(false);
    }
  };

  const copyToRecipeGenerator = () => {
    // We could use context, Redux, or localStorage. For simplicity across pages, localStorage works well.
    // Or simply pass via URL if it's short, but localStorage is safer for long lists.
    localStorage.setItem('scannedIngredients', ingredients.join(', '));
    router.push('/recipe-generator');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-cream to-background p-4 sm:p-8 relative">
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="p-2 bg-white/60 rounded-full hover:bg-white transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-saffron" />
              Ingredient Scanner
            </h1>
            <p className="text-foreground/70">Take a photo of your fridge or pantry to detect ingredients instantly.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-6 sm:p-8 rounded-3xl shadow-sm h-full flex flex-col">
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />

              {imageSrc ? (
                <div className="relative rounded-2xl overflow-hidden shadow-inner bg-black/5 flex-1 min-h-[300px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageSrc} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-between p-4">
                    <button 
                      onClick={() => triggerFileInput(false)}
                      className="bg-white/90 backdrop-blur-sm text-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-white transition-colors shadow-sm"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 min-h-[300px] border-2 border-dashed border-saffron/40 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-saffron/5">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-warm-orange mb-4 shadow-sm">
                    <Camera className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">Upload or Take a Photo</h3>
                  <p className="text-foreground/60 text-sm mb-6">Capture your open fridge, a receipt, or groceries on the counter.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs mx-auto">
                    <button 
                      onClick={() => triggerFileInput(true)}
                      className="flex-1 flex items-center justify-center gap-2 bg-warm-orange text-white py-3 rounded-xl font-bold shadow-md hover:bg-terracotta transition-colors"
                    >
                      <Camera className="w-4 h-4" /> Camera
                    </button>
                    <button 
                      onClick={() => triggerFileInput(false)}
                      className="flex-1 flex items-center justify-center gap-2 bg-white text-foreground border border-saffron/30 py-3 rounded-xl font-bold shadow-sm hover:bg-cream transition-colors"
                    >
                      <ImageIcon className="w-4 h-4" /> Gallery
                    </button>
                  </div>
                </div>
              )}

              <AnimatePresence>
                {imageSrc && ingredients.length === 0 && !loading && (
                  <motion.button 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={scanImage}
                    className="w-full mt-6 bg-gradient-to-r from-warm-orange to-terracotta text-white py-4 rounded-xl font-bold shadow-lg shadow-warm-orange/20 flex items-center justify-center gap-2 hover:-translate-y-1 transition-all"
                  >
                    <Sparkles className="w-5 h-5" /> Analyze Image
                  </motion.button>
                )}
              </AnimatePresence>

            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-6 sm:p-8 rounded-3xl shadow-sm h-full flex flex-col">
              
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Utensils className="w-6 h-6 text-terracotta" /> Detected Ingredients
              </h2>

              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-foreground/60 gap-4">
                  <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 border-4 border-saffron/30 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-warm-orange rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <p className="font-medium animate-pulse">AI Chef is looking closely...</p>
                </div>
              ) : error ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              ) : ingredients.length > 0 ? (
                <div className="flex-1 flex flex-col">
                  <div className="grid grid-cols-2 gap-3 flex-1 content-start overflow-y-auto">
                    <AnimatePresence>
                      {ingredients.map((ing, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="bg-white border border-saffron/20 py-2.5 px-4 rounded-xl shadow-sm flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="font-medium text-foreground truncate">{ing}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-saffron/20">
                    <button 
                      onClick={copyToRecipeGenerator}
                      className="w-full bg-foreground text-white py-4 rounded-xl font-bold shadow-md flex items-center justify-center gap-2 hover:bg-black transition-colors"
                    >
                      Send to Recipe Generator <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-foreground/50">
                  <div className="w-24 h-24 mb-4 opacity-20">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                  <p>Upload an image to see the detected ingredients here.</p>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
