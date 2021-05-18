const bcryptjs = require('bcryptjs');
const Student = require('../model/student');
const jwt = require('jsonwebtoken');
// const student = require('../model/student');

const register = (req, res, next) => {
    if (req.headers.user && req.headers.phone && req.headers.email && req.headers.password && req.headers.usn) {
        bcryptjs.hash(req.headers.password, 10, (err, hashPassword) => {
            if (err) {
                res.json({
                    error:err
                })
            }
            let student = new Student({
                name: req.headers.user,
                phone: req.headers.phone,
                email: req.headers.email,
                password: hashPassword,
                usn: req.headers.usn
            })
        
            student.save()
            .then(student => {
                res.sendStatus(200);
            })
            .catch(err => {
                res.sendStatus(403);
            })
        })
    }
    else {
        res.sendStatus(404);
    }
}

const login = (req, res, next) => {
    // console.log(req);
    var password = req.headers.password;
    var usn = req.headers.usn;
    // console.log(req.headers.usn);
    Student.findOne({usn: this.usn})
    .then(students => {
        if (students) {
            bcryptjs.compare(password, students.password, (err, result) => {
                if (err || students.usn != null) {
                    res.sendStatus(403);
                }
                if (result) {
                    let token = jwt.sign({usn:students.usn}, 'verySecretValue', {expiresIn:'1h'})
                    res.json({
                        token
                    });
                    // res.sendStatus(200)
                }
            })
        } else {
            res.sendStatus(404)
        }
    })
}

module.exports = {register, login};