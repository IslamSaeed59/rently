import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Shield, Lock, Eye, FileText } from "lucide-react";

const PrivacyPolicy = () => {
  const lastUpdated = "May 1, 2026";

  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, list a product for rent, or communicate with us. This may include your name, email address, phone number, and payment information."
    },
    {
      title: "2. How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services, to process transactions, and to communicate with you about your account and our services."
    },
    {
      title: "3. Sharing of Information",
      content: "We do not share your personal information with third parties except as described in this policy, such as with your consent, to comply with laws, or to protect our rights."
    },
    {
      title: "4. Security",
      content: "We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction."
    },
    {
      title: "5. Your Choices",
      content: "You may update your account information at any time by logging into your account settings. You may also opt out of receiving promotional communications from us."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 font-sans pb-20">
      <div className="max-w-4xl mx-auto px-6 pt-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-[12px] text-gray-500 mb-10 font-medium tracking-wide">
          <Link to="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="mx-1.5 opacity-50" />
          <span className="text-gray-900 font-semibold">Privacy Policy</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-3xl p-10 mb-8 border border-gray-100 shadow-sm overflow-hidden relative group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
           <div className="relative z-10">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
                 <Shield size={24} />
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-[#0F172A] mb-4">Privacy Policy</h1>
              <p className="text-gray-500 font-medium">Last Updated: {lastUpdated}</p>
           </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm space-y-12">
           {sections.map((section, idx) => (
             <div key={idx} className="space-y-4">
                <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-3">
                   <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                   {section.title}
                </h2>
                <p className="text-gray-600 leading-relaxed font-medium text-[15px]">
                   {section.content}
                </p>
             </div>
           ))}

           <div className="pt-10 border-t border-gray-100">
              <div className="bg-indigo-50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-indigo-600 shadow-sm">
                       <Lock size={20} />
                    </div>
                    <div>
                       <h3 className="font-bold text-[#0F172A] text-sm">Have privacy concerns?</h3>
                       <p className="text-xs text-gray-500 font-medium">Contact our privacy team anytime.</p>
                    </div>
                 </div>
                 <Link to="/contact" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold text-xs hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100">
                    Contact Us
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
