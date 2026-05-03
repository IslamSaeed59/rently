import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { registerUser, googleLogin } from "../../server/Api";
import { toast, ToastContainer } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import "react-toastify/dist/ReactToastify.css";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const years = Array.from({ length: 2025 - 1950 + 1 }, (_, i) => 2025 - i);

const SingUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Firstname: "",
    LastName: "",
    Email: "",
    PhoneNumber: "",
    Password: "",
    year: "",
    day: "",
    month: "",
    Gender: "",
  });

  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const passwordRequirements = [
    { label: "At least 6 characters", test: (p) => p.length >= 6 },
    { label: "At least 1 uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { label: "At least 1 lowercase letter", test: (p) => /[a-z]/.test(p) },
    { label: "At least 1 number", test: (p) => /[0-9]/.test(p) },
    { label: "At least 1 symbol", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
  ];

  const isEmailValid = formData.Email.toLowerCase().endsWith("@gmail.com");
  const isPhoneValid = formData.PhoneNumber.length === 11;
  const isPasswordValid = passwordRequirements.every((req) => req.test(formData.Password));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });

    if (name === "PhoneNumber") {
      const cleaned = value.replace(/\D/g, "").slice(0, 11);
      setFormData({ ...formData, [name]: cleaned });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        // Fetch user info from Google using the access_token
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        
        const googleUser = res.data;
        
        // Send user info to our backend
        const response = await googleLogin(tokenResponse.access_token); // We can pass the token or info
        
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        
        toast.success("Login successful!");
        navigate("/");
      } catch (err) {
        console.error(err);
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

    try {
      // Validate Email
      if (!formData.Email.toLowerCase().endsWith("@gmail.com")) {
        toast.error("Email must be a @gmail.com address");
        setLoading(false);
        return;
      }

      // Validate Phone Number
      if (formData.PhoneNumber.length !== 11) {
        toast.error("Phone number must be exactly 11 digits");
        setLoading(false);
        return;
      }

      // Validate Password
      const password = formData.Password;
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        setLoading(false);
        return;
      }
      if (!/[A-Z]/.test(password)) {
        toast.error("Password must contain at least one uppercase letter");
        setLoading(false);
        return;
      }
      if (!/[a-z]/.test(password)) {
        toast.error("Password must contain at least one lowercase letter");
        setLoading(false);
        return;
      }
      if (!/[0-9]/.test(password)) {
        toast.error("Password must contain at least one number");
        setLoading(false);
        return;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        toast.error("Password must contain at least one symbol");
        setLoading(false);
        return;
      }

      // Validate Gender
      if (!formData.Gender) {
        toast.error("Please select your gender");
        setLoading(false);
        return;
      }

      const DateofBrith = `${formData.year}-${formData.month.padStart(2, "0")}-${formData.day.padStart(2, "0")}`;

      const payload = {
        Firstname: formData.Firstname,
        LastName: formData.LastName,
        Email: formData.Email,
        PhoneNumber: formData.PhoneNumber,
        Password: formData.Password,
        DateofBrith,
        Gender: formData.Gender,
      };

      const response = await registerUser(payload);
      toast.success(response.message || "OTP sent to your email!");

      // Navigate to OTP page with data
      setTimeout(() => {
        navigate("/verify-otp", {
          state: { email: formData.Email, userData: payload },
        });
      }, 1000);
    } catch (error) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4A3E85] via-[#2D245B] to-[#0B0915] flex items-center justify-center p-4 sm:p-10">
      <ToastContainer theme="dark" />
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-12 lg:gap-24">
        {/* Left Side */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <img
            src="/Logo Main.png"
            alt="Rently Logo"
            className="w-full max-w-[450px] object-contain drop-shadow-2xl"
          />
        </div>

        {/* Right Side */}
        <div className="flex-1 w-full max-w-md bg-transparent text-white">
          <h1 className="text-4xl font-semibold mb-10 tracking-tight">
            Create an account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <input
                required
                name="Firstname"
                value={formData.Firstname}
                onChange={handleChange}
                type="text"
                placeholder="First Name"
                className="w-full bg-transparent border-b border-gray-600 py-2 focus:outline-none focus:border-white transition-colors placeholder:text-gray-500"
              />
              <input
                required
                name="LastName"
                value={formData.LastName}
                onChange={handleChange}
                type="text"
                placeholder="Last Name"
                className="w-full bg-transparent border-b border-gray-600 py-2 focus:outline-none focus:border-white transition-colors placeholder:text-gray-500"
              />
              <div className="space-y-1">
                <input
                  required
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Email Address"
                  className={`w-full bg-transparent border-b ${touched.Email && !isEmailValid ? "border-red-500" : "border-gray-600"} py-2 focus:outline-none focus:border-white transition-colors placeholder:text-gray-500`}
                />
                {touched.Email && !isEmailValid && formData.Email && (
                  <p className="text-xs text-red-400">Must be a @gmail.com address</p>
                )}
              </div>
              <div className="space-y-1">
                <input
                  required
                  name="PhoneNumber"
                  value={formData.PhoneNumber}
                  onChange={handleChange}
                  type="tel"
                  placeholder="Phone Number"
                  className={`w-full bg-transparent border-b ${touched.PhoneNumber && !isPhoneValid ? "border-red-500" : "border-gray-600"} py-2 focus:outline-none focus:border-white transition-colors placeholder:text-gray-500`}
                />
                {touched.PhoneNumber && !isPhoneValid && formData.PhoneNumber && (
                  <p className="text-xs text-red-400">Must be 11 digits</p>
                )}
              </div>
              <div className="space-y-2">
                <input
                  required
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
                  type="password"
                  placeholder="Password"
                  className={`w-full bg-transparent border-b ${touched.Password && !isPasswordValid ? "border-red-500" : "border-gray-600"} py-2 focus:outline-none focus:border-white transition-colors placeholder:text-gray-500`}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-2">
                  {passwordRequirements.map((req, index) => {
                    const met = req.test(formData.Password);
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${met ? "bg-green-400" : "bg-gray-600"}`} />
                        <span className={`text-[10px] ${met ? "text-green-400" : "text-gray-400"}`}>
                          {req.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Date of Birth</label>
              <div className="flex gap-4">
                <select
                  required
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="flex-1 bg-white text-black rounded-lg py-2 px-3 text-sm focus:outline-none"
                >
                  <option value="">YYYY</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <select
                  required
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                  className="flex-1 bg-white text-black rounded-lg py-2 px-3 text-sm focus:outline-none"
                >
                  <option value="">DD</option>
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <select
                  required
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  className="flex-1 bg-white text-black rounded-lg py-2 px-3 text-sm focus:outline-none"
                >
                  <option value="">MM</option>
                  {months.map((month, index) => (
                    <option key={month} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Gender</label>
              <div className="flex gap-8 items-center pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div
                    className={`w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center group-hover:border-white transition-all ${formData.Gender === "Male" ? "border-white" : ""}`}
                  >
                    <input
                      type="radio"
                      name="Gender"
                      value="Male"
                      className="hidden"
                      onChange={handleChange}
                    />
                    {formData.Gender === "Male" && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-gray-300">Male</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div
                    className={`w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center group-hover:border-white transition-all ${formData.Gender === "Female" ? "border-white" : ""}`}
                  >
                    <input
                      type="radio"
                      name="Gender"
                      value="Female"
                      className="hidden"
                      onChange={handleChange}
                    />
                    {formData.Gender === "Female" && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-gray-300">Female</span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-4 pt-4">
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-[#B1A1FF] text-black font-semibold py-3 rounded-lg hover:bg-[#9a89f0] transition-colors shadow-lg active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

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
                <span>Sign up with Google</span>
              </button>
            </div>

            <p className="text-center text-sm text-gray-400 mt-6">
              Already have account?{" "}
              <a
                href="/login"
                className="text-white underline underline-offset-4 hover:text-gray-200"
              >
                Log in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SingUp;
