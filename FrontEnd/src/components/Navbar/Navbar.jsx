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
import { io } from "socket.io-client";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
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
      
      const socket = io("http://localhost:9000");
      socket.emit("join_user", user.id);
      
      socket.on("new_notification", (notif) => {
        if (notif.type === "new_message") {
          fetchUnreadCount();
        }
      });

      return () => socket.disconnect();
    }
  }, [isLoggedIn, user]);

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
                <Link
                  to="#"
                  className="flex text-white/80 hover:text-white transition-all duration-[220ms] ease-[cubic-bezier(.4,0,.2,1)]"
                >
                  <Bell size={18} />
                </Link>
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
