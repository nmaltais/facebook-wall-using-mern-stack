const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');


const {Posts, Reactions} = require('../models/posts');
const Users = require('../models/users');

const postsRouter = express.Router();
postsRouter.use(bodyParser.json());

postsRouter.options('*', cors.corsWithOptions, (req,res) => {
    res.sendStatus(200);
})
postsRouter.route('/')
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Posts.find({})
    .then((posts) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(posts);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /user');
});

postsRouter.route('/:username')
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Users.findOne({username : req.params.username})
    .then((OnWallOf) => {
        if(!OnWallOf){
            res.statusCode = 404;
            res.end('User '+req.params.username+' not found.');
        }
        Posts.find({OnWallOf : OnWallOf})
        .sort({'createdAt':-1})
        .populate('Author')
        .populate('OnWallOf')
        .populate({ path: 'Reactions',
                    // Get User for each reaction
                    populate: { path: 'User' }
                  })
        .then((posts) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(posts);
        }, (err) => next(err))
        .catch((err) => next(err));
    }, (err) => next(err))
    .catch((err) => next(err));

})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    req.body.Author = req.user._id;
    console.log(req.params.username);
    Users.findOne({username : req.params.username})
    .then((OnWallOf) => {
        req.body.OnWallOf = OnWallOf._id;

        Posts.create(req.body)
        .then((post) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(post);
        }, (err) => next(err))
        .catch((err) => next(err));
    }, (err) => next(err))
    .catch((err) => next(err));
});
postsRouter.route('/:postID') //Would conflict with /:username .delete if implemented
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  //Delete a post on a user's post
    Posts.findOne({OnWallOf : req.user, _id : req.params.postID})
    .then((post) => {
        console.log('post');
        console.log(post);
        if(!post){
            res.statusCode = 403;
            res.end('You cannot delete this post');
        } else {
            Posts.deleteOne({_id: post._id})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

postsRouter.route('/react/:postID')
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    //Add a reaction to this post for a user
    Posts.findOne({_id : req.params.postID})
    .then((post) => {
        if(!post){
            res.statusCode = 403;
            res.end('Post _id: '+req.params.postID+' cannot be found');
        } else {
            req.body.User = req.user._id;
            Reactions.create(req.body)
            .then((reaction) => {
                post.Reactions.push(reaction._id);
                post.save()
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(post);
                // .then((post) => {
                //     Post.findById(post._id)
                //     .populate('Reactions')
                //     .then((post) => {
                //         res.statusCode = 200;
                //         res.setHeader('Content-Type', 'application/json');
                //         res.json(post);
                //     }, (err) => next(err))
                //     .catch((err) => next(err));
                // }, (err) => next(err))
                // .catch((err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    //Change the reaction of this user on this post
    console.log('updating');
    Posts.findById(req.params.postID)
    .populate('Reactions')
    .then(async (post) => {
        if(!post){
            res.statusCode = 403;
            res.end('Post _id: '+req.params.postID+' cannot be found');
        } else {
            console.log('found post');
            console.log(post);
            let reaction = post.Reactions.filter(reaction => reaction.User._id.equals(req.user._id))[0];
            console.log('found reaction');
            console.log(reaction);
            await Reactions.updateOne({_id: reaction._id}, {Type: req.body.Type});
            Posts.findOne({_id : req.params.postID})
            .populate('Reactions')
            .then((post) => {
                console.log(post);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(post);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    //Delete a user's reaction on this post
    Posts.findOne({_id : req.params.postID})
    .populate('Reactions')
    .then((post) => {
        if(!post){
            res.statusCode = 403;
            res.end('Post _id: '+req.params.postID+' cannot be found');
        } else {

            let reaction = post.Reactions.filter(reaction => req.user._id.equals(reaction.User))[0];

            Reactions.deleteOne({_id : reaction._id})
            .then((resp) => {
                console.log('Deleted Reaction: '+reaction._id);
                console.log(resp);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = postsRouter;
