
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Plus, Flame, Check, Info, Loader2 } from 'lucide-react';
import { FoodItem } from '../types';
import ChefChat from './ChefChat';
import NutritionModal from './NutritionModal';
import { getNutritionInfo, generateDishImage } from '../services/geminiService';

interface FoodCardProps {
  item: FoodItem;
  isActive: boolean;
  onAddToCart: (item: FoodItem) => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ item, isActive, onAddToCart }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const [nutritionData, setNutritionData] = useState<any>(null);
  const [loadingNutrition, setLoadingNutrition] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  
  // Image State
  const [displayImage, setDisplayImage] = useState(item.image);
  const [isImageGenerating, setIsImageGenerating] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchImage = async () => {
        if (!item.image.startsWith('data:')) {
             setIsImageGenerating(true);
             const generatedUrl = await generateDishImage(item);
             if (mounted && generatedUrl) {
                 setDisplayImage(generatedUrl);
             }
             if (mounted) setIsImageGenerating(false);
        }
    };

    if (isActive) {
        fetchImage();
    }
    
    return () => { mounted = false; };
  }, [item, isActive]);

  const handleAddToCart = () => {
    onAddToCart(item);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleNutrition = async () => {
    setShowNutrition(true);
    if (!nutritionData) {
        setLoadingNutrition(true);
        const data = await getNutritionInfo(item);
        setNutritionData(data);
        setLoadingNutrition(false);
    }
  };

  const renderPairingNote = (note: string) => {
    const parts = note.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <span key={i} className="font-semibold text-emerald-300">{part.slice(2, -2)}</span>;
        }
        return part;
    });
  };

  return (
    <div className="relative w-full h-full snap-start shrink-0 overflow-hidden bg-neutral-900 group/card">
      
      {/* Background Image with Motion Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
            src={displayImage} 
            alt={item.name}
            className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                isActive ? 'animate-slow-pan opacity-100' : 'scale-100 opacity-60 blur-[1px]'
            }`}
            loading="lazy"
        />
        {/* Loading Indicator for Image Generation */}
        {isImageGenerating && (
             <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 animate-in fade-in">
                 <Loader2 size={12} className="text-amber-400 animate-spin" />
                 <span className="text-[10px] text-white font-medium tracking-wide">AI Plating...</span>
             </div>
        )}
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none h-3/4 bottom-0 top-auto" />

      {/* Right Sidebar Actions - Optimized for Mobile thumb reach */}
      <div className="absolute right-3 sm:right-6 bottom-32 sm:bottom-36 flex flex-col items-center gap-4 sm:gap-5 z-20 pb-safe">
        
        {/* Like */}
        <div className="flex flex-col items-center gap-1 group">
            <button 
                onClick={() => setIsLiked(!isLiked)}
                className="w-10 h-10 sm:w-11 sm:h-11 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 ease-out active:scale-75 hover:scale-110 hover:bg-black/60 border border-white/10 hover:border-white/40 shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
                <Heart 
                    size={20} 
                    className={`transition-all duration-300 ${isLiked ? "fill-red-500 text-red-500 scale-110" : "text-white group-hover:scale-110"}`}
                />
            </button>
            <span className="text-[9px] font-medium drop-shadow-md text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute right-12 bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm pointer-events-none">Like</span>
        </div>

        {/* Chef Chat */}
        <div className="flex flex-col items-center gap-1 group">
            <button 
                onClick={() => setShowChat(true)}
                className="w-10 h-10 sm:w-11 sm:h-11 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 ease-out active:scale-75 hover:scale-110 hover:bg-black/60 border border-white/10 hover:border-white/40 shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
                <MessageCircle size={20} className="text-white group-hover:scale-110 transition-transform" />
            </button>
            <span className="text-[9px] font-medium drop-shadow-md text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute right-12 bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm pointer-events-none">Chef</span>
        </div>

        {/* Nutrition Info */}
        <div className="flex flex-col items-center gap-1 group">
            <button 
                onClick={handleNutrition}
                className="w-10 h-10 sm:w-11 sm:h-11 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 ease-out active:scale-75 hover:scale-110 hover:bg-black/60 border border-white/10 hover:border-white/40 shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
                <Info size={20} className="text-white group-hover:scale-110 transition-transform" />
            </button>
            <span className="text-[9px] font-medium drop-shadow-md text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute right-12 bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm pointer-events-none">Info</span>
        </div>

      </div>

      {/* Main Content Overlay */}
      <div className="absolute bottom-0 left-0 w-full p-5 sm:p-8 pb-10 sm:pb-12 z-20 flex flex-col items-start text-white">
        
        {/* Tags */}
        <div className="flex gap-2 mb-3 sm:mb-4 overflow-x-auto max-w-[75%] no-scrollbar">
            {item.spicy && (
                <div className="flex items-center gap-1 bg-red-600/90 backdrop-blur-md px-2 py-1 rounded-full text-[9px] font-bold tracking-wider text-white uppercase shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-500">
                    <Flame size={10} className="fill-white" /> SPICY
                </div>
            )}
            {item.tags.map((tag, i) => (
                <div 
                    key={tag} 
                    className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-md text-[9px] font-bold tracking-wider text-white uppercase border border-white/10 whitespace-nowrap shadow-sm hover:scale-105 hover:bg-white/30 transition-all cursor-default animate-in fade-in slide-in-from-left-2 duration-500 fill-mode-backwards"
                    style={{ animationDelay: `${i * 100}ms` }}
                >
                    {tag}
                </div>
            ))}
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-1.5 leading-[0.9] drop-shadow-lg tracking-tight max-w-[80%] animate-in fade-in slide-in-from-bottom-2 duration-700">
            {item.name}
        </h2>

        {/* Price */}
        <div className="text-xl sm:text-2xl font-serif italic text-emerald-400 mb-3 drop-shadow-md font-medium animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
            ${item.price.toFixed(2)}
        </div>

        {/* Description */}
        <p className="text-neutral-200 text-[11px] sm:text-xs leading-relaxed max-w-[78%] mb-5 drop-shadow-md line-clamp-3 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150">
            {item.description}
        </p>

        {/* Add to Order Button */}
        <button 
            onClick={handleAddToCart}
            className={`w-full sm:w-auto min-w-[200px] font-bold text-xs tracking-wide py-3 sm:py-3.5 px-6 rounded-full flex items-center justify-center gap-2 transition-all duration-300 ease-out shadow-[0_0_20px_rgba(0,0,0,0.3)] mb-5 active:scale-95 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 transform border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 ${
                addedFeedback 
                ? 'bg-emerald-500 text-white' 
                : 'bg-white text-black hover:bg-neutral-100'
            }`}
        >
            {addedFeedback ? (
                <>
                    <Check size={16} className="animate-in zoom-in spin-in-45 duration-300" /> ADDED TO ORDER
                </>
            ) : (
                <>
                    <Plus size={16} /> ADD TO ORDER
                </>
            )}
        </button>

        {/* Pairing Note */}
        <div className="relative pl-3 border-l-2 border-emerald-500/50 backdrop-blur-sm py-1 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
            <p className="text-neutral-300 text-[10px] sm:text-[11px] leading-relaxed">
                {renderPairingNote(item.pairingNote)}
            </p>
        </div>
      </div>

      {/* Chat Modal */}
      <ChefChat 
        foodName={item.name} 
        isOpen={showChat} 
        onClose={() => setShowChat(false)} 
      />

      {/* Nutrition Modal */}
      <NutritionModal 
        isOpen={showNutrition}
        onClose={() => setShowNutrition(false)}
        foodName={item.name}
        data={nutritionData}
        isLoading={loadingNutrition}
      />

    </div>
  );
};

export default FoodCard;
