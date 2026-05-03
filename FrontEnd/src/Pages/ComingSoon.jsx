import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row items-center justify-center px-6 lg:px-24 py-12 lg:py-0 overflow-hidden">
      {/* Left Content */}
      <div className="lg:w-1/2 max-w-xl text-center lg:text-left mb-12 lg:mb-0 z-10">
        <h1 className="text-[56px] lg:text-[72px] font-black text-[#0F172A] leading-[1.1] mb-6 tracking-tight">
          Coming Soon
        </h1>
        <p className="text-[18px] text-gray-500 mb-10 font-medium max-w-md mx-auto lg:mx-0">
          We're working hard to launch the app soon. Stay tuned for a new way to rent and manage your products!
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center bg-[#0F172A] text-white px-10 py-4 rounded-full font-bold text-[15px] hover:bg-black transition-all active:scale-95 shadow-xl hover:shadow-2xl hover:-translate-y-1"
        >
          Back To Home
        </Link>
      </div>

      {/* Right Content - Mockup Image */}
      <div className="lg:w-1/2 flex justify-center items-center relative h-full">
         <div className="relative w-full max-w-[800px] animate-in fade-in slide-in-from-right-10 duration-1000">
            <img 
              src="/app-mockup.png" 
              alt="Rently App Mockups" 
              className="w-full h-auto object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]"
            />
            {/* Decorative Gradients */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#B8A0FF]/10 rounded-full blur-[80px] -z-10 animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-100/20 rounded-full blur-[80px] -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
         </div>
      </div>
    </div>
  );
};

export default ComingSoon;
