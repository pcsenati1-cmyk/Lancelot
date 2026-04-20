const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const { validationResult } = require('express-validator');

const attendanceController = {
  async getAllAttendance(req, res) {
    try {
      const { date, student_id } = req.query;
      let attendance;

      if (date) {
        attendance = await Attendance.getByDate(date);
      } else if (student_id) {
        attendance = await Attendance.getByStudentId(student_id);
      } else {
        attendance = await Attendance.getAll();
      }

      res.status(200).json({
        success: true,
        data: attendance,
        count: attendance.length
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
      const attendance = await Attendance.getById(id);

      if (!attendance) {
        return res.status(404).json({
          success: false,
          message: 'Registro de asistencia no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: attendance
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
      const { student_id } = req.params;
      const { startDate, endDate } = req.query;

      const student = await Student.getById(student_id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Estudiante no encontrado'
        });
      }

      let attendance;
      if (startDate && endDate) {
        attendance = await Attendance.getByStudentIdAndDateRange(student_id, startDate, endDate);
      } else {
        attendance = await Attendance.getByStudentId(student_id);
      }

      res.status(200).json({
        success: true,
        data: {
          student: {
            id: student.id,
            student_code: student.student_code,
            first_name: student.first_name,
            last_name: student.last_name,
            program: student.program
          },
          attendance: attendance
        },
        count: attendance.length
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

      const { student_id, attendance_date, status, observation } = req.body;

      const student = await Student.getById(student_id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Estudiante no encontrado'
        });
      }

      const existingAttendance = await Attendance.getByStudentAndDate(student_id, attendance_date);
      if (existingAttendance.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un registro de asistencia para este estudiante en esta fecha'
        });
      }

      const id = await Attendance.create({
        student_id,
        attendance_date,
        status,
        observation
      });

      const newAttendance = await Attendance.getById(id);

      res.status(201).json({
        success: true,
        message: 'Asistencia registrada exitosamente',
        data: newAttendance
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
      const { attendance_date, records } = req.body;

      if (!attendance_date || !records || !Array.isArray(records)) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere fecha y lista de registros'
        });
      }

      const attendanceRecords = [];
      const errors = [];
      const succeeded = [];
      const failed = [];

      for (const record of records) {
        const student = await Student.getById(record.student_id);
        if (!student) {
          failed.push({ student_id: record.student_id, error: 'Estudiante no encontrado' });
          continue;
        }

         const existing = await Attendance.getByStudentAndDate(record.student_id, attendance_date);
         if (existing.length > 0) {
           failed.push({ student_id: record.student_id, error: 'Ya tiene registro en esta fecha' });
           continue;
         }

        attendanceRecords.push({
          student_id: record.student_id,
          attendance_date,
          status: record.status || 'present',
          observation: record.observation || null
        });
        succeeded.push({ student_id: record.student_id, status: record.status });
      }

      if (attendanceRecords.length > 0) {
        try {
          await Attendance.createBulk(attendanceRecords);
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

      const existing = await Attendance.getById(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: 'Registro de asistencia no encontrado'
        });
      }

      const success = await Attendance.update(id, updateData);

      if (!success) {
        return res.status(500).json({
          success: false,
          message: 'Error al actualizar asistencia'
        });
      }

      const updatedAttendance = await Attendance.getById(id);

      res.status(200).json({
        success: true,
        message: 'Asistencia actualizada exitosamente',
        data: updatedAttendance
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

      const attendance = await Attendance.getById(id);
      if (!attendance) {
        return res.status(404).json({
          success: false,
          message: 'Registro de asistencia no encontrado'
        });
      }

      const success = await Attendance.delete(id);

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
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere una fecha para el resumen'
        });
      }

      const summary = await Attendance.getDailySummary(date);

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
      const { student_id } = req.params;
      const { startDate, endDate } = req.query;

      const student = await Student.getById(student_id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Estudiante no encontrado'
        });
      }

      const stats = await Attendance.getAttendanceStats(student_id, startDate, endDate);

      res.status(200).json({
        success: true,
        data: {
          student: {
            id: student.id,
            student_code: student.student_code,
            first_name: student.first_name,
            last_name: student.last_name
          },
          stats: {
            total: parseInt(stats.total) || 0,
            present: parseInt(stats.present) || 0,
            absent: parseInt(stats.absent) || 0,
            late: parseInt(stats.late) || 0,
            excused: parseInt(stats.excused) || 0
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

module.exports = attendanceController;