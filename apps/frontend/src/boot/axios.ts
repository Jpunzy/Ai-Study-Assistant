import axios from "axios";
import { LocalStorage } from "quasar";

export const api = axios.create({
  baseURL: "/api"
});

// แนบ JWT token ทุก request อัตโนมัติ
// แต่ไม่ override ถ้า request นั้น set Authorization มาแล้ว
api.interceptors.request.use(config => {
  if (!config.headers.Authorization) {
    const token = LocalStorage.getItem<string>("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
