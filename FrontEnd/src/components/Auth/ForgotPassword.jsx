import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../server/Api";
import { toast, ToastContainer } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await forgotPassword(email);
      toast.success(response.message || "OTP sent to your email!");

      // Redirect to OTP page but mention it's for reset
      setTimeout(() => {
        navigate("/verify-otp", { state: { email, isReset: true } });
      }, 1500);
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
        </div>

        {/* Right Side: Forgot Password Form */}
        <div className="flex-1 w-full max-w-md bg-transparent">
          <h1 className="text-3xl font-semibold mb-2 tracking-tight">
            Forget Password?
          </h1>
          <p className="text-gray-400 text-sm mb-10 leading-relaxed">
            Enter your email address to reset <br /> password
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-lg">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white text-black py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B1A1FF]"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full sm:w-auto px-10 bg-[#B1A1FF] text-black font-semibold py-2.5 rounded-lg hover:bg-[#9a89f0] transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 float-right"
            >
              {loading ? "Sending..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
