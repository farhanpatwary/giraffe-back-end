const mongoose = require('mongoose')
const val = require('validator');

const Post = mongoose.model('Post', {
    title: {
        type: String,
        required: true,
        default: 'An interesting title'
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    forum: {
        type: String,
        required: true,
    },

})

module.exports = Post