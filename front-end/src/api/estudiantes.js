import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  getAll: () => api.get('/estudiantes'),
  getById: (id) => api.get(`/estudiantes/${id}`),
  getByCode: (code) => api.get(`/estudiantes/code/${code}`),
  search: (query) => api.get('/estudiantes/search', { params: { q: query } }),
  create: (data) => api.post('/estudiantes', data),
  update: (id, data) => api.put(`/estudiantes/${id}`, data),
  delete: (id) => api.delete(`/estudiantes/${id}`)
};