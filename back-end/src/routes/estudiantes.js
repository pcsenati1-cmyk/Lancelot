const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');
const { body } = require('express-validator');

const studentValidations = [
  body('codigo_estudiante')
    .notEmpty().withMessage('El código de estudiante es obligatorio')
    .isLength({ min: 3, max: 20 }).withMessage('El código debe tener entre 3 y 20 caracteres')
    .matches(/^[A-Z0-9-]+$/i).withMessage('El código solo puede contener letras, números y guiones'),

  body('nombres')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras y espacios'),

  body('apellidos')
    .notEmpty().withMessage('El apellido es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El apellido solo puede contener letras y espacios'),

  body('correo')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),

  body('telefono')
    .optional()
    .matches(/^[0-9+\-\s()]+$/).withMessage('Formato de teléfono inválido'),

  body('programa')
    .notEmpty().withMessage('El programa/curso es obligatorio')
    .isLength({ min: 2, max: 150 }).withMessage('El programa debe tener entre 2 y 150 caracteres'),

  body('estado')
    .optional()
    .isIn(['active', 'inactive', 'graduated', 'suspended']).withMessage('Estado no válido')
];

router.get('/', estudianteController.getAllStudents);

router.get('/search', estudianteController.searchStudents);

router.get('/code/:code', estudianteController.getStudentByCode);

router.get('/:id', estudianteController.getStudent);

router.post('/', studentValidations, estudianteController.createStudent);

router.put('/:id', studentValidations, estudianteController.updateStudent);

router.delete('/:id', estudianteController.deleteStudent);

module.exports = router;