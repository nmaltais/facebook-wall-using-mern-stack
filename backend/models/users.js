const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    UserID : {
        type: String,
        required: true
    },
    FirstName : {
        type: String,
        required: true
    },
    LastName : {
        type: String,
        required: true
    },
    Email : {
        type: String,
        required: true
    },
    Password : {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


/*

{
	"FirstName" : "Nic",
	"LastName": "Maltais",
	"UserID": "123",
    "Email": "nic.maltais@gmail.com"
	"Password": "1234"
}

*/

var Users = mongoose.model('User', userSchema);

module.exports = Users;
