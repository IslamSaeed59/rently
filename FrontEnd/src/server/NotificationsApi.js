import axios from "axios";

const API_URL = "http://localhost:9000/api/notifications";

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getNotifications = async () => {
  const response = await axios.get(API_URL, getHeaders());
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await axios.put(`${API_URL}/${id}/read`, {}, getHeaders());
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await axios.put(`${API_URL}/read-all`, {}, getHeaders());
  return response.data;
};
