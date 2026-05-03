import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Send, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success(
        "Thank you for contacting us! We will get back to you soon.",
      );
      setFormData({ name: "", email: "", phone: "", message: "" });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-[12px] text-gray-500 mb-10 font-medium tracking-wide">
          <Link to="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="mx-1.5 opacity-50" />
          <span className="text-gray-900 font-semibold">Contact Us</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Phone size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">Call To Us</h3>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 font-medium">
                  We are available 24/7, 7 days a week.
                </p>
                <p className="text-sm font-bold text-[#0F172A]">
                  Phone: +01023587689
                </p>
              </div>

              <div className="h-[1px] bg-gray-100 my-8"></div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Mail size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">
                  Write To Us
                </h3>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 font-medium">
                  Fill out our form and we will contact you within 24 hours.
                </p>
                <p className="text-sm font-bold text-[#0F172A]">
                  Emails: Rentlyprojectt@gmail.com
                </p>
              </div>

              <div className="h-[1px] bg-gray-100 my-8"></div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <MapPin size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">Visit Us</h3>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 font-medium">
                  Visit our office in the heart of the city.
                </p>
                <p className="text-sm font-bold text-[#0F172A]">
                  Cairo, EL-shorouk
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-[#0F172A] mb-8">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-[#334155] ml-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Name"
                      className="w-full bg-[#F8FAFC] border border-transparent focus:border-indigo-100 rounded-xl px-4 py-3.5 text-sm outline-none transition-all focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-[#334155] ml-1">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full bg-[#F8FAFC] border border-transparent focus:border-indigo-100 rounded-xl px-4 py-3.5 text-sm outline-none transition-all focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-[#334155] ml-1">
                      Your Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                      className="w-full bg-[#F8FAFC] border border-transparent focus:border-indigo-100 rounded-xl px-4 py-3.5 text-sm outline-none transition-all focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#334155] ml-1">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    rows={8}
                    className="w-full bg-[#F8FAFC] border border-transparent focus:border-indigo-100 rounded-xl px-4 py-4 text-sm outline-none transition-all focus:bg-white focus:ring-4 focus:ring-indigo-50 resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#0F172A] hover:bg-black text-white px-10 py-4 rounded-xl font-bold text-sm transition-all flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg shadow-gray-200"
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send
                          size={18}
                          className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                        />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
