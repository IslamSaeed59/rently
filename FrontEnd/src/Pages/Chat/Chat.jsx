import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  MoreVertical,
  Send,
  Paperclip,
  Image as ImageIcon,
  Info,
  ChevronLeft,
  Circle,
  MessageSquare,
  Check,
  CheckCheck,
} from "lucide-react";
import { io } from "socket.io-client";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "../../server/ChatApi";
import { toast } from "react-toastify";

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const socket = useRef(null);
  const activeChatIdRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

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
    // Connect to socket only once on mount
    socket.current = io("http://localhost:9000");

    if (currentUser.id) {
      socket.current.emit("join_user", currentUser.id);
    }

    // Listen for new messages (stable listener)
    socket.current.on("receive_message", (message) => {
      console.log("Received message:", message);
      if (activeChatIdRef.current === message.conversation_id) {
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === message.id);
          if (exists) return prev;
          return [...prev, message];
        });

        // If message is from other user and we are in the chat, mark as read immediately
        if (message.sender_id !== currentUser.id) {
          socket.current.emit("read_messages", {
            conversation_id: message.conversation_id,
            reader_id: currentUser.id,
            sender_id: message.sender_id,
          });
        }
      }
      fetchConversations();
    });

    socket.current.on("messages_read", (data) => {
      if (activeChatIdRef.current === data.conversation_id) {
        setMessages((prev) => prev.map((m) => ({ ...m, is_read: true })));
      }
      fetchConversations();
    });

    socket.current.on("new_notification", (notif) => {
      if (notif.type === "new_message") {
        fetchConversations();
      }
    });

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, []); // Mount only

  // Join chat room when activeChat changes
  useEffect(() => {
    if (activeChat && socket.current) {
      socket.current.emit("join_chat", activeChat.id);
    }
  }, [activeChat]);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const data = await getConversations();
      setConversations(data);

      // If we came from ProductDetails with a specific conversation ID
      if (location.state?.conversationId && !activeChat) {
        const target = data.find((c) => c.id === location.state.conversationId);
        if (target) handleSelectChat(target);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = async (chat) => {
    setActiveChat(chat);
    activeChatIdRef.current = chat.id;
    setMessages([]);
    socket.current.emit("join_chat", chat.id);

    // Notify sender that we've read their messages
    socket.current.emit("read_messages", {
      conversation_id: chat.id,
      reader_id: currentUser.id,
      sender_id: chat.other_user_id,
    });

    try {
      const history = await getMessages(chat.id);
      setMessages(history);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const messageData = {
      conversation_id: activeChat.id,
      sender_id: currentUser.id,
      receiver_id: activeChat.other_user_id,
      message_text: newMessage,
    };

    // Optimistically update local messages if needed,
    // but socket will broadcast back to us via "receive_message"
    // To avoid duplicates, we rely on the socket emitting to the room we are in.

    socket.current.emit("send_message", messageData);
    setNewMessage("");
  };

  const filteredConversations = conversations.filter((c) =>
    `${c.other_user_firstname} ${c.other_user_lastname}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex h-screen bg-[#FDFDFF] pt-24 pb-6 px-6 md:px-20 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden w-full md:w-80 lg:w-96 ${activeChat ? "hidden md:flex" : "flex"}`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-[#050F2A]">Messages</h2>
            <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
              <MoreVertical size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="relative mb-6">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-[#F8F9FF] border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-[#050F2A] outline-none focus:ring-2 ring-[#A78BFA]/20 transition-all"
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
              className={`w-full flex items-center gap-4 p-4 rounded-[1.5rem] transition-all duration-300 ${activeChat?.id === chat.id ? "bg-[#A78BFA] text-white shadow-lg shadow-[#A78BFA]/20" : "hover:bg-gray-50"}`}
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0">
                  <img
                    src={`https://ui-avatars.com/api/?name=${chat.other_user_firstname}+${chat.other_user_lastname}&background=random`}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full"></div>
              </div>

              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`font-black truncate ${activeChat?.id === chat.id ? "text-white" : "text-[#050F2A]"}`}
                  >
                    {chat.other_user_firstname} {chat.other_user_lastname}
                  </span>
                  <span
                    className={`text-[10px] font-bold ${activeChat?.id === chat.id ? "text-white/70" : "text-gray-400"}`}
                  >
                    {chat.last_message_at
                      ? new Date(chat.last_message_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>
                <p
                  className={`text-sm font-medium truncate ${activeChat?.id === chat.id ? "text-white/80" : "text-gray-500"}`}
                >
                  {chat.last_message || "No messages yet"}
                </p>
              </div>

              {chat.unread_count > 0 && activeChat?.id !== chat.id && (
                <div className="w-5 h-5 bg-[#A78BFA] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {chat.unread_count}
                </div>
              )}
            </button>
          ))}

          {filteredConversations.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-400 font-bold">No conversations found</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div
        className={`flex-1 flex flex-col bg-white md:ml-8 rounded-3xl shadow-sm border border-gray-100 overflow-hidden ${!activeChat ? "hidden md:flex" : "flex"}`}
      >
        {activeChat ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveChat(null)}
                  className="md:hidden p-2 hover:bg-gray-50 rounded-xl"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden">
                  <img
                    src={`https://ui-avatars.com/api/?name=${activeChat.other_user_firstname}+${activeChat.other_user_lastname}&background=random`}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-black text-[#050F2A]">
                    {activeChat.other_user_firstname}{" "}
                    {activeChat.other_user_lastname}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <Circle
                      size={8}
                      className="fill-green-500 text-green-500"
                    />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Active Now
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {activeChat.product_id && (
                  <button
                    onClick={() =>
                      navigate(`/product/${activeChat.product_id}`)
                    }
                    className="bg-[#050F2A] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-all"
                  >
                    <ImageIcon size={14} />
                    Item Details
                  </button>
                )}
                <button className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors">
                  <MoreVertical size={20} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              {/* Product Context Card (Optional top sticky or first message) */}
              {activeChat.product_id && (
                <div className="flex justify-center mb-8">
                  <div className="bg-[#F8F9FF] border border-gray-100 rounded-[2rem] p-4 flex items-center gap-4 max-w-md w-full">
                    <div className="w-20 h-20 rounded-2xl bg-white p-2 flex-shrink-0">
                      <img
                        src={
                          activeChat.product_image
                            ? activeChat.product_image.startsWith("http")
                              ? activeChat.product_image
                              : `http://localhost:9000${activeChat.product_image}`
                            : "https://via.placeholder.com/800"
                        }
                        alt="Product"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-[#050F2A] truncate mb-1">
                        {activeChat.product_name}
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                        Reference Item
                      </p>
                      <button
                        onClick={() =>
                          navigate(`/product/${activeChat.product_id}`)
                        }
                        className="text-[#A78BFA] text-xs font-black hover:underline"
                      >
                        View Product
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => {
                const isMine = msg.sender_id === currentUser.id;
                return (
                  <div
                    key={msg.id || idx}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] ${isMine ? "order-2" : "order-1"}`}
                    >
                      <div
                        className={`p-4 rounded-2xl text-sm font-medium ${isMine ? "bg-[#A78BFA] text-white rounded-tr-none shadow-lg shadow-[#A78BFA]/10" : "bg-[#F3F4F6] text-[#050F2A] rounded-tl-none"}`}
                      >
                        {msg.message_text}
                      </div>
                      <div
                        className={`mt-2 flex items-center gap-2 ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <span className="text-[10px] font-bold text-gray-400">
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {isMine && (
                          <div
                            className={
                              msg.is_read ? "text-blue-500" : "text-gray-400"
                            }
                          >
                            {msg.is_read ? (
                              <CheckCheck size={14} />
                            ) : (
                              <Check size={14} />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-50 bg-white">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-4 bg-[#F8F9FF] rounded-2xl p-2 pl-4"
              >
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent border-none outline-none py-3 text-sm font-bold text-[#050F2A]"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-12 h-12 bg-[#050F2A] text-white rounded-xl flex items-center justify-center hover:bg-[#A78BFA] transition-all disabled:opacity-50 active:scale-95"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="w-32 h-32 bg-[#F8F9FF] rounded-full flex items-center justify-center mb-8">
              <MessageSquare size={48} className="text-[#A78BFA]" />
            </div>
            <h3 className="text-2xl font-black text-[#050F2A] mb-4">
              Your Inbox
            </h3>
            <p className="text-gray-400 max-w-sm font-bold">
              Select a conversation to start chatting with buyers or sellers
              about premium rentals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
