'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Plus, Trash2, CheckCircle2, Circle, Loader2, Sparkles, Trash } from 'lucide-react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

type ShoppingItem = {
  id: string;
  name: string;
  completed: boolean;
  createdAt: any;
};

export default function ShoppingListPage() {
  const [user, setUser] = useState<any>(null);
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Setup Firestore listener
        const q = query(
          collection(db, `users/${currentUser.uid}/shoppingList`),
          orderBy('createdAt', 'desc')
        );
        
        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const list: ShoppingItem[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as ShoppingItem);
          });
          setItems(list);
          setLoading(false);
        });

        return () => unsubscribeSnapshot();
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribeAuth();
  }, [router]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !user) return;
    
    setAdding(true);
    try {
      await addDoc(collection(db, `users/${user.uid}/shoppingList`), {
        name: newItemName.trim(),
        completed: false,
        createdAt: serverTimestamp(),
      });
      setNewItemName('');
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setAdding(false);
    }
  };

  const toggleItemCompletion = async (id: string, currentStatus: boolean) => {
    if (!user) return;
    try {
      const itemRef = doc(db, `users/${user.uid}/shoppingList`, id);
      await updateDoc(itemRef, {
        completed: !currentStatus
      });
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const deleteItem = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/shoppingList`, id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const clearCompleted = async () => {
    if (!user) return;
    const completedItems = items.filter(i => i.completed);
    try {
      for (const item of completedItems) {
        await deleteDoc(doc(db, `users/${user.uid}/shoppingList`, item.id));
      }
    } catch (error) {
      console.error("Error clearing items:", error);
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-warm-orange" />
      </div>
    );
  }

  const completedCount = items.filter(i => i.completed).length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-cream to-background p-4 sm:p-8 relative">
      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 bg-white/60 rounded-full hover:bg-white transition-colors shadow-sm">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <ShoppingCart className="w-8 h-8 text-warm-orange" />
                Shopping List
              </h1>
              <p className="text-foreground/70">{items.length} items • {completedCount} completed</p>
            </div>
          </div>
          
          {completedCount > 0 && (
            <button 
              onClick={clearCompleted}
              className="text-sm flex items-center gap-1 text-terracotta hover:text-red-700 font-medium px-3 py-1.5 bg-terracotta/10 rounded-full transition-colors"
            >
              <Trash className="w-4 h-4" /> Clear completed
            </button>
          )}
        </div>

        <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-6 sm:p-8 rounded-3xl shadow-lg">
          
          {/* Add Item Form */}
          <form onSubmit={handleAddItem} className="mb-8 relative">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Add milk, eggs, spices..."
              className="w-full bg-white border border-saffron/30 text-foreground rounded-2xl pl-6 pr-16 py-4 focus:outline-none focus:ring-2 focus:ring-warm-orange/50 transition-all shadow-sm font-medium"
              disabled={adding}
            />
            <button
              type="submit"
              disabled={!newItemName.trim() || adding}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-gradient-to-br from-warm-orange to-terracotta text-white rounded-xl hover:shadow-md transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-6 h-6" />}
            </button>
          </form>

          {/* List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-saffron" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-foreground/50">
              <div className="w-20 h-20 bg-saffron/10 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-saffron/40" />
              </div>
              <h3 className="font-bold text-lg mb-1 text-foreground/70">Your list is empty</h3>
              <p className="text-sm max-w-xs">Add ingredients here so you never forget them on your next grocery run.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      item.completed 
                        ? 'bg-black/5 border-transparent opacity-60' 
                        : 'bg-white border-saffron/20 shadow-sm'
                    }`}
                  >
                    <div 
                      className="flex items-center gap-4 flex-1 cursor-pointer"
                      onClick={() => toggleItemCompletion(item.id, item.completed)}
                    >
                      <button className={`flex-shrink-0 transition-colors ${item.completed ? 'text-green-500' : 'text-foreground/30 hover:text-warm-orange'}`}>
                        {item.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                      </button>
                      <span className={`font-medium text-[15px] ${item.completed ? 'line-through text-foreground/60' : 'text-foreground'}`}>
                        {item.name}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => deleteItem(item.id)}
                      className="p-2 text-foreground/30 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
