import axios, {AxiosError} from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{message: string}>) => {
    if (error.response) {
      const message = error.response.data?.message ?? 'An error occurred';
      throw new Error(message);
    }
    if (error.request) {
      throw new Error('Network error — please check your connection');
    }
    throw new Error(error.message);
  }
);
