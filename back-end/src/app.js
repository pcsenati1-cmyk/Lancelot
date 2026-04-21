require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const studentRoutes = require('./routes/estudiantes');
const attendanceRoutes = require('./routes/asistencias');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Sistema de Gestión de Asistencias está funcionando',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.use('/api/estudiantes', studentRoutes);
app.use('/api/asistencias', attendanceRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

app.use(require('./middleware/errorHandler'));

app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
  console.log(`📚 API disponible en http://localhost:${PORT}/api`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;