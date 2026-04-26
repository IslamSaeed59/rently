import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, ChevronDown, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import locations from "../../locations.json";

const Hero = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword) params.append("q", keyword);
    if (governorate) params.append("gov", governorate);
    navigate(`/search?${params.toString()}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section
      className="min-h-[600px] flex items-center justify-center text-center px-8 py-16 relative"
      style={{
        background: "linear-gradient(160deg, #050F2A 0%, #07132e 60%, #0a1931 100%)",
      }}
    >
      {/* Background container with overflow hidden for animated elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#A78BFA]/10 blur-[130px] rounded-full -translate-y-1/2 translate-x-1/4 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-blue-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="relative z-20 w-full max-w-[1000px]">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] animate-ping" />
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#A78BFA]">
            Egypt's #1 Rental Platform
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
          Rent <span className="text-[#A78BFA]">Everything</span> <br />
          You Can Imagine
        </h1>

        {/* Subtitle */}
        <p className="text-[18px] md:text-xl text-white/50 mb-12 font-medium max-w-[600px] mx-auto leading-relaxed">
          The largest marketplace in Egypt to rent cameras, cars, tools, and much more in minutes.
        </p>

        {/* Search Bar Container */}
        <div className="flex flex-col md:flex-row items-center bg-white rounded-[2.5rem] p-2 w-full max-w-[900px] mx-auto shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] group transition-all duration-500 hover:shadow-[0_50px_120px_-25px_rgba(0,0,0,0.7)] relative z-30">
          
          {/* Keyword Input */}
          <div className="flex items-center flex-1 w-full px-8 py-5 md:py-0">
            <Search size={22} className="text-[#A78BFA] shrink-0" />
            <input
              type="text"
              placeholder="What are you looking for?"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 bg-transparent border-none outline-none px-4 text-[16px] text-[#050F2A] placeholder:text-gray-400 font-bold"
            />
          </div>

          <div className="hidden md:block w-px h-10 bg-gray-100" />

          {/* Custom Modern Dropdown */}
          <div className="relative w-full md:w-auto min-w-[220px]" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between gap-4 px-8 py-5 md:py-4 hover:bg-gray-50/50 transition-colors rounded-3xl"
            >
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-[#A78BFA]" />
                <span className={`text-[15px] font-black whitespace-nowrap ${governorate ? 'text-[#050F2A]' : 'text-gray-400'}`}>
                  {governorate || "Any City"}
                </span>
              </div>
              <ChevronDown size={18} className={`text-gray-300 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-[calc(100%+15px)] left-0 w-full md:w-[300px] bg-white rounded-[2rem] shadow-[0_30px_70px_rgba(0,0,0,0.2)] border border-gray-100 py-4 z-[100] max-h-[350px] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="px-6 py-2 mb-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Location</span>
                </div>
                <button
                  onClick={() => { setGovernorate(""); setIsDropdownOpen(false); }}
                  className="w-full px-6 py-3 text-left hover:bg-[#F8F7FF] transition-all flex items-center justify-between group"
                >
                  <span className={`text-[14px] font-bold ${!governorate ? 'text-[#A78BFA]' : 'text-gray-600'}`}>Any City</span>
                  {!governorate && <Check size={16} className="text-[#A78BFA]" />}
                </button>
                {locations.governorates.map((gov) => (
                  <button
                    key={gov.id}
                    onClick={() => { setGovernorate(gov.name); setIsDropdownOpen(false); }}
                    className="w-full px-6 py-3 text-left hover:bg-[#F8F7FF] transition-all flex items-center justify-between group"
                  >
                    <span className={`text-[14px] font-bold ${governorate === gov.name ? 'text-[#A78BFA]' : 'text-gray-600 group-hover:text-[#050F2A]'}`}>
                      {gov.name}
                    </span>
                    {governorate === gov.name && <Check size={16} className="text-[#A78BFA]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="p-1.5 w-full md:w-auto">
            <button
              onClick={handleSearch}
              className="w-full md:w-auto bg-[#050F2A] text-white px-10 py-5 md:py-4 rounded-full font-black text-lg transition-all duration-300 hover:bg-[#A78BFA] hover:shadow-xl active:scale-95 whitespace-nowrap shadow-lg shadow-[#050F2A]/10"
            >
              Search Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
