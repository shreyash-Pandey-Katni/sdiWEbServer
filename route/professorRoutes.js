const express = require('express');
const professorRoutes = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
    professors,
    student,
    semesterModel
} = require('../model/student');

professorRoutes.post('/register', (req, res) => {
    if (!req.headers.name || !req.headers.email || !req.headers.password) {
        res.sendStatus(404)
    } else {
        bcryptjs.hash(req.headers.password, 10, (err, hashPassword) => {
            if (err) {
                res.sendStatus(402)
                return;
            }
            let professor = new professors({
                name: req.headers.name,
                email: req.headers.email,
                password: hashPassword
            })
            professor.save().then(prof => {
                    res.json({
                        prof
                    })
                })
                .catch(err => res.sendStatus(403))
        })
    }
})

professorRoutes.get('/login', (req, res) => {
    var password = req.headers.password;
    var email = req.headers.email;
    // console.log(req.headers.usn);
    professors.findOne({
            email: email
        })
        .then(professor => {
            if (professor) {
                console.log(professor);
                bcryptjs.compare(password, professor.password, (err, result) => {
                    if (err) {
                        console.error(err);
                        res.sendStatus(403);
                    }
                    if (result) {
                        let token = jwt.sign({
                            email: professor.email
                        }, 'verySecretValue')
                        res.json({
                            token,
                            professor
                        });
                        // res.sendStatus(200)
                    }
                })
            } else {
                res.sendStatus(404)
            }
        })
})

professorRoutes.use((req, res, next) => {
    if (req.path.includes('/professor/functions')) {
        jwt.verify(req.headers.token, "verySecretValue", (err, result) => {
            if (err) {
                res.sendStatus(400);
            } else {
                if (result.email == req.headers.email) {
                    next();
                } else {
                    res.sendStatus(403);
                }
            }
        });
    } else next();
})

const professorFunctionsRoutes = express.Router();

professorRoutes.use('/functions', professorFunctionsRoutes);

professorFunctionsRoutes.post('/addSemester', (req, res) => {
    // console.log(req.headers.token);
    if (req.headers.semester && req.headers.section) {
        professors.findOneAndUpdate({
            email: req.headers.email
        }, {
            $push: {
                semesters: new semesterModel({
                    semester: req.headers.semester,
                    section: req.headers.section
                })
            }
        }, (err, doc) => {
            if (err) {
                console.error(err);
                res.sendStatus(403)
            } else {
                res.json({
                    doc
                })
            }
        })
    } else {
        res.sendStatus(404)
    }
})

professorFunctionsRoutes.get('/listOfStudents', (req, res) => {
    try {
        student.find({
            semester: req.headers.semester
        }).then(
            students => {
                res.json({
                    students
                })
            }
        )
    } catch (err) {
        console.error(err);
        res.sendStatus(400);
    }
})

professorFunctionsRoutes.post('/updateAttendance', (req, res) => {
    if (!req.headers.studentUsn && !req.headers.subjectCode) {
        res.sendStatus(404)
    }
    student.findOne({
        usn: req.headers.studentUsn
    }).then(student => {
        student.attendance[student.attendance.findIndex(attendance => {
            attendance.subjectCode == req.headers.subjectCode
        })].attendance += 1;
        student.save().then(() => {
            res.sendStatus(200)
        }
        ).catch(err => res.sendStatus(400))
    }).catch(err => {
        console.error(err);
        res.sendStatus(400);
    })
})



module.exports = {
    professorRoutes,
    professorFunctionsRoutes
};