const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');


const {Posts, Reactions, Comments} = require('../models/posts');

const commentsRouter = express.Router();
commentsRouter.use(bodyParser.json());

commentsRouter.options('*', cors.corsWithOptions, (req,res) => {
    res.sendStatus(200);
})
commentsRouter.route('/')
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    //Get all Comments
    Comments.find({})
    .then((comments) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(comments);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    //Delete all Comments
    Comments.deleteMany({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})

commentsRouter.route('/:commentID')
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  //Delete a particular Comment
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

commentsRouter.route('/:commentID/reactions')
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    //Add a reaction to this comment for a user
    Comments.findOne({_id : req.params.commentID})
    .then((comment) => {
        if(!comment){
            res.statusCode = 403;
            res.end('Comment _id: '+req.params.commentID+' cannot be found');
        } else {
            req.body.User = req.user._id;
            Reactions.create(req.body)
            .then((reaction) => {
                comment.Reactions.push(reaction);
                comment.save()
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(comment.Reactions);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    //Change the reaction of this user on this comment
    Comments.findById(req.params.commentID)
    .then(async (comment) => {
        if(!comment){
            res.statusCode = 403;
            res.end('Comment _id: '+req.params.commentID+' cannot be found');
        } else {
            console.log('found comment');
            console.log(comment);
            let reaction = comment.Reactions.filter(reaction => reaction.User._id.equals(req.user._id))[0];
            console.log('found reaction');
            console.log(reaction);
            await Reactions.updateOne({_id: reaction._id}, {Type: req.body.Type});
            Comments.findOne({_id : req.params.commentID})
            .then((comment) => {
                console.log(comment);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(comment.Reactions);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    //Delete a user's reaction on this comment
    Comments.findOne({_id : req.params.commentID})
    .then((comment) => {
        if(!comment){
            res.statusCode = 403;
            res.end('Comment _id: '+req.params.commentID+' cannot be found');
        } else {

            let reaction = comment.Reactions.filter(reaction => req.user._id.equals(reaction.User._id))[0];

            Reactions.deleteOne({_id : reaction._id})
            .then((resp) => {
                console.log('Deleted Reaction: '+reaction._id);
                console.log(resp);
                Comments.findOne({_id : req.params.commentID})
                .then((comment)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(comment.Reactions);
                }, (err) => next(err))
                .catch((err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

commentsRouter.route('/:commentID/replies')
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    //Add a reply to this comment for a user
    Comments.findOne({_id : req.params.commentID})
    .then((comment) => {
        if(!comment){
            res.statusCode = 403;
            res.end('Comment _id: '+req.params.commentID+' cannot be found');
        } else {
            req.body.Author = req.user._id;
            Comments.create(req.body)
            .then((reply) => {
                comment.Replies.push(reply);
                comment.save()
                
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(comment.Replies);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    //Get replies for a comment 
    Comments.findOne({_id : req.params.commentID})
    .then((comment) => {
        if(!comment){
            res.statusCode = 403;
            res.end('Comment _id: '+req.params.commentID+' cannot be found');
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(comment.Replies);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = commentsRouter;
