const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: String,
    email: { type: String, unique: true },
    password: String, //hashed password
    profileImageUrl: String,
    favorites: [{
        artistId: String,
        addedAt: Date
    }]
});

module.exports = mongoose.model('User', userSchema);