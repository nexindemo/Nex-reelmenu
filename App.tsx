import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronRight, Search, RefreshCw } from 'lucide-react';
import { FOOD_ITEMS } from './constants';
import { FoodItem, CartItem } from './types';
import FoodCard from './components/FoodCard';
import CartDrawer from './components/CartDrawer';
import OrderSuccess from './components/OrderSuccess';
import SmartSearch from './components/SmartSearch';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Filtered list state
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>(FOOD_ITEMS);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const index = Math.round(container.scrollTop / container.clientHeight);
    if (index !== activeIndex) {
        setActiveIndex(index);
    }
  };

  const addToCart = (item: FoodItem) => {
    setCart(prev => {
        const existing = prev.find(i => i.id === item.id);
        if (existing) {
            return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
        }
        return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
        if (item.id === id) {
            return { ...item, quantity: Math.max(0, item.quantity + delta) };
        }
        return item;
    }).filter(item => item.quantity > 0));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsOrderPlaced(true);
    setCart([]); // Clear cart
  };

  const handleSearchResults = (matchedIds: string[]) => {
    if (matchedIds.length === 0) {
        setFilteredItems(FOOD_ITEMS);
        setActiveFilters([]);
    } else {
        const matches = FOOD_ITEMS.filter(item => matchedIds.includes(item.id));
        setFilteredItems(matches);
        setActiveFilters(['Custom Filter']);
        setActiveIndex(0); // Reset scroll
    }
  };

  const clearFilters = () => {
    setFilteredItems(FOOD_ITEMS);
    setActiveFilters([]);
    setActiveIndex(0);
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden font-sans">
      
      {/* Top Gradient for Button Visibility */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/80 to-transparent z-30 pointer-events-none" />

      {/* Top Floating Cart Widget */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-40">
        <button 
            onClick={() => setIsCartOpen(true)}
            className="bg-black/30 backdrop-blur-md border border-white/10 rounded-full pl-1.5 pr-3 py-1.5 flex items-center gap-3 shadow-2xl transition-all duration-300 ease-out active:scale-95 hover:scale-105 hover:bg-black/60 hover:border-white/30 cursor-pointer group"
        >
            <div className="relative bg-white/10 p-1.5 rounded-full group-hover:bg-white/20 transition-colors">
                <ShoppingBag size={16} className="text-white" />
                {cartCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full animate-in zoom-in ring-1 ring-black">
                        {cartCount}
                    </div>
                )}
            </div>
            <div className="flex flex-col items-start leading-none">
                <span className="text-[8px] text-neutral-300 font-bold tracking-wider uppercase opacity-80">Total</span>
                <span className="text-sm font-serif italic text-white">₹{cartTotal}</span>
            </div>
        </button>
      </div>

      {/* Top Right Actions */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-40 flex gap-3">
        {activeFilters.length > 0 && (
            <button 
                onClick={clearFilters}
                className="bg-amber-600/90 text-white rounded-full p-2 shadow-lg hover:bg-amber-700 transition-all duration-300 active:scale-90 hover:scale-110 flex items-center gap-1.5 animate-in fade-in zoom-in backdrop-blur-sm"
            >
                <RefreshCw size={16} />
                <span className="text-[10px] font-bold hidden sm:inline">RESET</span>
            </button>
        )}
        <button 
            onClick={() => setIsSearchOpen(true)}
            className="bg-black/30 backdrop-blur-md border border-white/10 rounded-full p-2 shadow-2xl hover:bg-black/60 hover:border-white/30 transition-all duration-300 active:scale-90 hover:scale-110 group"
        >
            <Search size={20} className="text-white group-hover:text-emerald-300 transition-colors" />
        </button>
      </div>

      {/* Main Feed Container */}
      {filteredItems.length > 0 ? (
          <div 
            className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
            onScroll={handleScroll}
          >
            {filteredItems.map((item, index) => (
                <FoodCard 
                    key={item.id} 
                    item={item} 
                    isActive={index === activeIndex}
                    onAddToCart={addToCart}
                />
            ))}
          </div>
      ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white p-4 text-center animate-in fade-in duration-500">
              <p className="text-xl font-serif mb-4">No cravings matched your search.</p>
              <button onClick={clearFilters} className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4 hover:scale-105 transition-transform">
                View Full Menu
              </button>
          </div>
      )}

      {/* Navigation Indicators */}
      {filteredItems.length > 1 && (
        <div className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 sm:gap-2 z-30 pointer-events-none">
            {filteredItems.map((_, idx) => (
                <div 
                    key={idx} 
                    className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-all duration-500 ${idx === activeIndex ? 'h-3 sm:h-4 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] scale-110' : 'bg-white/20'}`} 
                />
            ))}
        </div>
      )}

      {/* Overlays */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckout}
      />

      <SmartSearch 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        items={FOOD_ITEMS}
        onResults={handleSearchResults}
      />

      {isOrderPlaced && (
        <OrderSuccess onClose={() => setIsOrderPlaced(false)} />
      )}
      
    </div>
  );
};

export default App;