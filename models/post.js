const mongoose = require('mongoose')

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
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

})

module.exports = Post