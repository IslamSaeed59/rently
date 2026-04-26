import axios from "axios";

const API_URL = "http://localhost:9000/api/chat/";

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
    if (error.response && error.response.status === 401) {
      // Clear storage and redirect to login if unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

/**
 * Initiate or find a conversation
 * @param {Object} data - { receiver_id, product_id (optional) }
 */
export const initiateChat = async (data) => {
  try {
    const response = await api.post("conversations", data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Get all conversations for the current user
 */
export const getConversations = async () => {
  try {
    const response = await api.get("conversations");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Get all conversations for admin
 */
export const adminGetConversations = async () => {
  try {
    const response = await api.get("admin/conversations");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Get message history for a conversation
 * @param {number} conversationId
 */
export const getMessages = async (conversationId) => {
  try {
    const response = await api.get(`conversations/${conversationId}/messages`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

/**
 * Send a message in a conversation
 * @param {number} conversationId
 * @param {Object} data - { message_text }
 */
export const sendMessage = async (conversationId, data) => {
  try {
    const response = await api.post(`conversations/${conversationId}/messages`, data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export default api;
