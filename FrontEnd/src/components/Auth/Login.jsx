import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, googleLogin } from "../../server/Api";
import { toast, ToastContainer } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    Password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      Swal.fire({
        title: 'Authenticating...',
        html: 'Please wait while we connect with Google.',
        imageUrl: '/Logo Main.png',
        imageWidth: 150,
        imageAlt: 'Loading...',
        showConfirmButton: false,
        allowOutsideClick: false,
        background: '#2D245B',
        color: '#fff',
        customClass: {
          image: 'animate-pulse drop-shadow-2xl'
        }
      });
      try {
        // Fetch user info from Google
        await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        // Send token to our backend
        const response = await googleLogin(tokenResponse.access_token);

        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        window.dispatchEvent(new Event("authChange"));

        Swal.close();
        toast.success("Welcome back! Logging in...");
        
        if (response.user && response.user.verification_status !== "verified") {
          setTimeout(() => navigate("/verify-identity"), 1000);
        } else {
          setTimeout(() => navigate("/"), 1000);
        }
      } catch (err) {
        console.error(err);
        Swal.close();
        toast.error("Google Login Failed");
      } finally {
        setLoading(false);
      }
    },
    onError: () => toast.error("Google Login Failed"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    Swal.fire({
      title: 'Logging in...',
      html: 'Please wait while we verify your credentials.',
      imageUrl: '/Logo Main.png',
      imageWidth: 150,
      imageAlt: 'Loading...',
      showConfirmButton: false,
      allowOutsideClick: false,
      background: '#2D245B',
      color: '#fff',
      customClass: {
        image: 'animate-pulse drop-shadow-2xl'
      }
    });

    try {
      const response = await loginUser(formData.identifier, formData.Password);

      // Save token to localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      window.dispatchEvent(new Event("authChange"));

      Swal.close();
      toast.success("Welcome back! Logging in...");

      if (response.user && response.user.verification_status !== "verified") {
        setTimeout(() => navigate("/verify-identity"), 1000);
      } else {
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (error) {
      Swal.close();
      const errorMessage = typeof error === 'string' ? error : (error.message || "Invalid credentials");
      toast.error(errorMessage);
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

        {/* Right Side: Login Form */}
        <div className="flex-1 w-full max-w-md bg-transparent">
          <h1 className="text-4xl font-semibold mb-2 tracking-tight">
            Log in to Rently
          </h1>
          <p className="text-gray-400 text-sm mb-12">
            Enter your details below
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <input
                required
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                type="text"
                placeholder="Email or Phone Number"
                className="w-full bg-transparent border-b border-gray-600 py-2 focus:outline-none focus:border-white transition-colors placeholder:text-gray-500"
              />
              <input
                required
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                type="password"
                placeholder="Password"
                className="w-full bg-transparent border-b border-gray-600 py-2 focus:outline-none focus:border-white transition-colors placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <button
                  disabled={loading}
                  type="submit"
                  className="bg-[#B1A1FF] text-black font-semibold py-3 px-12 rounded hover:bg-[#9a89f0] transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>

                <Link
                  to="/forgot-password"
                  className="text-white text-sm hover:text-gray-300 transition-colors"
                >
                  Forget Password?
                </Link>
              </div>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-gray-400">Or</span>
                </div>
              </div>

              <button
                onClick={() => handleGoogleLogin()}
                disabled={loading}
                type="button"
                className="w-full bg-transparent border border-gray-600 flex items-center justify-center gap-3 py-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span>Log in with Google</span>
              </button>
            </div>

            <p className="text-center text-sm text-gray-400 mt-10">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-white underline underline-offset-4 hover:text-gray-200"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
