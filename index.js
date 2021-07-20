const express = require("express");
const app = express();
const studentRoute = require("./model/student");
const authRoute = require("./route/auth");
const mongoose = require("mongoose");
const xlsx = require("xlsx");
const path = require("path");
const jwt = require("jsonwebtoken");
const notesRouter = require("./route/notes");
const { answerSheetRouter } = require("./route/answerSheets");
const { professorRoutes } = require("./route/professorRoutes");

const PORT = process.env.PORT || 4000;
const MONGO_URI =
    process.env.MONGO_URI ||
    "mongodb+srv://dbUser:dbpassword@cluster0.i1db9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

app.use((req, res, next) => {
    if (req.path.includes("/api/")) {
        jwt.verify(req.headers.token, "verySecretValue", (err, result) => {
            if (err) {
                res.sendStatus(400);
            } else {
                if (result.usn == req.headers.usn) {
                    next();
                } else {
                    res.sendStatus(403);
                }
            }
        });
    } else {
        next();
    }
});
app.use('/professor', professorRoutes);
app.use("/api/notes", notesRouter);
app.use("/api/answerSheets", answerSheetRouter);
app.get("/api/timetable", (req, res) => {
    var workbook = xlsx.readFile(
        path.join(__dirname, "assets", "timetable", "timetable.xlsx")
    );
    try {
        if (
            !workbook.SheetNames.includes(
                `${req.headers.semester}-${req.headers.section}`
            )
        ) {
            res.sendStatus(403);
        } else {
            res.json(
                xlsx.utils.sheet_to_json(
                    workbook.Sheets[`${req.headers.semester}-${req.headers.section}`]
                )
            );
        }
        // res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(403);
    }
});
app.use("/students", authRoute);



app.get("/api/stackOverFlow/questions", (req, res) => {
    var branch = req.headers.branch;
    var subject = req.headers.subject;
    var year = req.headers.year;

    if (req.headers.token && branch && subject && year) {
        studentRoute.stackOverFlowQuestion
            .find({
                year: year,
                branch: branch,
                subject: subject,
            })
            .limit(50)
            .then((questions) => {
                if (questions) {
                    res.json({
                        questions,
                    });
                } else {
                    res.sendStatus(404);
                }
            });
    } else {
        res.sendStatus(403);
    }
});

app.post("/api/stackOverFlow/addQuestion", (req, res) => {
    studentRoute.student
        .findOne({
            usn: req.headers.usn,
        })
        .then((student) => {
            console.log(student);
            let question = new studentRoute.stackOverFlowQuestion({
                question: req.headers.question,
                author: student._id,
                subject: req.headers.subject,
                branch: req.headers.branch,
                year: req.headers.year,
            });
            question
                .save()
                .then((val) => {
                    console.log(val);
                    res.sendStatus(200);
                })
                .catch((err) => {
                    console.error(err);
                    res.sendStatus(400);
                });
        })
        .catch((err) => {
            console.error(err);
        });
});

app.get("/api/stackOverFlow/getQuestion/:question", (req, res) => {
    studentRoute.stackOverFlowQuestion.findById(
        req.params.question + "",
        (err, queryResult) => {
            if (err) {
                res.sendStatus(404);
            } else {
                res.json({
                    queryResult,
                });
            }
        }
    );
});

app.post("/api/stackOverFlow/addAnswer/:questionId", (req, res) => {
    studentRoute.student
        .findOne({
            usn: req.headers.usn,
        })
        .then((student) => {
            let answerNew = new studentRoute.answersModelStackOverFlow({
                answer: req.headers.answer,
                author: student._id,
            });
            answerNew.save().then((val) => {
                studentRoute.stackOverFlowQuestion.findOneAndUpdate({
                        _id: req.params.questionId,
                    }, {
                        $push: {
                            answer: val,
                        },
                    },
                    (err, queryResult) => {
                        if (err) {
                            console.error(err);
                            res.sendStatus(404);
                        } else {
                            queryResult.save();
                            res.json(queryResult);
                        }
                    }
                );
            });
        });
});

app.post("/api/stackOverFlow/upVoteAnswer/:answerId", (req, res) => {
    // console.log(req.headers.questionid);

    studentRoute.answersModelStackOverFlow
        .findByIdAndUpdate(req.params.answerId, {
            $inc: {
                upVotes: 1,
            },
        })
        .then((updatedAnswer) => {
            studentRoute.stackOverFlowQuestion
                .findOne({
                        _id: req.headers.questionid,
                    },
                    (err, question) => {
                        if (err) {
                            res.sendStatus(403);
                        } else {
                            question.answer[
                                question.answer.findIndex(
                                    (ans) => ans._id.toString() === updatedAnswer._id.toString()
                                )
                            ] = updatedAnswer;
                            question.save();
                        }
                    }
                )
                .then((val) => {
                    studentRoute.student
                        .findByIdAndUpdate(updatedAnswer.author, {
                            $inc: {
                                marks: 1,
                            },
                        })
                        .then((student) => {
                            res
                                .json({
                                    val,
                                })
                                .catch((e) => {
                                    console.log("Facing Error in saving student");
                                });
                        });
                });
        });
});

app.post("/api/stackOverFlow/downVoteAnswer/:answerId", (req, res) => {
    studentRoute.answersModelStackOverFlow
        .findByIdAndUpdate(req.params.answerId, {
            $inc: {
                downVotes: 1,
            },
        })
        .then((updatedAnswer) => {
            studentRoute.stackOverFlowQuestion.findOne({
                    _id: req.headers.questionid,
                },
                (err, question) => {
                    if (err) {
                        res.sendStatus(403);
                    } else {
                        question.answer[
                            question.answer.findIndex(
                                (ans) => ans._id.toString() === updatedAnswer._id.toString()
                            )
                        ] = updatedAnswer;

                        question.save().then((value) => {
                            studentRoute.student.findByIdAndUpdate(updatedAnswer.author, {
                                $inc: {
                                    marks: -1
                                }
                            }).then(student => res.json(value))
                        });
                    }
                }
            );
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});