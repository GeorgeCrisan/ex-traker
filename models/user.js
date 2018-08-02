const mongoose = require('mongoose');

const shortId = require('shortid');

const UserSchema = new mongoose.Schema({
_id:{
    type: String,
    default: shortId.generate
},
    username: {
        type: String,
        unique: true,
        required: true
    }


});

const User = mongoose.model('User', UserSchema);

module.exports =  User;