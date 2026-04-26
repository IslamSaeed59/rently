import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  MoreVertical, 
  Image as ImageIcon, 
  ChevronLeft,
  Circle,
  MessageSquare,
  Users
} from "lucide-react";
import { io } from "socket.io-client";
import { adminGetConversations, getMessages } from "../../../server/ChatApi";

const ALLChat = () => {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const socket = useRef(null);
  const activeChatIdRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchConversations();
    
    // Admin socket listener to keep track of ALL messages
    socket.current = io("http://localhost:9000");
    
    socket.current.on("receive_message", (message) => {
      if (activeChatIdRef.current === message.conversation_id) {
        setMessages((prev) => {
          const exists = prev.some(m => m.id === message.id);
          if (exists) return prev;
          return [...prev, message];
        });
      }
      fetchConversations();
    });

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, []);

  const fetchConversations = async () => {
    try {
      const data = await adminGetConversations();
      setConversations(data);
    } catch (error) {
      console.error("Error fetching admin conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = async (chat) => {
    setActiveChat(chat);
    activeChatIdRef.current = chat.id;
    setMessages([]);
    socket.current.emit("join_chat", chat.id);
    try {
      const history = await getMessages(chat.id);
      setMessages(history);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const filteredConversations = conversations.filter(c => 
    `${c.sender_firstname} ${c.sender_lastname} ${c.receiver_firstname} ${c.receiver_lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-100px)] bg-gray-50/50 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
      {/* Sidebar */}
      <div className={`flex-col bg-white border-r border-gray-100 overflow-hidden w-full md:w-80 lg:w-96 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#050F2A] rounded-xl flex items-center justify-center text-white">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#050F2A]">Global Monitor</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin View Only</p>
            </div>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search chats by user..."
              className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-[#050F2A] outline-none focus:ring-2 ring-[#050F2A]/5 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
          {filteredConversations.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleSelectChat(chat)}
              className={`w-full flex flex-col p-4 rounded-2xl transition-all duration-300 ${activeChat?.id === chat.id ? 'bg-[#050F2A] text-white shadow-lg' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">Conversation #{chat.id}</span>
                <span className="text-[10px] font-bold opacity-60">
                  {chat.last_message_at ? new Date(chat.last_message_at).toLocaleDateString() : ''}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex -space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">
                    {chat.sender_firstname[0]}
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-purple-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-purple-600">
                    {chat.receiver_firstname[0]}
                  </div>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className={`text-xs font-black truncate ${activeChat?.id === chat.id ? 'text-white' : 'text-[#050F2A]'}`}>
                    {chat.sender_firstname} ↔ {chat.receiver_firstname}
                  </p>
                </div>
              </div>
              <p className={`text-[11px] font-medium truncate italic ${activeChat?.id === chat.id ? 'text-white/70' : 'text-gray-400'}`}>
                {chat.last_message || "Empty chat"}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main View Area */}
      <div className={`flex-1 flex flex-col bg-white overflow-hidden ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <button onClick={() => setActiveChat(null)} className="md:hidden p-2 hover:bg-gray-50 rounded-xl">
                  <ChevronLeft size={24} />
                </button>
                <div>
                  <h3 className="font-black text-[#050F2A]">Monitoring: {activeChat.sender_firstname} & {activeChat.receiver_firstname}</h3>
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Read Only Mode</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#FAFBFF]"
            >
              {messages.map((msg, idx) => {
                const isSender = msg.sender_id === activeChat.sender_id;
                const senderName = isSender ? activeChat.sender_firstname : activeChat.receiver_firstname;
                
                return (
                  <div key={msg.id || idx} className={`flex flex-col ${isSender ? 'items-start' : 'items-end'}`}>
                    <span className="text-[9px] font-black text-gray-400 uppercase mb-1 px-2">{senderName}</span>
                    <div className={`max-w-[70%] p-4 rounded-2xl text-sm font-medium shadow-sm ${isSender ? 'bg-white text-[#050F2A] rounded-tl-none border border-gray-100' : 'bg-gray-800 text-white rounded-tr-none'}`}>
                      {msg.message_text}
                    </div>
                    <span className="mt-1.5 text-[9px] font-bold text-gray-300">
                      {new Date(msg.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Admin Notice */}
            <div className="p-4 bg-yellow-50 border-t border-yellow-100 text-center">
              <p className="text-[10px] font-bold text-yellow-700 uppercase tracking-widest">
                Admins can only monitor conversations for safety and compliance.
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
              <MessageSquare size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-black text-[#050F2A] mb-2">Select a Conversation</h3>
            <p className="text-sm text-gray-400 font-bold max-w-xs">
              Monitor all platform interactions in real-time. Select a chat from the sidebar to begin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ALLChat;
