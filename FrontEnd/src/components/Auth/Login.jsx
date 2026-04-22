import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../server/Api";
import { toast, ToastContainer } from "react-toastify";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser(formData.identifier, formData.Password);

      // Save token to localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      toast.success("Welcome back! Logging in...");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      toast.error(error.message || "Invalid credentials");
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

            <div className="flex items-center justify-between pt-4">
              <button
                disabled={loading}
                type="submit"
                className="bg-[#B1A1FF] text-black font-semibold py-3 px-12 rounded hover:bg-[#9a89f0] transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>

              <Link
                to="/forgot-password"
                size="sm"
                className="text-white text-sm hover:text-gray-300 transition-colors"
              >
                Forget Password?
              </Link>
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
