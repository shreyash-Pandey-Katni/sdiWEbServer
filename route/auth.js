const express = require('express');
const bcryptjs = require('bcryptjs');
const Student = require('../model/student');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const router = express.Router();
const path = require('path');
const mongoose = require('mongoose');

const authController = require('../controllers/AuthController');


router.post('/register', (req, res, next) => {
    if (req.headers.name && req.headers.phone && req.headers.email && req.headers.password && req.headers.usn) {
        bcryptjs.hash(req.headers.password, 10, (err, hashPassword) => {
            if (err) {
                res.json({
                    error: err
                })
            }
            let student = new Student.student({
                name: req.headers.name,
                phone: req.headers.phone,
                email: req.headers.email,
                password: hashPassword,
                usn: req.headers.usn,
                semester: req.headers.semester,
                section: req.headers.section,
                batch: req.headers.batch
                // usn: req.headers.usn
            })

            student.save()
                .then(student => {
                    try {
                        if (!fs.existsSync(path.join(__dirname, 'assets/AnswerSheets', req.headers.usn))) {
                            fs.mkdirSync(path.join(__dirname, 'assets/AnswerSheets', req.headers.usn))
                        }
                    } catch (error) {
                        console.log(error);
                    }
                    res.sendStatus(200);
                })
                .catch(err => {
                    console.error(err);
                    res.sendStatus(403);
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
module.exports = router;