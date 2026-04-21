import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-6xl w-full flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left space-y-6">
          <h1 className="text-5xl md:text-7xl font-black text-[#0B0915] tracking-tight">
            Ooops...
          </h1>
          <h2 className="text-3xl md:text-5xl font-light text-[#0B0915] opacity-80">
            Page 404 Found
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-md leading-relaxed">
            Sorry, the content you're looking for doesn't exist. Either it was
            removed, or you mistyped the link.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-8 bg-[#0B0915] text-white px-12 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform active:scale-95 shadow-xl"
          >
            Go Back
          </button>
        </div>

        {/* Right Illustration */}
        <div className="flex-1 w-full max-w-[500px] md:max-w-[600px]">
          <img
            src="/404 .png"
            alt="Page not found illustration"
            className="w-full h-auto drop-shadow-2xl animate-pulse-slow"
          />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
