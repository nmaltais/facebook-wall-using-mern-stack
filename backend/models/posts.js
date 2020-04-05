const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reactionSchema = new Schema({
    User : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
        ref: 'User'
    },
    Reactions : {
        type: [{type: mongoose.Schema.Types.ObjectId,
        ref: 'Reaction'}]
    },
    Replies : {
        type: [{type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'}]
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
        ref: 'User'
    },
    Author : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Reactions : {
        type: [{type: mongoose.Schema.Types.ObjectId,
        ref: 'Reaction'}]
    },
    Comments : {
        type: [{type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'}]
    }
}, {
    timestamps: true
});
/*{
	"Text" : "this is a post",
	"Author": {
		"FirstName" : "Nic",
		"LastName":"Maltais",
		"UserID":"123"
	},
	"Reactions": [],
	"Comments": []
}*/


var Posts = mongoose.model('Post', postSchema);
var Reactions = mongoose.model('Reaction', reactionSchema);
var Comments = mongoose.model('Comment', commentSchema);

module.exports = {'Posts' : Posts, 'Reactions' : Reactions, 'Comments' : Comments};
