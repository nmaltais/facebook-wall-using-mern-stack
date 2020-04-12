const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reactionSchema = new Schema({
    User : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        autopopulate: true
    },
    Type : {
        type : String,
        default: 'Like',
        required: true
    }
}, {
    timestamps: true
});

const commentSchema = new Schema({
    Text : {
        type: String
    },
    Author : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: true
    },
    Reactions : {
        type: [{type: mongoose.Schema.Types.ObjectId,
        ref: 'Reaction',
        autopopulate: true}]
    },
    Replies : {
        type: [{type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            autopopulate: true}]
    }
}, {
    timestamps: true
});

const postSchema = new Schema({
    Text : {
        type: String,
        required: true
    },
    OnWallOf : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: true
    },
    Author : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: true
    },
    Reactions : {
        type: [{type: mongoose.Schema.Types.ObjectId,
        ref: 'Reaction',
        autopopulate: true}]
    },
    Comments : {
        type: [{type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        autopopulate: true}]
    }
}, {
    timestamps: true
});

reactionSchema.plugin(require('mongoose-autopopulate'));
postSchema.plugin(require('mongoose-autopopulate'));
commentSchema.plugin(require('mongoose-autopopulate'));

var Posts = mongoose.model('Post', postSchema);
var Reactions = mongoose.model('Reaction', reactionSchema);
var Comments = mongoose.model('Comment', commentSchema);

module.exports = {'Posts' : Posts, 'Reactions' : Reactions, 'Comments' : Comments};
