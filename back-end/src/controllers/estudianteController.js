const Estudiante = require('../models/Estudiante');
const { validationResult } = require('express-validator');

const estudianteController = {
  async getAllStudents(req, res) {
    try {
      const students = await Estudiante.getAll();
      res.status(200).json({
        success: true,
        data: students,
        count: students.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener estudiantes',
        error: error.message
      });
    }
  },

  async getStudent(req, res) {
    try {
      const { id } = req.params;
      const student = await Estudiante.getById(id);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Estudiante no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: student
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener estudiante',
        error: error.message
      });
    }
  },

  async getStudentByCode(req, res) {
    try {
      const { code } = req.params;
      const student = await Estudiante.getByCode(code);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Estudiante no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: student
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener estudiante',
        error: error.message
      });
    }
  },

  async createStudent(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { codigo_estudiante, nombres, apellidos, correo, telefono, programa, estado } = req.body;

      const existingStudent = await Estudiante.getByCode(codigo_estudiante);
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un estudiante con este código'
        });
      }

      const id = await Estudiante.create({
        codigo_estudiante,
        nombres,
        apellidos,
        correo,
        telefono,
        programa,
        estado: estado || 'active'
      });

      const newStudent = await Estudiante.getById(id);

      res.status(201).json({
        success: true,
        message: 'Estudiante creado exitosamente',
        data: newStudent
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear estudiante',
        error: error.message
      });
    }
  },

  async updateStudent(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const updateData = req.body;

      const existing = await Estudiante.getById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Estudiante no encontrado'
        });
      }

      if (updateData.codigo_estudiante && updateData.codigo_estudiante !== existing.codigo_estudiante) {
        const codeExists = await Estudiante.getByCode(updateData.codigo_estudiante);
        if (codeExists) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe un estudiante con este código'
          });
        }
      }

      const success = await Estudiante.update(id, updateData);

      if (!success) {
        return res.status(500).json({
          success: false,
          message: 'Error al actualizar estudiante'
        });
      }

      const updatedStudent = await Estudiante.getById(id);

      res.status(200).json({
        success: true,
        message: 'Estudiante actualizado exitosamente',
        data: updatedStudent
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar estudiante',
        error: error.message
      });
    }
  },

  async deleteStudent(req, res) {
    try {
      const { id } = req.params;

      const student = await Estudiante.getById(id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Estudiante no encontrado'
        });
      }

      const success = await Estudiante.delete(id);

      if (!success) {
        return res.status(500).json({
          success: false,
          message: 'Error al eliminar estudiante'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Estudiante eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar estudiante',
        error: error.message
      });
    }
  },

  async searchStudents(req, res) {
    try {
      const { q } = req.query;

      if (!q || q.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'La búsqueda requiere al menos 2 caracteres'
        });
      }

      const students = await Estudiante.search(q);

      res.status(200).json({
        success: true,
        data: students,
        count: students.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error en la búsqueda',
        error: error.message
      });
    }
  }
};

module.exports = estudianteController;