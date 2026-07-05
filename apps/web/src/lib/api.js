import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api/v1';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

const TOKEN_KEY = 'avaana.accessToken';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY)),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    if (status === 401 && !original._retry && !original.url?.includes('/auth/')) {
      original._retry = true;
      try {
        refreshing = refreshing || api.post('/auth/refresh');
        const { data } = await refreshing;
        refreshing = null;
        const token = data?.data?.accessToken;
        if (token) {
          tokenStore.set(token);
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        }
      } catch {
        refreshing = null;
        tokenStore.clear();
      }
    }
    return Promise.reject(error);
  },
);

export const getErrorMessage = (error) =>
  error?.response?.data?.error?.message || error?.message || 'Something went wrong';
