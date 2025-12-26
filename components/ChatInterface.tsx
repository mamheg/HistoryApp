
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { GeminiService } from '../services/geminiService';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [m.content]
      }));
      
      const response = await GeminiService.generateChatResponse(input, history);
      
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || 'Sorry, I encountered an error.',
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: 'error',
        role: 'assistant',
        content: 'Error: Could not reach Gemini. Please try again.',
        timestamp: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full px-4 md:px-8 py-6">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 pb-24 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center">
              <i className="fa-solid fa-comment-dots text-3xl text-blue-500"></i>
            </div>
            <h2 className="text-2xl font-bold text-white">How can I help you today?</h2>
            <p className="text-slate-400 max-w-md">Start a conversation with Gemini 3 Flash. I can help with coding, writing, and creative ideas.</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-slate-800 text-slate-200 border border-slate-700'
            }`}>
              <div className="text-sm mb-1 opacity-50 flex items-center gap-2">
                <i className={`fa-solid ${msg.role === 'user' ? 'fa-user' : 'fa-robot'}`}></i>
                {msg.role === 'user' ? 'You' : 'Gemini'}
              </div>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
              </div>
              <span className="text-sm text-slate-400 italic">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-6 left-0 right-0 pt-4">
        <div className="glass-effect rounded-2xl p-2 flex items-center gap-2 shadow-2xl border border-slate-700">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-white placeholder:text-slate-500"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              !input.trim() || isLoading 
                ? 'bg-slate-700 text-slate-500' 
                : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30'
            }`}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
