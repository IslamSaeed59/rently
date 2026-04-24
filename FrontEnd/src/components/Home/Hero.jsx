import { Search } from "lucide-react";

const Hero = () => {
  return (
    <section
      className="min-h-[380px] flex items-center justify-center text-center px-8 py-16 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #050F2A 0%, #07132e 60%, #0a1931 100%)",
      }}
    >
      {/* radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, rgba(167, 139, 250, 0.1) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        {/* Heading */}
        <h1
          className="text-[54px] font-extrabold leading-[1.1] mb-[10px]"
          style={{ color: "#FFFFFF" }}
        >
          Rent <span style={{ color: "#A78BFA" }}>Smarter</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-[17px] mb-9"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          Egypt's #1 Rental Marketplace
        </p>

        {/* Search Bar */}
        <div
          className="flex flex-col md:flex-row items-center bg-white rounded-[24px] md:rounded-full p-2 w-full max-w-[750px] mx-auto shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)] transition-all duration-300 focus-within:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]"
        >
          <div className="flex items-center flex-1 w-full px-4 py-2 md:py-0">
            <Search
              size={18}
              className="text-gray-400 shrink-0"
            />
            <input
              type="text"
              placeholder="What are you looking for?"
              className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-[15px] text-gray-800 placeholder:text-gray-400 font-medium"
            />
          </div>

          <div className="hidden md:block w-px h-8 bg-gray-100" />

          {/* Date Select */}
          <div className="w-full md:w-auto px-4 border-t md:border-t-0 border-gray-50">
            <select
              className="w-full md:w-auto bg-transparent border-none outline-none py-3 md:py-0 text-[14px] text-gray-600 font-semibold cursor-pointer min-w-[130px] hover:text-indigo-600 transition-colors"
            >
              <option value="">Any Date</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>

          <div className="hidden md:block w-px h-8 bg-gray-100" />

          {/* City Select */}
          <div className="w-full md:w-auto px-4 border-t md:border-t-0 border-gray-50">
            <select
              className="w-full md:w-auto bg-transparent border-none outline-none py-3 md:py-0 text-[14px] text-gray-600 font-semibold cursor-pointer min-w-[130px] hover:text-indigo-600 transition-colors"
            >
              <option value="">Anywhere</option>
              <option>Cairo</option>
              <option>Alexandria</option>
              <option>Giza</option>
            </select>
          </div>

          {/* Search Button */}
          <button
            className="w-full md:w-auto bg-[#050F2A] text-white px-9 py-4 md:py-3.5 rounded-2xl md:rounded-full font-bold text-[15px] transition-all duration-300 hover:bg-black hover:shadow-lg active:scale-95 mt-2 md:mt-0"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
