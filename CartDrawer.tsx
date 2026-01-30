
import React from 'react';
import { X, Minus, Plus, ChevronRight, ShoppingBag, Trash2 } from 'lucide-react';
import { CartItem } from './types';

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
    <div className="fixed inset-0 z-[70] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:w-[450px] h-full bg-neutral-900 shadow-2xl flex flex-col animate-in slide-in-from-right">
        <div className="px-6 py-5 border-b border-neutral-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-emerald-500" size={20} />
            <h2 className="font-serif text-xl text-white">Your Order</h2>
          </div>
          <button onClick={onClose} className="text-neutral-400"><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500">
                    <p className="font-serif italic">Your cart is empty</p>
                </div>
            ) : (
                cart.map(item => (
                    <div key={item.id} className="flex gap-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl border border-white/10" />
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-medium text-white text-sm">{item.name}</h3>
                                <p className="text-xs text-neutral-400">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <div className="flex items-center gap-2 bg-neutral-800 rounded-full px-1.5 py-1 border border-neutral-700">
                                  <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1 text-neutral-400">{item.quantity === 1 ? <Trash2 size={10} /> : <Minus size={10} />}</button>
                                  <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                                  <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1 text-neutral-400"><Plus size={10} /></button>
                              </div>
                              <span className="text-white text-xs font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
        {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-800 space-y-4 bg-neutral-900">
                <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-xs uppercase">Total</span>
                    <span className="text-2xl font-serif text-white">${(total * 1.05).toFixed(2)}</span>
                </div>
                <button onClick={onCheckout} className="w-full bg-white text-black font-bold text-sm py-4 rounded-full flex items-center justify-center gap-2">
                    PLACE ORDER <ChevronRight size={16} />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
