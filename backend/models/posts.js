const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    FirstName : {
        type: String
    },
    LastName : {
        type: String
    },
    UserID : {
        type: String
    }
}, {
    timestamps: true
});

const Reaction = new Schema({
    FirstName : {
        type: String
    },
    LastName : {
        type: String
    },
    UserID : {
        type: String
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
        type: User
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
        type: User,
        required: true
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
