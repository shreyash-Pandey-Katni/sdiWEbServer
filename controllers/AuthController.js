const bcryptjs = require('bcryptjs');
const Student = require('../model/student');
const jwt = require('jsonwebtoken');
const student = require('../model/student');

const register = (req, res, next) => {
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

module.exports = register;