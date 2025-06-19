import axios from 'axios';

const api = axios.create({
  baseURL:  'https://mini-notion-clone-a47h.onrender.com/api',
  withCredentials: true,
});

export default api;