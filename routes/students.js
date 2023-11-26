var express = require('express');
var router = express.Router();

let students = [
    { id: 10, firstName: "Marty", lastName: "McFly", group: 101, rate: 9.5 },
    { id: 11, firstName: "Squidward", lastName: "Tentakles", group: 102, rate: 6.1 },
    { id: 12, firstName: "Donald", lastName: "Duck", group: 102, rate: 7.2 },
    { id: 13, firstName: "Sarah", lastName: "Connor", group: 101, rate: 8.3 },
    { id: 14, firstName: "Yugin", lastName: "Krabbs", group: 102, rate: 6.8 },
  ];
  
  router.get('/', function(req, res, next) {
    const sortBy = req.query.sortBy;
    const limit = parseInt(req.query.limit) || students.length;
    const offset = parseInt(req.query.offset) || 0;
    let title = "Students";
  
    let sortedStudents = [...students];
  
    if (sortBy == "group") {
      sortedStudents.sort((a, b) => a.group - b.group);
      title = "Sorted students by group";
    } else if (sortBy == "rate") {
      sortedStudents.sort((a, b) => a.rate - b.rate);
      title = "Sorted students by rate";
    }
  
    const paginatedStudents = sortedStudents.slice(offset, offset + limit);
  
    if (paginatedStudents.length === 0) {
      return res.status(404).json({ error: 'No students found on this page.' });
    }
  
    res.json({
      title: title,
      students: paginatedStudents,
      totalStudents: students.length,
      limit,
      offset,
    });
});  

router.get('/:id', function(req, res, next) {
    const student = getStudentById(req.params.id);
    if (student) {
        res.json({ title: 'Student', students: [student] });
    } else {
        res.json({ title: 'Student Not Found', students: [] });
    }
});

router.post('/', function(req, res, next) {
    const { firstName, lastName, group, rate } = req.body;
    const newStudent = {
        id: generateId(),
        firstName,
        lastName,
        group,
        rate
    };
    if(firstName.length != 0 && lastName.length != 0){
        students.push(newStudent);
        res.json({ message: 'Student added successfully', student: newStudent });
    }
    else{
        res.json({message: 'Names can not be empty'});
    }
});

router.delete('/:id', function(req, res, next) {
    removeStudentById(req.params.id);
    res.json({message: 'Student removed successfully'});
});

const getStudentById = (id) => {
    return students.find((student) => student.id == id);
};

const removeStudentById = (studentIdToDelete) => {
    const index = students.indexOf(getStudentById(studentIdToDelete));
    students.splice(index, 1);
}

const generateId = () => {
    let maxId = students.reduce((max, student) => {
        return student.id > max ? student.id : max;
    }, 0);
      
    return maxId + 1;
}

module.exports = router;
