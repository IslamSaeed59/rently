import axios from "axios";

const API_URL = "http://localhost:9000/api/";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Register (Send OTP)
export const registerUser = async (userData) => {
  try {
    const response = await api.post("auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Verify OTP (Finalize Registration)
export const verifyOtp = async (email, otp, userData) => {
  try {
    const response = await api.post("auth/verify-otp", {
      Email: email,
      otp,
      userData,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Login
export const loginUser = async (identifier, password) => {
  try {
    const response = await api.post("auth/login", {
      identifier,
      Password: password,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Forgot Password
export const forgotPassword = async (email) => {
  try {
    const response = await api.post("auth/forgot-password", { Email: email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Reset Password
export const resetPassword = async (email, otp, newPassword) => {
  try {
    const response = await api.post("auth/reset-password", {
      Email: email,
      otp,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export default api;
