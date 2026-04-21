import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const Navbar = () => {
  return (
    <header className="w-full sticky top-0 z-50 shadow-sm  ">
      {/* Main Navigation */}
      <nav className="w-full bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-10 py-3 flex justify-between items-center gap-4">
          {/* Logo Container - Standard & Natural */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="block">
              <img
                src="/Logo-small.png"
                alt="Rently Logo"
                className="h-15 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <ul className="hidden lg:flex items-center gap-8 text-black font-normal text-[15px]">
            <li>
              <Link to="/" className="hover:text-gray-600 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-gray-600 transition-colors"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-gray-600 transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="hover:text-gray-600 transition-colors font-medium"
              >
                Sign Up
              </Link>
            </li>
          </ul>

          {/* Search Bar and Functional Icons */}
          <div className="flex items-center gap-3 md:gap-5">
            <div className="relative group hidden md:block">
              <input
                type="text"
                placeholder="What are you looking for?"
                className="bg-[#F5F5F5] py-2 pl-4 pr-10 rounded text-sm w-60 focus:outline-none border border-transparent focus:border-gray-200 transition-all"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
