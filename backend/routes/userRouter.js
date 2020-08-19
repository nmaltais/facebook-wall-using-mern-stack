const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
var passport = require('passport');
const cors = require('./cors');


const Users = require('../models/users');

const userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.options('*', cors.corsWithOptions, (req,res) => {
    res.sendStatus(200);
})

/* DEV ONLY
userRouter.route('/')
.get((req, res, next) => {
    Users.find({})
    .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /users');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /users');
})
.delete((req, res, next) => {
    Users.deleteMany({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})
*/

userRouter.post('/signup', cors.corsWithOptions, (req, res, next) => {
  //Get random color for account
  const colors = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey', 'black']
  let color = colors[Math.floor(Math.random() * 12)];

  req.body.avatarColor = color;

  Users.register(new Users(req.body),
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
});

userRouter.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  Users.findOne({_id: req.user._id})
  .then((user) => {
      res.json({success: true, token: token, user: user, status: 'You are successfully logged in!'});
  });
});

userRouter.get('/logout', cors.corsWithOptions, (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = userRouter;
