import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, FileText, CheckCircle, AlertCircle, Info } from "lucide-react";

const TermsOfUse = () => {
  const lastUpdated = "May 1, 2026";

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing or using the Rently platform, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
    },
    {
      title: "2. Use License",
      content: "Permission is granted to temporarily download one copy of the materials on Rently's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title."
    },
    {
      title: "3. User Conduct",
      content: "You agree not to use the platform for any unlawful purpose or to engage in any conduct that harms Rently or its users. You are responsible for all content you post and all rental transactions you enter into."
    },
    {
      title: "4. Disclaimer",
      content: "The materials on Rently's website are provided on an 'as is' basis. Rently makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability."
    },
    {
      title: "5. Limitations",
      content: "In no event shall Rently or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Rently's website."
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
          <span className="text-gray-900 font-semibold">Terms Of Use</span>
        </div>

        {/* Header */}
        <div className="bg-[#0F172A] rounded-3xl p-10 mb-8 overflow-hidden relative group">
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 transition-transform group-hover:scale-110"></div>
           <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center mb-6 border border-white/10">
                 <FileText size={24} />
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-white mb-4">Terms Of Use</h1>
              <p className="text-gray-400 font-medium">Last Updated: {lastUpdated}</p>
           </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm space-y-12">
           {sections.map((section, idx) => (
             <div key={idx} className="space-y-4">
                <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-3">
                   <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-[#0F172A] text-xs font-black">
                      {idx + 1}
                   </div>
                   {section.title}
                </h2>
                <p className="text-gray-600 leading-relaxed font-medium text-[15px] pl-11">
                   {section.content}
                </p>
             </div>
           ))}

           {/* Important Note */}
           <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex gap-4 mt-12">
              <div className="shrink-0 text-amber-600 mt-0.5">
                 <AlertCircle size={20} />
              </div>
              <div className="space-y-1">
                 <h3 className="font-bold text-amber-900 text-sm">Important Notice</h3>
                 <p className="text-xs text-amber-700 font-medium leading-relaxed">
                    By using Rently, you agree to these terms. We may update these terms from time to time, and your continued use of the platform constitutes acceptance of those changes.
                 </p>
              </div>
           </div>

           <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                 <Info size={16} />
                 <span>Need clarification on any of these terms?</span>
              </div>
              <Link to="/contact" className="text-[#0F172A] font-bold text-sm hover:underline">
                 Contact Support
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
