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
} from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChange"));
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <header className="w-full sticky top-0 z-50 shadow-sm">
      {/* Main Navigation Bar */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-10 py-3 flex justify-between items-center gap-4">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center h-16">
            <Link to="/" className="block">
              <img
                src="/Small-logo.png"
                alt="Rently Logo"
                className="h-30 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex flex-1 justify-center items-center gap-12 text-[#0B0915] font-semibold text-[17px]">
            <li>
              <Link to="/" className="relative group py-2">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#4A3E85] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link to="/contact" className="relative group py-2">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#4A3E85] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <Link to="/about" className="relative group py-2">
                About
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#4A3E85] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          </ul>

          {/* Desktop Right Side (Search + Auth) */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-100 border-none py-2.5 pl-5 pr-12 rounded-full text-sm w-48 xl:w-64 focus:outline-none focus:ring-2 focus:ring-[#4A3E85]/20 focus:bg-white transition-all duration-300"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#0B0915] rounded-full text-white cursor-pointer">
                <Search className="w-4 h-4" />
              </div>
            </div>

            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-[#4A3E85] text-white flex items-center justify-center font-bold shadow-sm">
                    {user?.Firstname?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-semibold truncate max-w-[100px]">
                    {user?.Firstname || "User"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 font-bold text-sm shadow-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-[#0B0915] hover:text-[#4A3E85] transition-colors font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-[#0B0915] text-white px-6 py-2 rounded-full hover:bg-[#4A3E85] transition-all duration-300 shadow-lg active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center gap-3">
            {isLoggedIn && (
              <div className="w-9 h-9 rounded-full bg-[#4A3E85] text-white flex items-center justify-center font-bold shadow-sm">
                {user?.Firstname?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
            <button
              onClick={() => setIsOpen(true)}
              className="p-2.5 text-[#0B0915] bg-gray-100 rounded-full hover:bg-gray-200 transition-colors active:scale-95"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* ===================== Mobile Sidebar ===================== */}
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] bg-[#0B0915]/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer Panel */}
      <div
        className={`lg:hidden fixed top-0 right-0 z-[70] h-screen w-[88%] max-w-[400px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex-shrink-0 flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <img src="/Small-logo.png" alt="Logo" className="h-9 w-auto" />
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Profile Section (If logged in) */}
        {isLoggedIn && (
          <div className="flex-shrink-0 flex items-center gap-4 px-5 py-4 bg-gray-50 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-[#4A3E85] text-white flex items-center justify-center text-xl font-bold shadow-md">
              {user?.Firstname?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-[#0B0915] text-base leading-tight">
                {user?.Firstname} {user?.LastName}
              </h3>
              <p className="text-sm text-gray-500 truncate">{user?.Email}</p>
            </div>
          </div>
        )}

        {/* Navigation Links — flex-1 so it fills remaining height */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-2 min-h-0">
          <Link
            to="/"
            className="flex items-center justify-between px-4 py-4 text-[#0B0915] bg-gray-50 hover:bg-[#4A3E85]/10 rounded-2xl transition-colors group"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center gap-4 font-semibold text-base">
              <Home className="w-5 h-5 text-[#4A3E85]" />
              Home
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#4A3E85] transition-colors" />
          </Link>
          <Link
            to="/contact"
            className="flex items-center justify-between px-4 py-4 text-[#0B0915] hover:bg-[#4A3E85]/10 rounded-2xl transition-colors group"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center gap-4 font-semibold text-base">
              <Phone className="w-5 h-5 text-gray-400 group-hover:text-[#4A3E85]" />
              Contact
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#4A3E85] transition-colors" />
          </Link>
          <Link
            to="/about"
            className="flex items-center justify-between px-4 py-4 text-[#0B0915] hover:bg-[#4A3E85]/10 rounded-2xl transition-colors group"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center gap-4 font-semibold text-base">
              <Info className="w-5 h-5 text-gray-400 group-hover:text-[#4A3E85]" />
              About
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#4A3E85] transition-colors" />
          </Link>
        </nav>

        {/* Bottom Action Buttons */}
        <div className="flex-shrink-0 px-4 py-5 border-t border-gray-100 bg-white">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white py-4 rounded-xl font-bold text-base transition-all active:scale-95 border border-red-100 hover:border-red-500"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                className="flex items-center justify-center py-4 bg-gray-50 text-[#0B0915] rounded-xl font-bold transition-all active:scale-95 border border-gray-200 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Login to Account
              </Link>
              <Link
                to="/signup"
                className="flex items-center justify-center py-4 bg-[#0B0915] text-white rounded-xl font-bold shadow-md transition-all active:scale-95 hover:bg-[#4A3E85]"
                onClick={() => setIsOpen(false)}
              >
                Create New Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
