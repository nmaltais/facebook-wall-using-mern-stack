const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Reaction = new Schema({
    User : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Type : {
        type : String,
        default: 'Like'
    }
}, {
    timestamps: true
});

const Comment = new Schema({
    Text : {
        type: String
    },
    Author : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Reactions : {
        type: [Reaction]
    }
}, {
    timestamps: true
});

const postSchema = new Schema({
    Text : {
        type: String,
        required: true
    },
    Author : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Reactions : {
        type: [Reaction]
    },
    Comments : {
        type: [Comment]
    }
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

module.exports = Posts;
