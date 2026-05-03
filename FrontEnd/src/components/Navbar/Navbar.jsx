import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  LogOut,
  Home,
  Phone,
  Info,
  ChevronRight,
  ShoppingCart,
  User,
  Bell,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { getConversations } from "../../server/ChatApi";
import { getNotifications, markAsRead } from "../../server/NotificationsApi";
import { io } from "socket.io-client";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const navigate = useNavigate();

  const isAdmin = user?.Email === "admin@gmail.com";

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    setIsLoggedIn(!!token);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("authChange", checkAuth);
    return () => window.removeEventListener("authChange", checkAuth);
  }, []);

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchUnreadCount();
      fetchNotifications();
      
      const socket = io("http://localhost:9000");
      socket.emit("join_user", user.id);
      
      socket.on("new_notification", (notif) => {
        if (notif.type === "new_message") {
          fetchUnreadCount();
        } else {
          // New rental request or status update
          setNotifications(prev => [notif, ...prev]);
        }
      });

      return () => socket.disconnect();
    }
  }, [isLoggedIn, user]);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const convs = await getConversations();
      const count = convs.reduce((acc, curr) => acc + (curr.unread_count || 0), 0);
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChange"));
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <header className="w-full sticky top-0 z-[100] shadow-sm">
      {/* Main Navigation Bar */}
      <nav className="w-full bg-[#050F2A]">
        <div className="container mx-auto px-4 lg:px-8 h-[76px] flex justify-between items-center gap-8">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="block">
              <img
                src="/LOOGO.png"
                alt="Rently Logo"
                className="h-35 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex gap-7 ml-2">
            {[
              { label: "Home", href: "/" },
              { label: "Contact", href: "/contact" },
              { label: "About", href: "/about" },
              ...(isAdmin ? [{ label: "Admin", href: "/admin" }] : []),
            ].map(({ label, href }) => (
              <li key={label}>
                <Link
                  to={href}
                  className="text-[14px] font-medium no-underline text-white/85 hover:text-white transition-all duration-[220ms] ease-[cubic-bezier(.4,0,.2,1)]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-[340px] ml-auto relative"></div>

          {/* Desktop Right Side (Auth & Actions) */}
          <div className="hidden lg:flex items-center gap-5 ml-3">
            {isLoggedIn ? (
              <>
                <Link
                  to="/chat"
                  className="flex text-white/80 hover:text-white transition-all duration-[220ms] ease-[cubic-bezier(.4,0,.2,1)] relative"
                  title="Messages"
                >
                  <MessageSquare size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#050F2A]">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/profile"
                  className="flex text-white/80 hover:text-white transition-all duration-[220ms] ease-[cubic-bezier(.4,0,.2,1)]"
                >
                  <User size={18} />
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setShowNotifs(!showNotifs)}
                    className={`flex transition-all duration-[220ms] ${showNotifs ? "text-white" : "text-white/80 hover:text-white"}`}
                  >
                    <Bell size={18} />
                    {notifications.filter(n => !n.is_read).length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#B8A0FF] text-[#050F2A] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#050F2A]">
                        {notifications.filter(n => !n.is_read).length}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifs && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)}></div>
                      <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-top-2">
                        <div className="p-4 bg-[#050F2A] text-white flex justify-between items-center">
                          <h3 className="font-bold text-sm">Notifications</h3>
                          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">New</span>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                              <Bell size={32} className="mx-auto mb-2 opacity-20" />
                              <p className="text-sm">No notifications yet</p>
                            </div>
                          ) : (
                            notifications.slice(0, 5).map((notif) => (
                              <div 
                                key={notif.id || Math.random()} 
                                onClick={async () => {
                                  if (!notif.is_read && notif.id) {
                                    await markAsRead(notif.id);
                                    // Update local state to mark as read instead of removing
                                    setNotifications(prev => 
                                      prev.map(n => n.id === notif.id ? { ...n, is_read: 1 } : n)
                                    );
                                  }
                                  setShowNotifs(false);
                                  if (notif.type === 'rental_request') navigate('/profile/booking-requests');
                                  else if (notif.type.startsWith('request_')) navigate('/profile/my-rentals');
                                }}
                                className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors flex gap-3 ${!notif.is_read ? 'bg-blue-50/40' : 'bg-white'}`}
                              >
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                  {notif.sender_image ? (
                                    <img src={notif.sender_image.startsWith('http') ? notif.sender_image : `http://localhost:9000${notif.sender_image}`} className="w-full h-full object-cover" />
                                  ) : (
                                    <User size={16} className="text-gray-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[13px] text-[#050F2A] leading-snug mb-1">
                                    <span className="font-bold">{notif.sender_name}</span> {notif.message}
                                  </p>
                                  <span className="text-[10px] text-gray-400">
                                    {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                {!notif.is_read && <div className="w-2 h-2 bg-[#B8A0FF] rounded-full self-center"></div>}
                              </div>
                            ))
                          )}
                        </div>
                        {notifications.length > 0 && (
                          <button 
                            className="w-full py-3 text-center text-[12px] font-bold text-[#050F2A] bg-gray-50 hover:bg-gray-100 transition-colors"
                            onClick={() => {
                              // Link to a full notifications page if needed
                              setShowNotifs(false);
                              navigate('/profile?tab=notifications');
                            }}
                          >
                            View All Notifications
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div className="w-[1px] h-4 bg-white/20 mx-1"></div>
                <button
                  onClick={handleLogout}
                  title="Log Out"
                  className="flex text-white/80 hover:text-red-400 transition-all duration-[220ms] ease-[cubic-bezier(.4,0,.2,1)]"
                >
                  <LogOut size={18} />
                </button>

                <button
                  onClick={() => navigate("/products/create")}
                  className="ml-2 bg-[#B8A0FF] text-[#050F2A] px-5 py-2 rounded-[24px] text-[13px] font-bold hover:opacity-90 transition-all shadow-sm active:scale-95"
                >
                  Add Products
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-[14px] font-medium text-white/85 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-[#050F2A] px-5 py-2 rounded-[24px] text-[13px] font-bold hover:bg-gray-100 transition-all shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center gap-4 ml-auto">
            {isLoggedIn && (
              <Link to="/profile" className="text-white/80 hover:text-white">
                <User size={20} />
              </Link>
            )}
            <button
              onClick={() => setIsOpen(true)}
              className="text-white/80 hover:text-white transition-colors active:scale-95"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* ===================== Mobile Sidebar ===================== */}
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`lg:hidden fixed top-0 right-0 z-[70] h-screen w-[88%] max-w-[400px] bg-[#050F2A] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex-shrink-0 flex justify-between items-center px-5 py-4 border-b border-white/10">
          <img src="/LOOGO.png" alt="Logo" className="h-30 w-auto" />
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white/80" />
          </button>
        </div>

        {/* Profile Section (If logged in) */}
        {isLoggedIn && (
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex-shrink-0 flex items-center gap-4 px-5 py-5 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border-b border-white/10"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center text-xl font-bold shadow-md">
              {user?.Firstname?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-white text-base leading-tight">
                {user?.Firstname} {user?.LastName}
              </h3>
              <p className="text-sm text-white/60 truncate">{user?.Email}</p>
            </div>
          </Link>
        )}

        {/* Navigation Links — flex-1 so it fills remaining height */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-2 min-h-0">
          <Link
            to="/"
            className="flex items-center justify-between px-4 py-4 text-white/85 hover:bg-white/10 hover:text-white rounded-2xl transition-colors group"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center gap-4 font-semibold text-base">
              <Home className="w-5 h-5 text-white/60 group-hover:text-white" />
              Home
            </div>
            <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
          </Link>
          <Link
            to="/contact"
            className="flex items-center justify-between px-4 py-4 text-white/85 hover:bg-white/10 hover:text-white rounded-2xl transition-colors group"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center gap-4 font-semibold text-base">
              <Phone className="w-5 h-5 text-white/60 group-hover:text-white" />
              Contact
            </div>
            <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
          </Link>
          <Link
            to="/about"
            className="flex items-center justify-between px-4 py-4 text-white/85 hover:bg-white/10 hover:text-white rounded-2xl transition-colors group"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center gap-4 font-semibold text-base">
              <Info className="w-5 h-5 text-white/60 group-hover:text-white" />
              About
            </div>
            <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
          </Link>
          {isLoggedIn && (
            <Link
              to="/chat"
              className="flex items-center justify-between px-4 py-4 text-white/85 hover:bg-white/10 hover:text-white rounded-2xl transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-4 font-semibold text-base">
                <MessageSquare className="w-5 h-5 text-white/60 group-hover:text-white" />
                Messages
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
              </div>
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center justify-between px-4 py-4 text-[#A78BFA] hover:bg-white/10 rounded-2xl transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-4 font-bold text-base">
                <ShieldCheck className="w-5 h-5 group-hover:text-white" />
                Admin Dashboard
              </div>
              <ChevronRight className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
            </Link>
          )}
        </nav>

        {/* Bottom Action Buttons */}
        <div className="flex-shrink-0 px-4 py-5 border-t border-white/10 bg-[#050F2A]">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white py-4 rounded-xl font-bold text-base transition-all active:scale-95 border border-red-500/20"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                className="flex items-center justify-center py-4 bg-white/10 text-white hover:bg-white/20 rounded-xl font-bold transition-all active:scale-95 border border-white/10"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center justify-center py-4 bg-white text-[#050F2A] hover:bg-gray-100 rounded-xl font-bold shadow-md transition-all active:scale-95"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
