const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/asistenciaController');
const { body, query } = require('express-validator');

const asistenciaValidations = [
  body('estudiante_id')
    .notEmpty().withMessage('El ID del estudiante es obligatorio')
    .isInt({ min: 1 }).withMessage('ID de estudiante inválido'),

  body('fecha_asistencia')
    .notEmpty().withMessage('La fecha de asistencia es obligatoria')
    .isDate().withMessage('Formato de fecha inválido (YYYY-MM-DD)'),

  body('estado')
    .notEmpty().withMessage('El estado de asistencia es obligatorio')
    .isIn(['presente', 'ausente', 'tarde', 'eximido']).withMessage('Estado no válido'),

  body('observacion')
    .optional()
    .isLength({ max: 500 }).withMessage('La observación no puede exceder 500 caracteres')
];

const bulkAsistenciaValidations = [
  body('fecha_asistencia')
    .notEmpty().withMessage('La fecha de asistencia es obligatoria')
    .isDate().withMessage('Formato de fecha inválido (YYYY-MM-DD)'),

  body('registros')
    .notEmpty().withMessage('La lista de registros es obligatoria')
    .isArray({ min: 1 }).withMessage('Debe haber al menos un registro'),

  body('registros.*.estudiante_id')
    .notEmpty().withMessage('El ID del estudiante es obligatorio')
    .isInt({ min: 1 }).withMessage('ID de estudiante inválido'),

  body('registros.*.estado')
    .optional()
    .isIn(['presente', 'ausente', 'tarde', 'eximido']).withMessage('Estado no válido'),

  body('registros.*.observacion')
    .optional()
    .isLength({ max: 500 }).withMessage('La observación no puede exceder 500 caracteres')
];

router.get('/', asistenciaController.getAllAttendance);

router.get('/summary/daily', asistenciaController.getDailySummary);

router.get('/stats/student/:student_id', asistenciaController.getStudentStats);

router.get('/student/:student_id', asistenciaController.getAttendanceByStudent);

router.get('/date/:date', asistenciaController.getAttendanceByDate);

router.get('/:id', asistenciaController.getAttendanceById);

router.post('/', asistenciaValidations, asistenciaController.createAttendance);

router.post('/bulk', bulkAsistenciaValidations, asistenciaController.createBulkAttendance);

router.put('/:id', asistenciaValidations, asistenciaController.updateAttendance);

router.delete('/:id', asistenciaController.deleteAttendance);

module.exports = router;