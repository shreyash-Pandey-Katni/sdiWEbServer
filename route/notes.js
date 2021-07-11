const express = require("express");
const notesRouter = express.Router();
const fs = require("fs");
const path = require("path");

notesRouter.get("/listOfSubjects", (req, res, next) => {
    var listOfSubjects = [];
    // console.log(path.join(path.dirname(__dirname), `assets/Notes/Sem_${req.headers.semester}`));
    try {
        fs.readdir(
            path.join(
                path.dirname(__dirname),
                `assets/Notes/Sem_${req.headers.semester}`
            ),
            (err, folders) => {
                folders.forEach((folder) => listOfSubjects.push(folder));
                res.json({
                    listOfSubjects,
                });
            }
        );
    } catch (e) {
        res.sendStatus(503);
    }
});

notesRouter.get("/listOfNotes", (req, res, next) => {
    var listOfNotes = []
    try {
        fs.readdir(
            path.join(
                path.dirname(__dirname),
                `assets/Notes/Sem_${req.headers.semester}/${req.headers.subject}`
            ),

            (err, notes) => {
                if (err) {
                    res.sendStatus(404)
                } else {
                    notes.forEach(note => {
                        if (path.extname(note) == '.pdf') {
                            listOfNotes.push(note)
                        }
                    })
                    res.json({
                        listOfNotes
                    })
                }
            }
        );
    } catch (error) {
        res.sendStatus(503);
    }
});

notesRouter.get('/getNotes', (req, res, next) => {
    try {
        res.sendFile(path.join(
            path.dirname(__dirname),
            `assets/Notes/Sem_${req.headers.semester}/${req.headers.subject}/${req.headers.file_name}`
        ))
    } catch (error) {
        res.sendStatus(404)
    }
})

notesRouter.get('/listOfYears', (req, res, next) => {
    var listOfYears = [];
    // console.log(path.join(path.dirname(__dirname), `assets/Notes/Sem_${req.headers.semester}`));
    try {
        fs.readdir(
            path.join(
                path.dirname(__dirname),
                `assets/Notes/UG_Question_Papers`
            ),
            (err, folders) => {
                folders.forEach((folder) => listOfYears.push(folder));
                res.json({
                    listOfYears,
                });
            }
        );
    } catch (e) {
        res.sendStatus(503);
    }
})

notesRouter.get('/getExamListOfYear', (req, res, next) => {
    var listOfExams = [];
    // console.log(path.join(path.dirname(__dirname), `assets/Notes/Sem_${req.headers.semester}`));
    try {
        fs.readdir(
            path.join(
                path.dirname(__dirname),
                `assets/Notes/UG_Question_Papers/${req.headers.year}`
            ),
            (err, folders) => {
                if (err) {
                    res.sendStatus(404)
                } else {
                    folders.forEach((folder) => listOfExams.push(folder.split(' ')[2].split('-')[0]));
                    res.json({
                        listOfExams,
                    });
                }
            }
        );
    } catch (e) {
        res.sendStatus(503);
    }
})

notesRouter.get('/getListOfAvailableSemesters', (req, res, next) => {
    var listOfAvailableSemesters = [];
    // console.log(path.join(path.dirname(__dirname), `assets/Notes/Sem_${req.headers.semester}`));
    try {
        fs.readdir(
            path.join(
                path.dirname(__dirname),
                `assets/Notes/UG_Question_Papers/${req.headers.year}/BE QP ${req.headers.month}-${req.headers.year}`
            ),
            (err, folders) => {
                if (err) {
                    res.sendStatus(404)
                } else {
                    folders.forEach((folder) => listOfAvailableSemesters.push(folder));
                    res.json({
                        listOfAvailableSemesters,
                    });
                }
            }
        );
    } catch (e) {
        res.sendStatus(503);
    }
});

notesRouter.get('/getPreviousYearQuestionPapers', (req, res, next) => {
    var listOfAvailableQuestionPapers = [];
    // console.log(path.join(path.dirname(__dirname), `assets/Notes/Sem_${req.headers.semester}`));
    try {
        fs.readdir(
            path.join(
                path.dirname(__dirname),
                `assets/Notes/UG_Question_Papers/${req.headers.year}/BE QP ${req.headers.month}-${req.headers.year}/${req.headers.semester_month}`
            ),
            (err, folders) => {
                if (err) {
                    res.sendStatus(404)
                } else {
                    folders.forEach((folder) => listOfAvailableQuestionPapers.push(folder));
                    res.json({
                        listOfAvailableQuestionPapers,
                    });
                }
            }
        );
    } catch (e) {
        res.sendStatus(503);
    }
})

notesRouter.get('/downloadQuestionPaper', (req, res) => {
    var listOfAvailableQuestionPapers = [];
    // console.log(path.join(path.dirname(__dirname), `assets/Notes/Sem_${req.headers.semester}`));
    try {
        res.sendFile(path.join(
            path.dirname(__dirname),
            `assets/Notes/UG_Question_Papers/${req.headers.year}/BE QP ${req.headers.month}-${req.headers.year}/${req.headers.semester_month}/${req.headers.file_name}`
        ));
    } catch (e) {
        res.sendStatus(503);
    }
})

module.exports = notesRouter;