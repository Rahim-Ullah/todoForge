import axios from 'axios';


export const api = axios.create({
  baseURL: 'https://api.freeapi.app/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(undefined, (error) => {
  if (error.response) {
    const { status } = error.response;  

    if (status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
})