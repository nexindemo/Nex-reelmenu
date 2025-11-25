import React, { useState, useRef, useEffect } from 'react';
import { X, Send, ChefHat, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { getChefResponse } from '../services/geminiService';

interface ChefChatProps {
  foodName: string;
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTED_QUESTIONS = [
  "Is this dish spicy? 🌶️",
  "What are the main ingredients? 🥕",
  "Is it gluten-free? 🌾",
  "What drink goes best with this? 🍷"
];

const ChefChat: React.FC<ChefChatProps> = ({ foodName, isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { role: 'model', text: `Hello! I'm the Executive Chef. What would you like to know about our ${foodName}?` }
      ]);
    }
  }, [isOpen, foodName]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const replyText = await getChefResponse(messages, textToSend, foodName);
    
    setMessages(prev => [...prev, { role: 'model', text: replyText }]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center pointer-events-none">
      {/* Background */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity animate-in fade-in" onClick={onClose} />
      
      {/* Chat Container */}
      <div className="w-full sm:w-[400px] bg-neutral-900 border-t sm:border border-neutral-700 sm:rounded-3xl shadow-2xl flex flex-col pointer-events-auto h-[85vh] sm:h-[650px] transition-transform duration-300 animate-in slide-in-from-bottom-10 overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-600 to-amber-700 p-1.5 rounded-xl shadow-lg shadow-amber-900/20">
                <ChefHat size={18} className="text-white" />
            </div>
            <div>
                <h3 className="font-semibold text-sm text-white leading-none">Chef's Table</h3>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400 mt-1">Ask about {foodName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-all duration-300 hover:rotate-90">
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-900 scroll-smooth">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-amber-600 text-white rounded-br-none' 
                  : 'bg-neutral-800 text-neutral-200 rounded-bl-none border border-neutral-700'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-in fade-in">
              <div className="bg-neutral-800 p-3 rounded-2xl rounded-bl-none border border-neutral-700">
                <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></span>
                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></span>
                    <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions & Input */}
        <div className="bg-neutral-900 border-t border-neutral-800 p-4 pt-2 pb-6 sm:pb-4 safe-bottom">
          {/* Quick Suggestions Chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3 pb-1 mask-linear">
             {SUGGESTED_QUESTIONS.map((q, i) => (
                 <button 
                    key={i}
                    onClick={() => handleSend(q)}
                    disabled={isLoading}
                    className="whitespace-nowrap px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700/50 rounded-full text-[10px] text-neutral-300 transition-all flex-shrink-0 active:scale-95 hover:scale-105 hover:border-neutral-500"
                 >
                    {q}
                 </button>
             ))}
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask the chef..."
              className="flex-1 bg-neutral-800 text-white rounded-full px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50 border border-transparent transition-all placeholder:text-neutral-500 focus:bg-neutral-700"
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-amber-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-700 transition-all active:scale-90 shadow-lg shadow-amber-900/20 hover:scale-110 hover:rotate-12"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChefChat;