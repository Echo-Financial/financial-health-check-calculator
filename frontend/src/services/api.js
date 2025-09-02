import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const authHeaders = () => {
  const t = localStorage.getItem('token') || localStorage.getItem('adminToken');
  return t ? { Authorization: `Bearer ${t}` } : {};
};

export const generateMarketingContent = async (data) => {
  return axios.post(`${API_URL}/api/generate-marketing`, data);
};

export const sendMarketingEmail = async (data) => {
  return axios.post(`${API_URL}/api/send-marketing-email`, data);
};
