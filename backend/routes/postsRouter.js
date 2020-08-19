const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');


const {Posts, Reactions, Comments} = require('../models/posts');
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
/* DEV ONLY
.delete((req, res, next) => {
    Posts.deleteMany({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})
*/

postsRouter.route('/:username')
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    //Get all posts from this User's Wall
    Users.findOne({username : req.params.username})
    .then((OnWallOf) => {
        if(!OnWallOf){
            res.statusCode = 404;
            res.end('User '+req.params.username+' not found.');
        }
        Posts.find({OnWallOf : OnWallOf})
        .sort({'createdAt':-1})
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
    //Add a Post to this User's Wall
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
  //Delete a Post on the User's Wall
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

postsRouter.route('/:postID/reactions')
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    //Get all reactions for a post
    Posts.findOne({_id : req.params.postID})
    .then((post) => {
        if(!post){
            res.statusCode = 403;
            res.end('Post _id: '+req.params.postID+' cannot be found');
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(post.Reactions);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
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
                post.Reactions.push(reaction);
                post.save()
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(post.Reactions);
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
    .then(async (post) => {
        if(!post){
            res.statusCode = 403;
            res.end('Post _id: '+req.params.postID+' cannot be found');
        } else {
            console.log('found post');
            console.log(post);
            console.log(req);
            let reaction = post.Reactions.filter(reaction => reaction.User._id.equals(req.user._id))[0];
            console.log('found reaction');
            console.log(reaction);
            await Reactions.updateOne({_id: reaction._id}, {Type: req.body.Type});
            Posts.findOne({_id : req.params.postID})
            .then((post) => {
                console.log(post);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(post.Reactions);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    //Delete a user's reaction on this post
    Posts.findOne({_id : req.params.postID})
    .then((post) => {
        if(!post){
            res.statusCode = 403;
            res.end('Post _id: '+req.params.postID+' cannot be found');
        } else {
            // console.log('okkkk');
            
            // console.log(post);
            let reaction = post.Reactions.filter(reaction => req.user._id.equals(reaction.User._id))[0];

            Reactions.deleteOne({_id : reaction._id})
            .then((resp) => {
                console.log('Deleted Reaction: '+reaction._id);
                console.log(resp);
                Posts.findOne({_id : req.params.postID})
                .then((post)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(post.Reactions);
                }, (err) => next(err))
                .catch((err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

postsRouter.route('/:postID/comments')
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    //Add a comment to this post for a user
    Posts.findOne({_id : req.params.postID})
    .then((post) => {
        if(!post){
            res.statusCode = 403;
            res.end('Post _id: '+req.params.postID+' cannot be found');
        } else {
            req.body.Author = req.user._id;
            Comments.create(req.body)
            .then((comment) => {
                post.Comments.push(comment);
                post.save();
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(post.Comments);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
// .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     //Get all Comments on a Post
//     Posts.findOne({_id : req.params.postID})
//     .populate({ path: 'Comments',
//                 // Get User for each reaction
//                 populate: [{ path: 'Author' }, { path: 'Reactions', populate:{path:'User'}}, { path: 'Replies' }]
//               })

//     .then((post) => {
//         if(!post){
//             res.statusCode = 403;
//             res.end('Post _id: '+req.params.postID+' cannot be found');
//         } else {
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json(post.Comments);
//         }
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })

module.exports = postsRouter;
