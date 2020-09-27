const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    desc :{
        type: String,
        required: false
    },
    friend: {
        type:String,
        required: false
    },
    blog : {
        type:String,
        required: false
    },
    discussion : {
        type:String,
        required: false
    },

    resetToken : String,
    resetTokenExpiration: String,
})

module.exports = mongoose.model('User', userSchema);