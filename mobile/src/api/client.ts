import axios, { AxiosResponse, AxiosError } from 'axios';

// ⚠️ REEMPLAZA '192.168.1.X' CON TU IP LOCAL
const BASE_URL = 'http://192.168.14.51:3000';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // AxiosError maneja mejor el tipado del error
    console.log('API Error:', error.message);
    return Promise.reject(error);
  }
);