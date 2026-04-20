const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { body } = require('express-validator');

const studentValidations = [
  body('student_code')
    .notEmpty().withMessage('El código de estudiante es obligatorio')
    .isLength({ min: 3, max: 20 }).withMessage('El código debe tener entre 3 y 20 caracteres')
    .matches(/^[A-Z0-9-]+$/i).withMessage('El código solo puede contener letras, números y guiones'),

  body('first_name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras y espacios'),

  body('last_name')
    .notEmpty().withMessage('El apellido es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El apellido solo puede contener letras y espacios'),

  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(),

  body('phone')
    .optional()
    .matches(/^[0-9+\-\s()]+$/).withMessage('Formato de teléfono inválido'),

  body('program')
    .notEmpty().withMessage('El programa/curso es obligatorio')
    .isLength({ min: 2, max: 150 }).withMessage('El programa debe tener entre 2 y 150 caracteres'),

  body('status')
    .optional()
    .isIn(['active', 'inactive', 'graduated', 'suspended']).withMessage('Estado no válido')
];

router.get('/', studentController.getAllStudents);

router.get('/search', studentController.searchStudents);

router.get('/code/:code', studentController.getStudentByCode);

router.get('/:id', studentController.getStudent);

router.post('/', studentValidations, studentController.createStudent);

router.put('/:id', studentValidations, studentController.updateStudent);

router.delete('/:id', studentController.deleteStudent);

module.exports = router;