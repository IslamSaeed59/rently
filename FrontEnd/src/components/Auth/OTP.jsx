import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../../server/Api";
import { toast, ToastContainer } from "react-toastify";

const OTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const email = location.state?.email || "your email";
  const userData = location.state?.userData;

  useEffect(() => {
    if (!location.state) {
      toast.warning("Please sign up first");
      setTimeout(() => navigate("/signup"), 2000);
    }
  }, [location.state, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const response = await verifyOtp(email, otpCode, userData);
      toast.success(response.message || "Code verified successfully!");

      // If it's a password reset, go to ResetPassword page
      if (location.state?.isReset) {
        setTimeout(
          () => navigate("/reset-password", { state: { email, otp: otpCode } }),
          1500,
        );
      } else {
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      toast.error(error.message || "Invalid OTP or registration failed");
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

        {/* Right Side: OTP Form */}
        <div className="flex-1 w-full max-w-md bg-transparent">
          <h1 className="text-3xl font-semibold mb-2 tracking-tight">
            Enter verification code
          </h1>
          <p className="text-gray-400 text-sm mb-10 leading-relaxed">
            Please enter the code we just sent to email <br />
            <span className="text-white font-medium">{email}</span>
          </p>

          <form onSubmit={handleVerify} className="space-y-8">
            {/* OTP Input Boxes */}
            <div className="flex justify-between gap-2 sm:gap-3">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-full h-14 sm:h-16 bg-transparent border border-gray-600 rounded-xl text-center text-2xl font-bold focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                />
              ))}
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-400">Don't receive OTP?</p>
              <button
                type="button"
                className="text-white text-sm underline underline-offset-4 hover:text-gray-200 transition-colors"
              >
                Resend code
              </button>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#B1A1FF] text-black font-semibold py-3.5 rounded-xl hover:bg-[#9a89f0] transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 mt-4"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTP;
