-- ============================================
-- Script de inicialización de base de datos
-- Sistema de Gestión de Asistencias
-- ============================================

CREATE DATABASE IF NOT EXISTS sistema_asistencia
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sistema_asistencia;

-- Tabla de estudiantes
CREATE TABLE IF NOT EXISTS estudiantes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  codigo_estudiante VARCHAR(20) UNIQUE NOT NULL,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  correo VARCHAR(150) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  programa VARCHAR(150) NOT NULL,
  estado ENUM('active', 'inactive', 'graduated', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_codigo_estudiante (codigo_estudiante),
  INDEX idx_correo (correo),
  INDEX idx_estado (estado),
  INDEX idx_programa (programa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de asistencias
CREATE TABLE IF NOT EXISTS asistencias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  estudiante_id INT NOT NULL,
  fecha_asistencia DATE NOT NULL,
  estado ENUM('presente', 'ausente', 'tarde', 'eximido') NOT NULL DEFAULT 'presente',
  observacion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY unique_estudiante_fecha (estudiante_id, fecha_asistencia),
  INDEX idx_fecha_asistencia (fecha_asistencia),
  INDEX idx_estudiante_id (estudiante_id),
  INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla opcional para usuarios/administradores (futuro)
CREATE TABLE IF NOT EXISTS usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'teacher', 'staff') DEFAULT 'staff',
  esta_activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de prueba (opcional)
-- INSERT INTO estudiantes (codigo_estudiante, nombres, apellidos, correo, telefono, programa) VALUES
-- ('EST001', 'Juan', 'Pérez', 'juan.perez@email.com', '1234567890', 'Ingeniería de Sistemas'),
-- ('EST002', 'María', 'González', 'maria.gonzalez@email.com', '0987654321', 'Administración'),
-- ('EST003', 'Carlos', 'Rodríguez', 'carlos.rodriguez@email.com', '5551234567', 'Derecho');
