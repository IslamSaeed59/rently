import axios from "axios";

const API_URL = "http://localhost:9000/api/";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Handle session expiration (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect if unauthorized and NOT on the login/register pages
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config.url.includes("auth/login") &&
      !error.config.url.includes("auth/google-login")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

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

// Google Login
export const googleLogin = async (credential) => {
  try {
    const response = await api.post("auth/google-login", { credential });
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

// ID Verification
export const verifyId = async (formData) => {
  try {
    const response = await api.post("auth/verify-id", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// getProfile
export const getProfile = async () => {
  try {
    const response = await api.get("profile");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// updateProfile
export const updateProfile = async (userData) => {
  try {
    const response = await api.put("profile", userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// uploadProfileImage
export const uploadProfileImage = async (formData) => {
  try {
    const response = await api.post("profile/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// change-password
export const changePassword = async (password, confirmPassword) => {
  try {
    const response = await api.put("profile/change-password", {
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Categories API
export const createCategory = async (categoryData) => {
  try {
    const response = await api.post("categories", categoryData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getAllCategories = async (params) => {
  try {
    const response = await api.get("categories", { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`categories/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const response = await api.put(`categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`categories/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Users API
export const getAllUsers = async () => {
  try {
    const response = await api.get("users");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// AI API
export const chatWithAI = async (message) => {
  try {
    const response = await api.post("ai/chat", { message });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export default api;
