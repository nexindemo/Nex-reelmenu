
import React, { useState } from 'react';
import { ShoppingBag, Search, RefreshCw } from 'lucide-react';
import { FOOD_ITEMS } from './constants';
import { FoodItem, CartItem } from './types';
import FoodCard from './FoodCard';
import CartDrawer from './CartDrawer';
import OrderSuccess from './OrderSuccess';
import SmartSearch from './SmartSearch';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>(FOOD_ITEMS);
  const [activeFilters, setActiveFilters] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const index = Math.round(container.scrollTop / container.clientHeight);
    if (index !== activeIndex) setActiveIndex(index);
  };

  const addToCart = (item: FoodItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0));
  };

  const handleSearchResults = (ids: string[]) => {
    if (ids.length === 0) {
      setFilteredItems(FOOD_ITEMS);
      setActiveFilters(false);
    } else {
      setFilteredItems(FOOD_ITEMS.filter(i => ids.includes(i.id)));
      setActiveFilters(true);
      setActiveIndex(0);
    }
  };

  const clearFilters = () => {
    setFilteredItems(FOOD_ITEMS);
    setActiveFilters(false);
    setActiveIndex(0);
  };

  const cartTotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0).toFixed(2);
  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden font-sans">
      <div className="absolute top-4 left-6 z-40">
        <button onClick={() => setIsCartOpen(true)} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-3">
          <div className="relative">
            <ShoppingBag size={18} className="text-white" />
            {cartCount > 0 && <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{cartCount}</div>}
          </div>
          <span className="text-sm font-serif italic text-white">${cartTotal}</span>
        </button>
      </div>

      <div className="absolute top-4 right-6 z-40 flex gap-3">
        {activeFilters && (
          <button onClick={clearFilters} className="bg-amber-600 text-white rounded-full p-2.5 shadow-lg"><RefreshCw size={20} /></button>
        )}
        <button onClick={() => setIsSearchOpen(true)} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-2.5"><Search size={20} className="text-white" /></button>
      </div>

      <div className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar" onScroll={handleScroll}>
        {filteredItems.map((item, index) => (
          <FoodCard key={item.id} item={item} isActive={index === activeIndex} onAddToCart={addToCart} />
        ))}
        {filteredItems.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
             <p className="text-neutral-400 font-serif text-lg mb-4">Chef couldn't find matches...</p>
             <button onClick={clearFilters} className="text-emerald-400 font-bold underline">Back to Full Menu</button>
          </div>
        )}
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} onUpdateQuantity={updateQuantity} onCheckout={() => { setIsOrderPlaced(true); setCart([]); setIsCartOpen(false); }} />
      <SmartSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} items={FOOD_ITEMS} onResults={handleSearchResults} />
      {isOrderPlaced && <OrderSuccess onClose={() => setIsOrderPlaced(false)} />}
    </div>
  );
};

export default App;
