const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  favoriteGenre:
    {
        type: String,
        required: true,
        unique: false,
        minlength: 1
    },
})

module.exports = mongoose.model('User', schema)