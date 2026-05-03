import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Plus, Minus, Search, HelpCircle } from "lucide-react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      question: "How do I create a rental request?",
      answer: "To create a rental request, browse the products, select the dates you need, and click on 'Rent Now'. The seller will be notified and can then approve or decline your request."
    },
    {
      question: "Is there a security deposit required?",
      answer: "Some sellers may require a security deposit. This will be clearly stated in the product description. The deposit is held by Rently and returned after the item is safely returned."
    },
    {
      question: "What happens if an item is damaged?",
      answer: "If an item is damaged during the rental period, please report it immediately through the chat system. Rently's protection policy covers various types of damage, and our support team will help mediate the process."
    },
    {
      question: "How can I track my rental?",
      answer: "You can track all your active rentals in your 'My Rentals' section in your profile. You'll see the status of each request and any updates from the seller."
    },
    {
      question: "How do I list my own products for rent?",
      answer: "Listing is easy! Go to your profile, click on 'Add Product', fill in the details, upload photos, and set your price. Your listing will be reviewed and published within 24 hours."
    },
    {
      question: "Can I cancel a rental request?",
      answer: "Yes, you can cancel a request as long as it hasn't been accepted by the seller. Once accepted, cancellation policies apply depending on how close it is to the start date."
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      <div className="max-w-4xl mx-auto px-6 pt-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-[12px] text-gray-500 mb-12 font-medium tracking-wide">
          <Link to="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="mx-1.5 opacity-50" />
          <span className="text-gray-900 font-semibold">FAQ</span>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <HelpCircle size={14} />
              <span>Help Center</span>
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-[#0F172A] mb-6">Frequently Asked Questions</h1>
           <p className="text-gray-500 max-w-lg mx-auto font-medium">
              Everything you need to know about renting and listing on Rently. Can't find the answer? Contact our support.
           </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
           {faqs.map((faq, idx) => (
             <div 
               key={idx} 
               className={`border rounded-2xl transition-all duration-300 ${activeIndex === idx ? 'border-indigo-100 bg-indigo-50/30' : 'border-gray-100 bg-white hover:border-gray-200'}`}
             >
                <button 
                  onClick={() => setActiveIndex(activeIndex === idx ? -1 : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                   <span className={`text-[15px] font-bold ${activeIndex === idx ? 'text-indigo-600' : 'text-[#0F172A]'}`}>
                      {faq.question}
                   </span>
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${activeIndex === idx ? 'bg-indigo-600 text-white rotate-180' : 'bg-gray-100 text-gray-400'}`}>
                      {activeIndex === idx ? <Minus size={16} /> : <Plus size={16} />}
                   </div>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                   <div className="px-6 pb-6 text-gray-500 text-[14px] leading-relaxed font-medium">
                      {faq.answer}
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-20 bg-[#0F172A] rounded-[2rem] p-10 text-center relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl transition-transform group-hover:scale-110"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full -ml-20 -mb-20 blur-3xl transition-transform group-hover:scale-110"></div>
           
           <h2 className="text-2xl font-bold text-white mb-4">Still have questions?</h2>
           <p className="text-gray-400 mb-8 max-w-sm mx-auto text-sm">
              Can't find the answer you're looking for? Please chat to our friendly team.
           </p>
           <Link 
             to="/contact" 
             className="inline-flex bg-white text-[#0F172A] px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors shadow-lg"
           >
              Contact Us
           </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
