var express = require('express');
var router = express.Router();
var studentsmongo = require('../service/student-mongo');

// router.get('/', async (req, res, next) => {
//         const students = await studentsmongo.getstudent();
//         console.log(students)
//         res.send(students.data);
// });

router.get('/', async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const students = await studentsmongo.getstudent(page, limit);
    res.send(students.data);
  });

// Get students by ID
router.get('/:id', async (req, res, next) => {
        const students = await studentsmongo.getstudentbyid(req.params.id);
        if (students) {
            res.send(students);
        } else {
            res.send({ message: 'students not found' });
        }
});

// Add a new students
router.post('/', async (req, res, next) => {
        const students = await studentsmongo.addstudent(req.body);
        res.send({result:"success", data:students.data});
});

// Update students by ID
router.put('/:id', async (req, res, next) => {
        const students = await studentsmongo.updatestudent(req.params.id, req.body);
        if (students) {
            res.send({result:"success", data:students.data});
        } else {
            res.send({ message: 'students not found' });
        }
});

// Delete students by ID
router.delete('/:id', async (req, res, next) => {
        const students = await studentsmongo.deletestudent(req.params.id);
        if (students.data) {
            res.send({ message: 'students deleted successfully', result:"success"});
        } else {
            res.send({ message: 'students not found' });
        }
});

// Search students by field and text
router.get('/student/:field', function(req, res, next) {
    var students = studentsmongo.searchstudent(req.params.field)
    res.send(students);
  });


module.exports = router;
