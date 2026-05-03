import React from "react";
import { Link } from "react-router-dom";
import { Copyright, Send } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#050F2A] text-white pt-20 pb-10">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Exclusive / Subscribe */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tight">Exclusive</h3>
            <div className="space-y-4">
              <h4 className="text-xl font-medium">Subscribe</h4>
              <p className="text-gray-400 text-sm">
                Get 10% off your first order
              </p>
              <div className="relative max-w-[240px]">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent border border-white/40 rounded-lg py-3 px-4 pr-12 text-sm focus:outline-none focus:border-white transition-all placeholder:text-gray-500"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#A78BFA] transition-colors">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tight">Support</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="leading-relaxed">Cairo, EL-shorouk</li>
              <li>
                <a
                  href="mailto:Rentlyprojectt@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  Rentlyprojectt@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+01023587689"
                  className="hover:text-white transition-colors"
                >
                  +01023587689
                </a>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tight">Account</h3>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li>
                <Link
                  to="/profile"
                  className="hover:text-white transition-colors"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-white transition-colors"
                >
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Link */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tight">Quick Link</h3>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-use"
                  className="hover:text-white transition-colors"
                >
                  Terms Of Use
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Download App */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tight">Download App</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {/* Placeholder for QR Code */}
                <Link
                  to="/coming-soon"
                  className="w-20 h-20 bg-white p-1 rounded hover:scale-105 transition-transform"
                >
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=RentlyApp"
                    alt="QR Code"
                    className="w-full h-full"
                  />
                </Link>
                {/* Store Links */}
                <div className="flex flex-col gap-2">
                  <Link
                    to="/coming-soon"
                    className="hover:opacity-80 transition-opacity hover:scale-105 transition-transform"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                      alt="Google Play"
                      className="h-8"
                    />
                  </Link>
                  <Link
                    to="/coming-soon"
                    className="hover:opacity-80 transition-opacity hover:scale-105 transition-transform"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                      alt="App Store"
                      className="h-8"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-gray-500 text-sm flex items-center justify-center gap-1.5 font-medium">
            <Copyright size={14} /> Copyright Rently 2026. All right reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
