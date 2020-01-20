const express = require('express');
const bodyParser = require('body-parser');


const Posts = require('../models/posts');

const wallRouter = express.Router();
wallRouter.use(bodyParser.json());


wallRouter.route('/')
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /user');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /user');
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /user');
})

wallRouter.route('/:userID/posts')
.get((req, res, next) => {
    Posts.find({})
    .then((posts) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(posts);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Posts.create(req.body)
    .then((post) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(post);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Posts.deleteMany({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})
;


module.exports = wallRouter;
