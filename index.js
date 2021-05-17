const express = require('express');
const app = express()
const studentRoute = require('./model/student')
const authRoute = require('./route/auth')
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/testdb';
const mongoose = require('mongoose')
mongoose.connect(MONGO_URI, {useNewUrlParser:true})



app.use('/api/student/', authRoute)
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})