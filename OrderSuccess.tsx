
import React from 'react';
import { Check } from 'lucide-react';

interface OrderSuccessProps {
    onClose: () => void;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-in fade-in">
            <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl text-center max-w-sm w-full shadow-2xl transform animate-in zoom-in">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={32} strokeWidth={3} />
                </div>
                <h2 className="text-2xl font-serif text-white mb-2">Order Placed!</h2>
                <p className="text-neutral-400 mb-8 text-sm leading-relaxed">The kitchen is preparing your meal. It'll be ready shortly!</p>
                <button onClick={onClose} className="w-full bg-white text-black font-bold py-3 rounded-full uppercase tracking-widest text-xs">Close</button>
            </div>
        </div>
    );
};
export default OrderSuccess;
