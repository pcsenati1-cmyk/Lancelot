const Asistencia = require('../models/Asistencia');
const Estudiante = require('../models/Estudiante');
const { validationResult } = require('express-validator');

const asistenciaController = {
  async getAllAttendance(req, res) {
    try {
      const { fecha, estudiante_id } = req.query;
      let asistencias;

      if (fecha) {
        asistencias = await Asistencia.getByDate(fecha);
      } else if (estudiante_id) {
        asistencias = await Asistencia.getByStudentId(estudiante_id);
      } else {
        asistencias = await Asistencia.getAll();
      }

      res.status(200).json({
        success: true,
        data: asistencias,
        count: asistencias.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener asistencias',
        error: error.message
      });
    }
  },

  async getAttendanceById(req, res) {
    try {
      const { id } = req.params;
      const asistencia = await Asistencia.getById(id);

      if (!asistencia) {
        return res.status(404).json({
          success: false,
          message: 'Registro de asistencia no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: asistencia
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener asistencia',
        error: error.message
      });
    }
  },

  async getAttendanceByStudent(req, res) {
    try {
      const { estudiante_id } = req.params;
      const { fecha_inicio, fecha_fin } = req.query;

      const estudiante = await Estudiante.getById(estudiante_id);
      if (!estudiante) {
        return res.status(404).json({
          success: false,
          message: 'Estudiante no encontrado'
        });
      }

      let asistencias;
      if (fecha_inicio && fecha_fin) {
        asistencias = await Asistencia.getByStudentIdAndDateRange(estudiante_id, fecha_inicio, fecha_fin);
      } else {
        asistencias = await Asistencia.getByStudentId(estudiante_id);
      }

      res.status(200).json({
        success: true,
        data: {
          estudiante: {
            id: estudiante.id,
            codigo_estudiante: estudiante.codigo_estudiante,
            nombres: estudiante.nombres,
            apellidos: estudiante.apellidos,
            programa: estudiante.programa
          },
          asistencias: asistencias
        },
        count: asistencias.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener asistencias del estudiante',
        error: error.message
      });
    }
  },

  async createAttendance(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { estudiante_id, fecha_asistencia, estado, observacion } = req.body;

      const estudiante = await Estudiante.getById(estudiante_id);
      if (!estudiante) {
        return res.status(404).json({
          success: false,
          message: 'Estudiante no encontrado'
        });
      }

      const existingAsistencia = await Asistencia.getByStudentAndDate(estudiante_id, fecha_asistencia);
      if (existingAsistencia.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un registro de asistencia para este estudiante en esta fecha'
        });
      }

      const id = await Asistencia.create({
        estudiante_id,
        fecha_asistencia,
        estado,
        observacion
      });

      const newAsistencia = await Asistencia.getById(id);

      res.status(201).json({
        success: true,
        message: 'Asistencia registrada exitosamente',
        data: newAsistencia
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al registrar asistencia',
        error: error.message
      });
    }
  },

  async createBulkAttendance(req, res) {
    try {
      const { fecha_asistencia, registros } = req.body;

      if (!fecha_asistencia || !registros || !Array.isArray(registros)) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere fecha y lista de registros'
        });
      }

      const asistenciasRegistros = [];
      const errors = [];
      const succeeded = [];
      const failed = [];

      for (const record of registros) {
        const estudiante = await Estudiante.getById(record.estudiante_id);
        if (!estudiante) {
          failed.push({ estudiante_id: record.estudiante_id, error: 'Estudiante no encontrado' });
          continue;
        }

        const existing = await Asistencia.getByStudentAndDate(record.estudiante_id, fecha_asistencia);
        if (existing.length > 0) {
          failed.push({ estudiante_id: record.estudiante_id, error: 'Ya tiene registro en esta fecha' });
          continue;
        }

        asistenciasRegistros.push({
          estudiante_id: record.estudiante_id,
          fecha_asistencia,
          estado: record.estado || 'presente',
          observacion: record.observacion || null
        });
        succeeded.push({ estudiante_id: record.estudiante_id, estado: record.estado });
      }

      if (asistenciasRegistros.length > 0) {
        try {
          await Asistencia.createBulk(asistenciasRegistros);
        } catch (dbError) {
          return res.status(500).json({
            success: false,
            message: 'Error al guardar registros en la base de datos',
            error: dbError.message
          });
        }
      }

      res.status(201).json({
        success: true,
        message: `Proceso completado: ${succeeded.length} exitosos, ${failed.length} fallidos`,
        data: { succeeded, failed }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al registrar asistencias en lote',
        error: error.message
      });
    }
  },

  async updateAttendance(req, res) {
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

      const existing = await Asistencia.getById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Registro de asistencia no encontrado'
        });
      }

      const success = await Asistencia.update(id, updateData);

      if (!success) {
        return res.status(500).json({
          success: false,
          message: 'Error al actualizar asistencia'
        });
      }

      const updatedAsistencia = await Asistencia.getById(id);

      res.status(200).json({
        success: true,
        message: 'Asistencia actualizada exitosamente',
        data: updatedAsistencia
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar asistencia',
        error: error.message
      });
    }
  },

  async deleteAttendance(req, res) {
    try {
      const { id } = req.params;

      const asistencia = await Asistencia.getById(id);
      if (!asistencia) {
        return res.status(404).json({
          success: false,
          message: 'Registro de asistencia no encontrado'
        });
      }

      const success = await Asistencia.delete(id);

      if (!success) {
        return res.status(500).json({
          success: false,
          message: 'Error al eliminar asistencia'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Asistencia eliminada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar asistencia',
        error: error.message
      });
    }
  },

  async getDailySummary(req, res) {
    try {
      const { fecha } = req.query;

      if (!fecha) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere una fecha para el resumen'
        });
      }

      const summary = await Asistencia.getDailySummary(fecha);

      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener resumen diario',
        error: error.message
      });
    }
  },

  async getStudentStats(req, res) {
    try {
      const { estudiante_id } = req.params;
      const { fecha_inicio, fecha_fin } = req.query;

      const estudiante = await Estudiante.getById(estudiante_id);
      if (!estudiante) {
        return res.status(404).json({
          success: false,
          message: 'Estudiante no encontrado'
        });
      }

      const stats = await Asistencia.getAttendanceStats(estudiante_id, fecha_inicio, fecha_fin);

      res.status(200).json({
        success: true,
        data: {
          estudiante: {
            id: estudiante.id,
            codigo_estudiante: estudiante.codigo_estudiante,
            nombres: estudiante.nombres,
            apellidos: estudiante.apellidos
          },
          estadisticas: {
            total: parseInt(stats.total) || 0,
            presentes: parseInt(stats.presentes) || 0,
            ausentes: parseInt(stats.ausentes) || 0,
            tardes: parseInt(stats.tardes) || 0,
            eximidos: parseInt(stats.eximidos) || 0
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas',
        error: error.message
      });
    }
  }
};

module.exports = asistenciaController;