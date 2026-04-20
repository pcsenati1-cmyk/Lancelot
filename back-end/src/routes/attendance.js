const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { body, query } = require('express-validator');

const attendanceValidations = [
  body('student_id')
    .notEmpty().withMessage('El ID del estudiante es obligatorio')
    .isInt({ min: 1 }).withMessage('ID de estudiante inválido'),

  body('attendance_date')
    .notEmpty().withMessage('La fecha de asistencia es obligatoria')
    .isDate().withMessage('Formato de fecha inválido (YYYY-MM-DD)'),

  body('status')
    .notEmpty().withMessage('El estado de asistencia es obligatorio')
    .isIn(['present', 'absent', 'late', 'excused']).withMessage('Estado no válido'),

  body('observation')
    .optional()
    .isLength({ max: 500 }).withMessage('La observación no puede exceder 500 caracteres')
];

const bulkAttendanceValidations = [
  body('attendance_date')
    .notEmpty().withMessage('La fecha de asistencia es obligatoria')
    .isDate().withMessage('Formato de fecha inválido (YYYY-MM-DD)'),

  body('records')
    .notEmpty().withMessage('La lista de registros es obligatoria')
    .isArray({ min: 1 }).withMessage('Debe haber al menos un registro'),

  body('records.*.student_id')
    .notEmpty().withMessage('El ID del estudiante es obligatorio')
    .isInt({ min: 1 }).withMessage('ID de estudiante inválido'),

  body('records.*.status')
    .optional()
    .isIn(['present', 'absent', 'late', 'excused']).withMessage('Estado no válido'),

  body('records.*.observation')
    .optional()
    .isLength({ max: 500 }).withMessage('La observación no puede exceder 500 caracteres')
];

router.get('/', attendanceController.getAllAttendance);

router.get('/summary/daily', attendanceController.getDailySummary);

router.get('/stats/student/:student_id', attendanceController.getStudentStats);

router.get('/student/:student_id', attendanceController.getAttendanceByStudent);

router.get('/date/:date', attendanceController.getAttendanceByDate);

router.get('/:id', attendanceController.getAttendanceById);

router.post('/', attendanceValidations, attendanceController.createAttendance);

router.post('/bulk', bulkAttendanceValidations, attendanceController.createBulkAttendance);

router.put('/:id', attendanceValidations, attendanceController.updateAttendance);

router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;