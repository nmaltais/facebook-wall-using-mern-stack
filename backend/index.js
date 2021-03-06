const express = require('express');
const path = require('path');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const postsRouter = require('./routes/postsRouter');
const commentsRouter = require('./routes/commentsRouter');
const reactionsRouter = require('./routes/reactionsRouter');
const userRouter = require('./routes/userRouter');
const mongoose = require('mongoose');
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

var app = express();
var port = 3000;
var hostname = 'localhost';


app.use(morgan('dev'));
app.use(bodyParser.json());


app.use(passport.initialize());
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);
app.use('/users', userRouter);
app.use('/reactions', reactionsRouter);


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
const url = 'mongodb://localhost:27017/facebookWall';
const connect = mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify:false } );
connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });
