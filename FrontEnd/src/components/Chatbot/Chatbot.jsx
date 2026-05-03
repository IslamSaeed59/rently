import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, Minus } from "lucide-react";
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
  }, [chatHistory, isOpen]);

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
      // Note: for user messages (which are dark background), the link color might need to be different, 
      // but only the bot sends product links currently. We use indigo-500.
      parts.push(
        <Link key={match.index} to={match[2]} className="text-indigo-500 hover:text-indigo-400 underline font-bold cursor-pointer transition-colors">
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
      {/* Chat Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-[#0F172A] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all group"
        >
          <MessageCircle size={28} />
          <span className="absolute -top-12 right-0 bg-white text-[#0F172A] text-[12px] font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
             Need help? Ask Rently AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-300 border border-gray-100 ${isMinimized ? 'h-16 w-64' : 'h-[500px] w-[350px]'}`}>
          {/* Header */}
          <div className="bg-[#0F172A] p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                <img src="/Small-logo.png" alt="Rently Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-none">Rently AI</h3>
                <span className="text-[10px] text-emerald-400 font-medium">Online</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <button onClick={() => setIsMinimized(!isMinimized)} className="hover:bg-white/10 p-1 rounded transition-colors">
                 <Minus size={18} />
               </button>
               <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors">
                 <X size={18} />
               </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <>
              <div ref={scrollRef} className="h-[370px] overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-white border border-gray-100 shadow-sm'}`}>
                          {msg.role === 'user' ? <User size={20} /> : <img src="/Small-logo.png" alt="AI" className="w-full h-full object-contain" />}
                       </div>
                       <div className={`p-3 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-[#0F172A] text-white rounded-tr-none' : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'}`}>
                          {renderMessage(msg.content)}
                       </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex gap-2 items-center bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                      <Loader2 size={16} className="animate-spin text-gray-400" />
                      <span className="text-xs text-gray-400 font-medium tracking-tight">Rently is thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-2 bg-gray-50 rounded-xl px-4 py-1 items-center border border-transparent focus-within:border-indigo-100 focus-within:bg-white transition-all">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about products, rental..."
                    className="flex-1 bg-transparent border-none outline-none py-3 text-sm text-gray-700 placeholder:text-gray-400 font-medium"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || loading}
                    className="text-indigo-600 disabled:text-gray-300 hover:scale-110 transition-transform"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
