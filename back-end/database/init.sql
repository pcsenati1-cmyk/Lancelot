-- ============================================
-- Script de inicialización de base de datos
-- Sistema de Gestión de Asistencias
-- ============================================

CREATE DATABASE IF NOT EXISTS sistema_asistencia
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sistema_asistencia;

-- Tabla de estudiantes
CREATE TABLE IF NOT EXISTS students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_code VARCHAR(20) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(20),
  program VARCHAR(150) NOT NULL,
  status ENUM('active', 'inactive', 'graduated', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_student_code (student_code),
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_program (program)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de asistencias
CREATE TABLE IF NOT EXISTS attendance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  attendance_date DATE NOT NULL,
  status ENUM('present', 'absent', 'late', 'excused') NOT NULL DEFAULT 'present',
  observation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY unique_student_date (student_id, attendance_date),
  INDEX idx_attendance_date (attendance_date),
  INDEX idx_student_id (student_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla opcional para usuarios/administradores (futuro)
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'teacher', 'staff') DEFAULT 'staff',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de prueba (opcional)
-- INSERT INTO students (student_code, first_name, last_name, email, phone, program) VALUES
-- ('EST001', 'Juan', 'Pérez', 'juan.perez@email.com', '1234567890', 'Ingeniería de Sistemas'),
-- ('EST002', 'María', 'González', 'maria.gonzalez@email.com', '0987654321', 'Administración'),
-- ('EST003', 'Carlos', 'Rodríguez', 'carlos.rodriguez@email.com', '5551234567', 'Derecho');
