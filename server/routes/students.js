const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/', studentController.getAllStudents);
router.post('/', studentController.createStudent);
router.get('/:id', studentController.getStudentById);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);
router.post('/sync-ratings', studentController.syncStudentRatings);
router.get('/submissions/:handle', studentController.getStudentSubmissions);
router.get('/contests/:handle', studentController.getStudentContests);
router.get('/analytics/:handle', studentController.getStudentAnalytics);

module.exports = router;