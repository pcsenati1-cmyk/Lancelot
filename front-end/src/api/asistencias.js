import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  getAll: () => api.get('/asistencias'),
  getById: (id) => api.get(`/asistencias/${id}`),
  getByDate: (date) => api.get(`/asistencias/date/${date}`),
  getByStudent: (studentId) => api.get(`/asistencias/student/${studentId}`),
  getDailySummary: (date) => api.get('/asistencias/summary/daily', { params: { date } }),
  getStudentStats: (studentId) => api.get(`/asistencias/stats/student/${studentId}`),
  create: (data) => api.post('/asistencias', data),
  createBulk: (data) => api.post('/asistencias/bulk', data),
  update: (id, data) => api.put(`/asistencias/${id}`, data),
  delete: (id) => api.delete(`/asistencias/${id}`)
};