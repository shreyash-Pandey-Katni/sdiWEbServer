const express = require('express');
const bcryptjs = require('bcryptjs');
const Student = require('../model/student');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');

const authController = require('../controllers/AuthController');
const {
    grievance
} = require('../model/grivience');


router.post('/register', (req, res, next) => {
    if (req.headers.name && req.headers.phone && req.headers.email && req.headers.password && req.headers.usn) {
        bcryptjs.hash(req.headers.password, 10, (err, hashPassword) => {
            if (err) {
                res.json({
                    error: err
                })
                return;
            }
            let semester = new Student.semesterModel({
                semester: req.headers.semester,
                section: req.headers.section
            });
            semester.save((err, data) => {
                if (err) {
                    res.json({
                        error: err
                    })
                    return;
                }
                let student = new Student.student({
                    name: req.headers.name,
                    phone: req.headers.phone,
                    email: req.headers.email,
                    password: hashPassword,
                    usn: req.headers.usn,
                    batch: req.headers.batch,
                    semester: data
                });
                student.save((err, data) => {
                    if (err) {
                        res.json({
                            error: err
                        })
                        return;
                    }
                    try {
                        if (!fs.existsSync(path.join(__dirname, 'assets/AnswerSheets', req.headers.usn))) {
                            fs.mkdirSync(path.join(__dirname, 'assets/AnswerSheets', req.headers.usn))
                        }
                    } catch (error) {
                        console.log(error);
                    }
                    res.json({
                        success: true
                    })
                })
            })

        })

    } else {
        res.sendStatus(404);
    }
});
router.get('/login', (req, res, next) => {
    // console.log(req);
    var password = req.headers.password;
    var usnNumber = req.headers.usn;
    // console.log(req.headers.usn);
    Student.student.findOne({
            usn: usnNumber
        })
        .then(students => {
            if (students) {
                bcryptjs.compare(password, students.password, (err, result) => {
                    if (err) {
                        res.sendStatus(403);
                    }
                    if (result) {
                        let token = jwt.sign({
                            usn: students.usn
                        }, 'verySecretValue')
                        res.json({
                            token,
                            students
                        });
                        // res.sendStatus(200)
                    }
                })
            } else {
                res.sendStatus(404)
            }
        })
});

router.get('/getAttendance', (req, res) => {
    jwt.verify(req.headers.token, 'verySecretValue', (err, decoded) => {
        if (decoded.usn == req.headers.usn) {
            Student.student.findOne({
                    usn: req.headers.usn
                })
                .then(students => {
                    if (students) {
                        res.json({
                            attendance: students.attendance
                        })
                    } else {
                        res.sendStatus(404)
                    }
                })
        }
    })
})

router.post('/addSubject', (req, res) => {
    jwt.verify(req.headers.token, 'verySecretValue', (err, decoded) => {
        if (decoded.usn == req.headers.usn) {
            Student.student.findOne({
                    usn: req.headers.usn
                })
                .then(students => {
                    if (students) {
                        let subject = {
                            subject: req.headers.subject_code,
                            attendance: req.headers.attendance
                        }
                        students.attendance.push(subject);
                        students.save()
                            .then(students => {
                                res.sendStatus(200);
                            })
                    } else {
                        res.sendStatus(404)
                    }
                })
        }
    })
})

router.post('/addGrievance', (req, res) => {
    jwt.verify(req.headers.token, 'verySecretValue', (err, decoded) => {
        if (decoded.usn == req.headers.usn) {
            if (req.headers.isAnnonymous) {
                let newGrievance = new grievance({
                    anonymous: true,
                    details: req.headers.details,
                });
                newGrievance.save().then(newGrievance => {
                    res.sendStatus(200);
                }).catch(err => {
                    res.sendStatus(500);
                })
            } else {
                let newGrievance = new grievance({
                    anonymous: false,
                    details: req.headers.details,
                    usn: req.headers.usn,
                });
                newGrievance.save().then(newGrievance => {
                    res.json({
                        newGrievance
                    })
                }).catch(err => {
                    res.sendStatus(500);
                })
            }
        }
    })
})

module.exports = router;