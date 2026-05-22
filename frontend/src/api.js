import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/api-token-auth/`, { username, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('username', username);
  }
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await axios.post(`${API_URL}/api/register/`, { username, email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('username', response.data.username);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
};

export const getDashboard = (month, year) => api.get(`/api/expenses/dashboard/`, { params: { month, year } });
export const getExpenses = () => api.get('/api/expenses/');
export const addExpense = (data) => api.post('/api/expenses/', data);
export const updateExpense = (id, data) => api.put(`/api/expenses/${id}/`, data);
export const deleteExpense = (id) => api.delete(`/api/expenses/${id}/`);

export const getCategories = () => api.get('/api/categories/');
export const addCategory = (data) => api.post('/api/categories/', data);
export const updateCategory = (id, data) => api.put(`/api/categories/${id}/`, data);
export const deleteCategory = (id) => api.delete(`/api/categories/${id}/`);

export const getBudgets = () => api.get('/api/budgets/');
export const addBudget = (data) => api.post('/api/budgets/', data);
export const updateBudget = (id, data) => api.put(`/api/budgets/${id}/`, data);
export const deleteBudget = (id) => api.delete(`/api/budgets/${id}/`);

export default api;
