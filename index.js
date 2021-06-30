const express = require('express');
const app = express()
const studentRoute = require('./model/student')
const authRoute = require('./route/auth')
const mongoose = require('mongoose')
const xlsx = require('xlsx');
const path = require('path');
const jwt = require('jsonwebtoken');


const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://dbUser:dbpassword@cluster0.i1db9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.get('/api/timetable', (req, res) => {
    var workbook = xlsx.readFile(path.join(__dirname, 'assets', 'timetable', 'timetable.xlsx'));
    try {
        if (!workbook.SheetNames.includes(`${req.headers.semester}-${req.headers.section}`)) {
            res.sendStatus(403);
        } else {
            res.json(
                xlsx.utils.sheet_to_json(workbook.Sheets[`${req.headers.semester}-${req.headers.section}`])
            );
        }
        // res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(403);
    }
})
app.use('/api/students', authRoute)

app.get('/api/stackOverFlow/questions', (req, res) => {
    var branch = req.headers.branch
    var subject = req.headers.subject
    var year = req.headers.year


    if (req.headers.token && branch && subject && year && jwt.verify(req.headers.token)) {
        studentRoute.stackOverFlowQuestion.find({
            year: year,
            branch: branch,
            subject: subject
        }).limit(10).then(questions => {
            if (questions) {
                res.json({
                    questions
                })
            } else {
                res.sendStatus(404);
            }
        })
    } else {
        res.sendStatus(403);
    }
})




app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})