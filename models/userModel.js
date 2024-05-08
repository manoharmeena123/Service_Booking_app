const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        joi: Joi.string().email().required(),
    },
    password: {
        type: String,
        required: true,
        joi: Joi.string().required(),
    },
    mobileNumber: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /\d{10}/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit mobile number!`
        }
    }
});

module.exports = mongoose.model('user', userSchema);
