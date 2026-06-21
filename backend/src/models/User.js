const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId; // Password is required only if googleId is not present
        }
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows multiple documents to have null values for googleId
    }
});
const User = mongoose.model('User', userSchema);
module.exports = User;