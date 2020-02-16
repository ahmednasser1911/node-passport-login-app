const mongoose = require('mongoose')
const validator = require('validator')
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    } ,
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value))
                throw new Error('Enter valid email!')
        }
    } ,
    password: {
        type: String,
        required: true,
        minlength:6
    } ,
    date: {
        type: Date,
        default: Date.now
    } ,
})

const User = mongoose.model('User' , UserSchema)

module.exports = User