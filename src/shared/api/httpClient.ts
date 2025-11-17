import axios from 'axios';

export const httpClient = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 10000,
});

//одна точка логирования (DRY, чтобы не делать console.error в каждом запросе)
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error);
    return Promise.reject(error);
  },
);
