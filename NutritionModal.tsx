
import React from 'react';
import { Activity, X, Flame, Droplet, Zap, Award } from 'lucide-react';
import { NutritionData } from './types';

interface NutritionModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: NutritionData | null;
  isLoading: boolean;
  foodName: string;
}

const NutritionModal: React.FC<NutritionModalProps> = ({ isOpen, onClose, data, isLoading, foodName }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center pointer-events-none">
      <div className="w-full sm:w-[350px] bg-black/90 backdrop-blur-xl border border-white/10 p-6 rounded-t-3xl sm:rounded-3xl shadow-2xl pointer-events-auto transform animate-in slide-in-from-bottom duration-300 sm:mb-20">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-emerald-400 font-bold text-[10px] uppercase">AI Nutrition Facts</h3>
            <h2 className="text-white font-serif text-xl">{foodName}</h2>
          </div>
          <button onClick={onClose} className="text-neutral-400"><X size={20} /></button>
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center py-8 space-y-3">
             <Activity className="text-emerald-500 animate-pulse" size={32} />
             <p className="text-neutral-400 text-sm">Analyzing ingredients...</p>
          </div>
        ) : data ? (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-white/5 rounded-2xl p-2 flex flex-col items-center">
                <Flame size={14} className="text-orange-500 mb-1" />
                <span className="text-white font-bold text-sm">{data.calories}</span>
                <span className="text-[8px] text-neutral-400 uppercase">Kcal</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-2 flex flex-col items-center">
                <Zap size={14} className="text-blue-500 mb-1" />
                <span className="text-white font-bold text-sm">{data.protein.replace('g', '')}</span>
                <span className="text-[8px] text-neutral-400 uppercase">Prot</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-2 flex flex-col items-center">
                <Award size={14} className="text-yellow-500 mb-1" />
                <span className="text-white font-bold text-sm">{data.carbs.replace('g', '')}</span>
                <span className="text-[8px] text-neutral-400 uppercase">Carb</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-2 flex flex-col items-center">
                <Droplet size={14} className="text-pink-500 mb-1" />
                <span className="text-white font-bold text-sm">{data.fat.replace('g', '')}</span>
                <span className="text-[8px] text-neutral-400 uppercase">Fat</span>
              </div>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <p className="text-emerald-200 text-xs italic">"{data.highlight}"</p>
            </div>
            <p className="text-[8px] text-neutral-500 text-center">*Values estimated by Gemini AI</p>
          </div>
        ) : <div className="text-center py-4 text-neutral-400">Failed to load.</div>}
      </div>
    </div>
  );
};

export default NutritionModal;
