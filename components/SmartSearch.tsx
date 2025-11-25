import React, { useState } from 'react';
import { Search, X, Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';
import { FoodItem } from '../types';
import { searchMenu } from '../services/geminiService';

interface SmartSearchProps {
  isOpen: boolean;
  onClose: () => void;
  items: FoodItem[];
  onResults: (filteredIds: string[]) => void;
}

const SmartSearch: React.FC<SmartSearchProps> = ({ isOpen, onClose, items, onResults }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    // Call Gemini to find matches
    const matchedIds = await searchMenu(query, items);
    
    onResults(matchedIds);
    setIsSearching(false);
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center sm:pt-20">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative w-full h-full sm:h-auto sm:max-w-lg sm:rounded-3xl sm:border border-neutral-700 sm:shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:slide-in-from-top-5 duration-300 bg-neutral-900/80">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-blue-500 opacity-80" />
        
        <div className="p-6 h-full flex flex-col sm:block">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 sm:mb-6 mt-4 sm:mt-0">
            <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-xl border border-amber-500/30 animate-pulse">
                  <Sparkles className="text-amber-400" size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-serif text-white leading-none">Smart Search</h2>
                  <p className="text-[10px] text-neutral-400 mt-1">AI-powered cravings matcher</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-all hover:rotate-90 duration-300">
              <X size={20} />
            </button>
          </div>

          {/* Input Area */}
          <div className="relative mb-8">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Describe your craving..."
              className="w-full bg-neutral-800/50 text-white text-lg sm:text-base rounded-2xl pl-5 pr-14 py-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-neutral-700/50 placeholder:text-neutral-500 transition-all focus:bg-neutral-800"
              autoFocus
            />
            <button 
                onClick={handleSearch}
                disabled={isSearching || !query.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white text-black rounded-xl hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-90 hover:scale-105"
            >
                {isSearching ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"/> : <ArrowRight size={18} />}
            </button>
          </div>

          {/* Suggestions */}
          <div className="space-y-3">
             <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Suggestions</h3>
             <div className="flex flex-wrap gap-2.5">
                {[
                  'Something spicy 🌶️', 
                  'High protein, low carb 💪', 
                  'Late night comfort food 🌙', 
                  'Fresh and vegetarian 🌱',
                  'Sweet dessert 🍰'
                ].map((suggestion, i) => (
                    <button
                        key={suggestion}
                        onClick={() => { setQuery(suggestion); }}
                        className="px-3 py-2 bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700/50 rounded-xl text-xs text-neutral-300 hover:text-white transition-all active:scale-95 text-left hover:border-neutral-500 hover:scale-105 animate-in fade-in zoom-in duration-300 fill-mode-backwards"
                        style={{ animationDelay: `${i * 50}ms` }}
                    >
                        {suggestion}
                    </button>
                ))}
             </div>
          </div>
          
          <div className="mt-auto sm:mt-6 pt-6 text-center sm:text-left text-neutral-500 text-[10px]">
            Powered by Gemini AI ✦
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartSearch;