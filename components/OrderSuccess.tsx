import React from 'react';
import { Check } from 'lucide-react';

interface OrderSuccessProps {
    onClose: () => void;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-in fade-in duration-300">
            <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl text-center max-w-sm w-full shadow-2xl transform transition-all scale-100 animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={40} strokeWidth={3} />
                </div>
                <h2 className="text-3xl font-serif text-white mb-2">Order Placed!</h2>
                <p className="text-neutral-400 mb-8 leading-relaxed">
                    The kitchen has received your order. Sit back, relax, and get ready for a feast!
                </p>
                <button 
                    onClick={onClose}
                    className="w-full bg-white text-black font-bold py-3 rounded-full hover:bg-neutral-200 transition-colors"
                >
                    BACK TO MENU
                </button>
            </div>
        </div>
    );
};
export default OrderSuccess;