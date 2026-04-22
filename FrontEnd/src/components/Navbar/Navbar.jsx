import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const Navbar = () => {
  return (
    <header className="w-full sticky top-0 z-50 shadow-sm  ">
      {/* Main Navigation */}
      <nav className="w-full bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-10 py-3 flex justify-between items-center gap-4">
          {/* Logo Container - Standard & Natural */}
          <div className="flex-shrink-0 flex items-center h-16">
            <Link to="/" className="block">
              <img
                src="/Small-logo.png"
                alt="Rently Logo"
                className="h-35 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <ul className="hidden lg:flex items-center gap-10 text-[#0B0915] font-medium text-[15px]">
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
            <li>
              <Link
                to="/signup"
                className="bg-[#0B0915] text-white px-6 py-2 rounded-full hover:bg-[#4A3E85] transition-all duration-300 shadow-lg active:scale-95"
              >
                Sign Up
              </Link>
            </li>
          </ul>

          {/* Search Bar and Functional Icons */}
          <div className="flex items-center gap-4">
            <div className="relative group hidden md:block">
              <input
                type="text"
                placeholder="What are you looking for?"
                className="bg-gray-50 border border-gray-100 py-2.5 pl-5 pr-12 rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#4A3E85]/20 focus:bg-white focus:border-[#4A3E85] transition-all duration-300 placeholder:text-gray-400 shadow-sm"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#0B0915] rounded-full text-white group-focus-within:bg-[#4A3E85] transition-colors cursor-pointer">
                <Search className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
