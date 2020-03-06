const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const {Reactions} = require('../models/posts');

const reactionsRouter = express.Router();
reactionsRouter.use(bodyParser.json());

// reactionsRouter.options('*', cors.corsWithOptions, (req,res) => {
//     res.sendStatus(200);
// })

reactionsRouter.route('/')
.delete(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    Reactions.deleteMany({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.get(cors.corsWithOptions, authenticate.verifyUser,(req, res, next) => {
    Reactions.find({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})


module.exports = reactionsRouter;
