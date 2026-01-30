
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, ChefHat } from 'lucide-react';
import { ChatMessage } from './types';
import { getChefResponse } from './geminiService';

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

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { scrollToBottom(); }, [messages, isLoading]);

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
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={onClose} />
      <div className="w-full sm:w-[400px] bg-neutral-900 border-t border-neutral-700 sm:rounded-3xl shadow-2xl flex flex-col pointer-events-auto h-[80vh] sm:h-[600px] transition-transform overflow-hidden animate-in slide-in-from-bottom-10">
        <div className="px-5 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-amber-600 p-1.5 rounded-xl">
                <ChefHat size={18} className="text-white" />
            </div>
            <div>
                <h3 className="font-semibold text-sm text-white">Chef's Table</h3>
                <p className="text-[10px] uppercase tracking-wider text-neutral-400">Ask about {foodName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-full text-neutral-400">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-900">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                msg.role === 'user' ? 'bg-amber-600 text-white' : 'bg-neutral-800 text-neutral-200 border border-neutral-700'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && <div className="text-neutral-500 text-xs italic">Chef is thinking...</div>}
          <div ref={messagesEndRef} />
        </div>
        <div className="bg-neutral-900 border-t border-neutral-800 p-4 pb-8 sm:pb-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
             {SUGGESTED_QUESTIONS.map((q, i) => (
                 <button key={i} onClick={() => handleSend(q)} className="whitespace-nowrap px-3 py-1.5 bg-neutral-800 rounded-full text-[10px] text-neutral-300 border border-neutral-700">
                    {q}
                 </button>
             ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask the chef..." className="flex-1 bg-neutral-800 text-white rounded-full px-4 py-2 text-xs outline-none border border-transparent focus:border-amber-500" />
            <button onClick={() => handleSend()} className="p-2.5 bg-amber-600 text-white rounded-full"><Send size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefChat;
