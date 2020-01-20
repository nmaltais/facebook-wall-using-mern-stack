const express = require('express');
const path = require('path');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const wallRouter = require('./routes/wallRouter');
const userRouter = require('./routes/userRouter');
const mongoose = require('mongoose');

var app = express();
var port = 3000;
var hostname = 'localhost';


app.use(morgan('dev'));
app.use(bodyParser.json());


app.use('/user', wallRouter);
app.use('/users', userRouter);
// app.use('/comments', commentsRouter);




app.use((req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<html><body><h1>This is an Express Server</h1></body></html>');

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


//Connect to DB
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify:false } );
connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });
