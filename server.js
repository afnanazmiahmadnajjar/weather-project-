const express = require('express')
const app = express()

const path = require('path')
const mongoose = require('mongoose')
const api = require('./server/routes/api')
mongoose.connect("mongodb://0.0.0.0:27017/weather-app", { useNewUrlParser: true })
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))
app.use('/', api)

const port = 3000
app.listen(port, function (){
console.log(`running server in port: ${port}`);
})