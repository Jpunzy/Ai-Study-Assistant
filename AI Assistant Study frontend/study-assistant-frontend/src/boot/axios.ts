import axios from 'axios';
import { LocalStorage } from 'quasar';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
});

// แนบ JWT token ทุก request อัตโนมัติ
api.interceptors.request.use((config) => {
  const token = LocalStorage.getItem<string>('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
