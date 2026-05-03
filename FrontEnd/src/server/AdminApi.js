import axios from 'axios';

const API_URL = 'http://localhost:9000/api/admin';

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/stats`, getHeaders());
  return response.data;
};
