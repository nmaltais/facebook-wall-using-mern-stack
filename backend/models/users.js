var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
    firstname : {
        type: String
    },
    lastname : {
        type: String
    },
    username : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    avatarColor : {
        type: String
    },
    admin:   {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passportLocalMongoose, { usernameField : 'email' });

module.exports = mongoose.model('User', userSchema);

/*

{
	"firstname" : "Nic",
	"lastname": "Maltais",
    "email": "nic.maltais@gmail.com",
	"password": "password",
    "admin" : false
}

*/
