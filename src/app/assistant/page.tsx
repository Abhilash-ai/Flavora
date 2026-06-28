'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, ArrowLeft, Send, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

type Message = {
  id: string;
  role: 'user' | 'model';
  content: string;
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: "Hello! I'm your AI Sous-Chef. Need ideas for dinner, help rescuing a salty soup, or a quick substitute for buttermilk? I'm here to help!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: userMessage };
    setMessages(prev => [...prev, newUserMsg]);
    setLoading(true);

    try {
      // Send history (excluding the current new message) to provide context
      const historyToPass = messages.map(msg => ({ role: msg.role, content: msg.content }));
      
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: historyToPass,
          message: userMessage
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const newModelMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        content: data.response 
      };
      
      setMessages(prev => [...prev, newModelMsg]);

    } catch (error) {
      console.error(error);
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        content: "Oops! My chef's hat fell off. I couldn't process that right now. Please try again!" 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-cream">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-saffron/20 p-4 sticky top-0 z-20 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 bg-cream rounded-full hover:bg-saffron/20 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warm-orange rounded-full flex items-center justify-center text-white shadow-md">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-foreground text-lg leading-tight">AI Sous-Chef</h1>
              <p className="text-xs text-foreground/60 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-saffron text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                {/* Bubble */}
                <div 
                  className={`
                    px-5 py-3.5 rounded-2xl shadow-sm text-[15px] leading-relaxed
                    ${msg.role === 'user' 
                      ? 'bg-gradient-to-br from-warm-orange to-terracotta text-white rounded-br-sm' 
                      : 'bg-white border border-saffron/20 text-foreground rounded-bl-sm'}
                  `}
                >
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-cream-light prose-pre:text-foreground">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-saffron text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-white border border-saffron/20 px-4 py-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-terracotta/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-terracotta/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-terracotta/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-saffron/20 pb-safe">
        <form 
          onSubmit={handleSend}
          className="max-w-4xl mx-auto relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about ingredients, recipes, or cooking tips..."
            className="w-full bg-cream border border-saffron/30 text-foreground rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-warm-orange/50 transition-all shadow-inner"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2.5 bg-warm-orange text-white rounded-full hover:bg-terracotta transition-colors disabled:opacity-50 disabled:hover:bg-warm-orange shadow-md"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
