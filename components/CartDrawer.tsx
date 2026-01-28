
import React from 'react';
import { X, Minus, Plus, ChevronRight, ShoppingBag, Trash2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cart, onUpdateQuantity, onCheckout }) => {
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end isolate">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full sm:w-[450px] h-full bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-900 z-10 safe-top">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-full animate-in zoom-in spin-in-12 duration-500">
              <ShoppingBag className="text-emerald-500" size={18} />
            </div>
            <h2 className="font-serif text-xl text-white">Your Order</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-all duration-300 hover:rotate-90">
            <X size={20} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
            {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500 gap-4 opacity-50 pb-20 animate-in fade-in zoom-in duration-500">
                    <ShoppingBag size={56} strokeWidth={1} />
                    <p className="font-serif italic text-base">Your cart is empty</p>
                    <button onClick={onClose} className="text-xs font-bold underline hover:text-white transition-colors">BROWSE MENU</button>
                </div>
            ) : (
                cart.map((item, idx) => (
                    <div 
                      key={item.id} 
                      className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-forwards hover:bg-white/5 p-2 -mx-2 rounded-xl transition-colors group"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-white/10 shrink-0 group-hover:scale-105 transition-transform duration-300" />
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                            <div>
                                <h3 className="font-medium text-white leading-tight text-base group-hover:text-emerald-300 transition-colors">{item.name}</h3>
                                <p className="text-xs text-neutral-400 mt-1">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between items-end">
                              <div className="flex items-center gap-3 bg-neutral-800 w-fit rounded-full px-1.5 py-1 border border-neutral-700">
                                  <button 
                                      onClick={() => onUpdateQuantity(item.id, -1)}
                                      className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-white rounded-full hover:bg-neutral-700 transition-colors active:scale-90"
                                  >
                                      {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                                  </button>
                                  <span className="text-sm font-medium w-4 text-center text-white">{item.quantity}</span>
                                  <button 
                                      onClick={() => onUpdateQuantity(item.id, 1)}
                                      className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-white rounded-full hover:bg-neutral-700 transition-colors active:scale-90"
                                  >
                                      <Plus size={12} />
                                  </button>
                              </div>
                              <span className="text-white font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Footer Actions */}
        {cart.length > 0 && (
            <div className="p-6 bg-neutral-900 border-t border-neutral-800 space-y-4 safe-bottom animate-in slide-in-from-bottom-10 duration-500">
                <div className="bg-neutral-800/50 p-4 rounded-2xl space-y-2 border border-white/5">
                    <div className="flex justify-between text-neutral-400 text-xs">
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400 text-xs">
                        <span>Taxes (5%)</span>
                        <span>${(total * 0.05).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-end pt-3 border-t border-white/10 mt-2">
                        <span className="text-white font-bold tracking-wider uppercase text-xs">Total</span>
                        <span className="text-2xl font-serif text-white">${(total * 1.05).toFixed(2)}</span>
                    </div>
                </div>
                <button 
                    onClick={onCheckout}
                    className="w-full bg-white text-black font-bold text-sm py-3.5 rounded-full flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all active:scale-95 duration-200 shadow-xl hover:shadow-[0_4px_20px_rgba(255,255,255,0.2)]"
                >
                    PLACE ORDER <ChevronRight size={16} />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
