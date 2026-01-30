
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Plus, Flame, Check, Info, Loader2 } from 'lucide-react';
import { FoodItem } from './types';
import ChefChat from './ChefChat';
import NutritionModal from './NutritionModal';
import { getNutritionInfo, generateDishImage } from './geminiService';

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
  const [displayImage, setDisplayImage] = useState(item.image);
  const [isImageGenerating, setIsImageGenerating] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchImage = async () => {
        if (!item.image.startsWith('data:')) {
             setIsImageGenerating(true);
             const generatedUrl = await generateDishImage(item);
             if (mounted && generatedUrl) setDisplayImage(generatedUrl);
             if (mounted) setIsImageGenerating(false);
        }
    };
    if (isActive) fetchImage();
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
    <div className="relative w-full h-full snap-start shrink-0 overflow-hidden bg-neutral-900">
      <div className="absolute inset-0 overflow-hidden">
        <img src={displayImage} alt={item.name} className={`w-full h-full object-cover transition-all duration-1000 ${isActive ? 'animate-slow-pan opacity-100' : 'opacity-60 blur-[1px]'}`} />
        {isImageGenerating && (
             <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2">
                 <Loader2 size={12} className="text-amber-400 animate-spin" />
                 <span className="text-[10px] text-white font-medium">AI Plating...</span>
             </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />
      <div className="absolute right-3 bottom-36 flex flex-col items-center gap-4 z-20">
        <button onClick={() => setIsLiked(!isLiked)} className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
            <Heart size={20} className={isLiked ? "fill-red-500 text-red-500" : "text-white"} />
        </button>
        <button onClick={() => setShowChat(true)} className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
            <MessageCircle size={20} className="text-white" />
        </button>
        <button onClick={handleNutrition} className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
            <Info size={20} className="text-white" />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 w-full p-5 sm:p-8 pb-12 z-20 flex flex-col items-start text-white">
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
            {item.spicy && <div className="bg-red-600 px-2 py-1 rounded-full text-[9px] font-bold flex items-center gap-1"><Flame size={10} /> SPICY</div>}
            {item.tags.map(tag => <div key={tag} className="px-2 py-1 rounded-full bg-white/20 text-[9px] font-bold uppercase">{tag}</div>)}
        </div>
        <h2 className="text-3xl font-serif font-bold mb-1 leading-none">{item.name}</h2>
        <div className="text-xl font-serif italic text-emerald-400 mb-3">${item.price.toFixed(2)}</div>
        <p className="text-neutral-200 text-xs leading-relaxed max-w-[80%] mb-5 line-clamp-2">{item.description}</p>
        <button onClick={handleAddToCart} className={`w-full sm:w-auto font-bold text-xs py-3 px-8 rounded-full flex items-center justify-center gap-2 transition-all ${addedFeedback ? 'bg-emerald-500' : 'bg-white text-black'}`}>
            {addedFeedback ? <><Check size={16} /> ADDED</> : <><Plus size={16} /> ADD TO ORDER</>}
        </button>
        <div className="mt-4 pl-3 border-l-2 border-emerald-500/50">
            <p className="text-neutral-300 text-[10px] leading-relaxed">{renderPairingNote(item.pairingNote)}</p>
        </div>
      </div>
      <ChefChat foodName={item.name} isOpen={showChat} onClose={() => setShowChat(false)} />
      <NutritionModal isOpen={showNutrition} onClose={() => setShowNutrition(false)} foodName={item.name} data={nutritionData} isLoading={loadingNutrition} />
    </div>
  );
};

export default FoodCard;
