import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User, Loader2, Minus, Sparkles } from "lucide-react";
import { chatWithAI } from "../../server/Api";
import { Link } from "react-router-dom";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: "Hello! I am Rently AI. How can I help you today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen, isMinimized]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await chatWithAI(message);
      const assistantMessage = { role: "assistant", content: response.reply };
      setChatHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      setChatHistory(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (text) => {
    if (!text) return null;
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <Link key={match.index} to={match[2]} className="text-blue-600 hover:text-blue-800 underline font-semibold transition-colors">
          {match[1]}
        </Link>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.map((part, i) => {
      if (typeof part === 'string') {
        return (
          <span key={`text-${i}`}>
            {part.split('\n').map((line, j) => (
              <React.Fragment key={j}>
                {line}
                {j < part.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Floating Chat Button */}
      <div
        className={`transition-all duration-500 ease-in-out transform ${
          isOpen ? "scale-0 opacity-0 pointer-events-none absolute bottom-0 right-0" : "scale-100 opacity-100"
        }`}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-16 h-16 bg-[#0F172A] text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.2)] shadow-slate-900/30 hover:shadow-slate-900/50 hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <MessageCircle size={32} className="relative z-10" />
          
          {/* Notification Dot */}
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
          
          <span className="absolute -top-14 right-0 bg-white text-[#0F172A] text-sm font-semibold px-4 py-2 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none transform translate-y-2 group-hover:translate-y-0">
             Need help? Ask Rently AI ✨
             <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45"></div>
          </span>
        </button>
      </div>

      {/* Chat Window */}
      <div
        className={`absolute bottom-0 right-0 bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform origin-bottom-right ${
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 translate-y-10 pointer-events-none"
        } ${isMinimized ? "h-[76px] w-[320px]" : "h-[600px] w-[380px] max-w-[calc(100vw-3rem)]"}`}
      >
        {/* Header */}
        <div 
          className="bg-[#0F172A] p-4 flex items-center justify-between text-white cursor-pointer select-none h-[76px]"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner overflow-hidden p-1">
                <img src="/Small-logo.png" alt="Rently Logo" className="w-full h-full object-contain bg-white rounded-xl" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#0F172A] rounded-full"></span>
            </div>
            <div>
              <h3 className="text-[15px] font-bold tracking-wide flex items-center gap-1.5 leading-tight">
                Rently AI <Sparkles size={14} className="text-yellow-300" />
              </h3>
              <p className="text-[11px] text-slate-300 font-medium">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
             <button 
                onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} 
                className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
              >
               <Minus size={20} className={isMinimized ? "transform rotate-180 transition-transform" : "transition-transform"} />
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); setIsMinimized(false); }} 
                className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
              >
               <X size={20} />
             </button>
          </div>
        </div>

        {/* Chat Content Container */}
        <div 
          className={`flex flex-col transition-all duration-300 ${
            isMinimized ? "opacity-0 h-0" : "opacity-100 h-[calc(100%-76px)]"
          }`}
        >
          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/80 scroll-smooth">
            {/* Date Badge */}
            <div className="flex justify-center">
               <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full shadow-sm">Today</span>
            </div>

            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                   
                   {/* Avatar */}
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden shadow-sm ${msg.role === 'user' ? 'bg-[#0F172A] text-white' : 'bg-white border border-gray-200'}`}>
                      {msg.role === 'user' ? <User size={16} /> : <img src="/Small-logo.png" alt="AI" className="w-full h-full object-contain p-1" />}
                   </div>

                   {/* Message Bubble */}
                   <div className={`px-4 py-3 text-[14px] leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-[#0F172A] text-white rounded-2xl rounded-tr-sm' 
                        : 'bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-sm'
                   }`}>
                      {renderMessage(msg.content)}
                   </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm p-1">
                    <img src="/Small-logo.png" alt="AI" className="w-full h-full object-contain" />
                  </div>
                  <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                    <span className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            <form onSubmit={handleSend} className="relative flex items-end gap-2">
              <div className="relative flex-1 bg-slate-50 border border-slate-200 focus-within:border-slate-800 focus-within:ring-4 focus-within:ring-slate-800/10 rounded-2xl transition-all duration-300">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder="Type your message..."
                  className="w-full bg-transparent border-none outline-none py-3.5 px-4 text-[14px] text-slate-700 placeholder:text-slate-400 resize-none max-h-32 min-h-[52px] scrollbar-hide"
                  rows="1"
                />
              </div>
              <button
                type="submit"
                disabled={!message.trim() || loading}
                className="h-[52px] w-[52px] shrink-0 bg-[#0F172A] text-white rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed transition-all active:scale-95 group"
              >
                <Send size={20} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </form>
            <div className="text-center mt-3 text-[11px] text-slate-400 font-medium">
              Powered by <span className="font-semibold text-[#0F172A]">Rently AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
