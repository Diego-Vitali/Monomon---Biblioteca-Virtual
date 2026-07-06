import axios from "axios";
import { Platform } from "react-native";
import { GlobalStore } from "./store";

const DEFAULT_URL =
  Platform.OS === "web" ? "http://localhost:8080" : "http://10.0.2.2:8080";
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  if (GlobalStore.token) {
    config.headers.Authorization = `Bearer ${GlobalStore.token}`;
  }
  return config;
});

// Interceptor para adicionar o token JWT no futuro
api.interceptors.request.use(async (config) => {
  // const token = await AsyncStorage.getItem('@Monomon:token');
  // if (token) {
  //     config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

export default api;
