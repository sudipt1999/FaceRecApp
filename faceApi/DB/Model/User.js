var mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
    },

    email: {
        required: true,
        minLength: 1,
        trim: true,
        unique: true,
        type: String,
        validator: (value) => {
            return validator.isEmail(value);
        },
        message: "not a valid email"

    },
    password: {
        type: String,
        required: true,
    },
    entries: {
        type: Number
    },
    joined: {
        type: Date
    }
});

const User = mongoose.model('FaceAppUser', UserSchema);
module.exports = { User };