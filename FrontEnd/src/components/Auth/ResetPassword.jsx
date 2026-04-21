import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../../server/Api";
import { toast, ToastContainer } from "react-toastify";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const email = location.state?.email;
  const otp = location.state?.otp;

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email, otp, passwords.newPassword);
      toast.success("Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4A3E85] via-[#2D245B] to-[#0B0915] flex items-center justify-center p-4 sm:p-10 text-white">
      <ToastContainer theme="dark" />
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-12 lg:gap-24">
        
        {/* Left Side: Logo & Tagline */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <img
            src="/Logo Main.png"
            alt="Rently Logo"
            className="w-full max-w-[450px] object-contain drop-shadow-2xl"
          />
          <p className="text-white text-lg sm:text-xl font-light tracking-wide mt-4 opacity-90">
            Egypt's #1 Rental Marketplace
          </p>
        </div>

        {/* Right Side: Reset Password Form */}
        <div className="flex-1 w-full max-w-md bg-transparent">
          <h1 className="text-3xl font-semibold mb-3 tracking-tight">Create new password</h1>
          <p className="text-gray-400 text-[11px] mb-10 leading-relaxed max-w-[300px]">
            Type your new strong password. Your password must include: 
            One capital letter & one small letter at least, 
            One special character & Minimum 8 digits long.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <input
                required
                name="newPassword"
                type="password"
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-gray-600 py-2 focus:outline-none focus:border-white transition-colors placeholder:text-gray-500"
              />
              <input
                required
                name="confirmPassword"
                type="password"
                placeholder="Confirm New Password"
                value={passwords.confirmPassword}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-gray-600 py-2 focus:outline-none focus:border-white transition-colors placeholder:text-gray-500"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full sm:w-auto px-8 bg-[#B1A1FF] text-black font-semibold py-2.5 rounded-lg hover:bg-[#9a89f0] transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 float-right mt-4"
            >
              {loading ? "Updating..." : "Confirm Changes"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
