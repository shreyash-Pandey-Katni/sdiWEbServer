const express = require("express");
const answerSheetRouter = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require('multer');
// const upload = multer({dest:})

answerSheetRouter.post('/answerSheetUpload', (req, res) => {
    try {
        if (!req.headers.test) {
            res.sendStatus(404);
            return;
        }
        if (!fs.existsSync(path.join(path.dirname(__dirname), `assets/AnswerSheets/${req.headers.usn}/${req.headers.test}`))) {
            fs.mkdirSync(path.join(path.dirname(__dirname), `assets/AnswerSheets/${req.headers.usn}/${req.headers.test}`))
        }

        var upload = multer({

            storage: multer.diskStorage({
                destination: path.join(path.dirname(__dirname), `assets/AnswerSheets/${req.headers.usn}/${req.headers.test}`),
                filename: (req, file, cb) => {
                    cb(null, `${req.headers.usn}_${req.headers.test}.${path.extname(file.originalname)}`)
                }
            })
        }).single('file_name');
        upload(req, res, (err) => {
            if (err) {
                res.sendStatus(402)
            } else {
                res.sendStatus(200)
            }
        });
    } catch (error) {
        res.sendStatus(403);
    }
})

answerSheetRouter.get('/checkAnswerSheet', (req, res) => {
    try {
        // if (!req.headers.) {

        // }
    } catch (error) {
        res.sendStatus(403);
    }
})

module.exports = {
    answerSheetRouter
};