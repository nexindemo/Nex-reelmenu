
import React, { useState } from 'react';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';
import { FoodItem } from './types';
import { searchMenu } from './geminiService';

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
    const matchedIds = await searchMenu(query, items);
    onResults(matchedIds);
    setIsSearching(false);
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-neutral-900/80 sm:rounded-3xl border border-neutral-700 shadow-2xl overflow-hidden p-6 animate-in slide-in-from-top-5">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="text-amber-400" size={18} />
            <h2 className="text-lg font-serif text-white">Smart Search</h2>
          </div>
          <button onClick={onClose} className="text-neutral-400"><X size={20} /></button>
        </div>
        <div className="relative mb-8">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="Describe your craving..." className="w-full bg-neutral-800 text-white rounded-2xl px-5 py-4 outline-none border border-neutral-700 focus:border-emerald-500" autoFocus />
          <button onClick={handleSearch} disabled={isSearching || !query.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white text-black rounded-xl">
            {isSearching ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <ArrowRight size={18} />}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
           {['Something spicy 🌶️', 'High protein 💪', 'Comfort food 🌙', 'Vegetarian 🌱'].map(s => (
               <button key={s} onClick={() => setQuery(s)} className="px-3 py-2 bg-neutral-800 rounded-xl text-xs text-neutral-300 border border-neutral-700">{s}</button>
           ))}
        </div>
      </div>
    </div>
  );
};

export default SmartSearch;
