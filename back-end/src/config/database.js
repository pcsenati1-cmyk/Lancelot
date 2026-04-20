const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sistema_asistencia',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.on('connection', () => {
  console.log('✅ Conexión a MySQL establecida');
});

pool.on('error', (err) => {
  console.error('❌ Error de conexión MySQL:', err);
});

module.exports = pool;