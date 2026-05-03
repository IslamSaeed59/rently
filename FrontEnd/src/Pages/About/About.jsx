import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Users, ShoppingBag, DollarSign, Store, Truck, Headphones, ShieldCheck } from "lucide-react";

const Counter = ({ target, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = parseFloat(target);
    const increment = end / (duration / 16); // 60fps approx

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  return (
    <span ref={elementRef}>
      {count % 1 === 0 ? count.toLocaleString() : count.toFixed(1)}
      {suffix}
    </span>
  );
};

const About = () => {
  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-[12px] text-gray-500 mb-12 font-medium tracking-wide">
          <Link to="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="mx-1.5 opacity-50" />
          <span className="text-gray-900 font-semibold">About Us</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl lg:text-5xl font-black text-[#0F172A] leading-tight">
              Our Story
            </h1>
            <p className="text-gray-600 leading-relaxed text-[15px]">
              Launched in 2026, Rently is Egypt’s premier online rental marketplace with an active presence in Cairo. 
              Supported by a wide range of tailored marketing, data and service solutions, Rently has 10,500 sellers 
              and 300 brands and serves 3 millions users across the region.
            </p>
            <p className="text-gray-600 leading-relaxed text-[15px]">
              Rently has more than 1 Million products to offer, growing at a very fast pace. Rently offers a diverse 
              assortment in categories ranging from consumer electronics to household goods, beauty, fashion, 
              medical equipment, and accessories.
            </p>
          </div>
          <div className="lg:w-1/2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-100">
               <img 
                 src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
                 alt="Our Team" 
                 className="w-full h-full object-cover aspect-[4/3]"
               />
               <div className="absolute inset-0 bg-indigo-900/10"></div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
           {[
             { icon: Store, value: 10.5, suffix: "k", label: "Sellers active our site" },
             { icon: DollarSign, value: 33, suffix: "k", label: "Monthly Product Sale", active: true },
             { icon: ShoppingBag, value: 45.5, suffix: "k", label: "Customer active in our site" },
             { icon: Users, value: 25, suffix: "k", label: "Annual gross sales in our site" },
           ].map((stat, idx) => (
             <div 
               key={idx} 
               className={`p-8 rounded-2xl border ${stat.active ? 'bg-[#0F172A] text-white border-transparent shadow-xl' : 'bg-white text-[#0F172A] border-gray-100 hover:border-indigo-100 shadow-sm'} transition-all text-center group cursor-default`}
             >
                <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${stat.active ? 'bg-white/10' : 'bg-indigo-50 text-indigo-600'}`}>
                   <stat.icon size={28} />
                </div>
                <h3 className="text-3xl font-black mb-2 tracking-tight">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </h3>
                <p className={`text-[13px] font-medium ${stat.active ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
             </div>
           ))}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 py-12 border-t border-gray-100">
           {[
             { 
               icon: Truck, 
               title: "FREE AND FAST DELIVERY", 
               desc: "Free delivery for all orders over $140" 
             },
             { 
               icon: Headphones, 
               title: "24/7 CUSTOMER SERVICE", 
               desc: "Friendly 24/7 customer support" 
             },
             { 
               icon: ShieldCheck, 
               title: "MONEY BACK GUARANTEE", 
               desc: "We return money within 30 days" 
             },
           ].map((feature, idx) => (
             <div key={idx} className="text-center group">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-6 border-[8px] border-white ring-2 ring-gray-100 group-hover:bg-[#0F172A] group-hover:text-white transition-all duration-300">
                   <feature.icon size={24} />
                </div>
                <h3 className="text-sm font-black mb-2 tracking-wide uppercase">{feature.title}</h3>
                <p className="text-[12px] text-gray-500 font-medium">{feature.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default About;
